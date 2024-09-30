"use client";

import { getRandomUserName } from "@/app/utils";
import {
  Session,
  createKeyStoreInteractor,
  createSingleSigAuthDescriptorRegistration,
  createWeb3ProviderEvmKeyStore,
  hours,
  registerAccount,
  registrationStrategy,
  ttlLoginRule,
} from "@chromia/ft4";
import { createClient } from "postchain-client";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

declare global {
  interface Window {
    ethereum: any;
  }
}

// Create context for Chromia session
const ChromiaContext = createContext<Session | undefined>(undefined);

declare global {
  interface Window {
    ethereum: any;
  }
}

export function ContextProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | undefined>(undefined);
  console.log("session", session);
  useEffect(() => {
    const initSession = async () => {
      console.log("Initializing Session");
      // 1. Initialize Client
      const client = await createClient({
        nodeUrlPool: "http://localhost:7740",
        blockchainRid:
          "56CD5AF063641F865E00627D7C39A54BA2E7C676F0E701D23EE3A001B1804B9D",
      });

      // 2. Connect with MetaMask
      const evmKeyStore = await createWeb3ProviderEvmKeyStore(window.ethereum);

      // 3. Get all accounts associated with evm address
      const evmKeyStoreInteractor = createKeyStoreInteractor(
        client,
        evmKeyStore
      );
      const accounts = await evmKeyStoreInteractor.getAccounts();
      console.log("accounts", accounts);

      if (accounts.length > 0) {
        // 4. Start a new session
        const { session } = await evmKeyStoreInteractor.login({
          accountId: accounts[0].id,
          config: {
            rules: ttlLoginRule(hours(2)),
            flags: ["MySession"],
          },
        });
        setSession(session);
      } else {
        // 5. Create a new account by signing a message using metamask
        const authDescriptor = createSingleSigAuthDescriptorRegistration(
          ["A", "T"],
          evmKeyStore.id
        );
        const { session } = await registerAccount(
          client,
          evmKeyStore,
          registrationStrategy.open(authDescriptor, {
            config: {
              rules: ttlLoginRule(hours(2)),
              flags: ["MySession"],
            },
          }),
          {
            name: "register_user",
            args: [getRandomUserName()],
          }
        );
        setSession(session);
      }
      console.log("Session initialized");
    };

    initSession().catch(console.error);
  }, []);

  return (
    <ChromiaContext.Provider value={session}>
      {children}
    </ChromiaContext.Provider>
  );
}

// Define hooks for accessing context
export function useSessionContext() {
  return useContext(ChromiaContext);
}
