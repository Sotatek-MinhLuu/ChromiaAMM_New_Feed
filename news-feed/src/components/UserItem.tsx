"use client";

import { useState } from "react";
import { useSessionContext } from "./ContextProvider";
import { useQuery } from "@/app/hook";

export type UsersDto = {
  name: string;
  id: Buffer;
};

export default function UserItem({ user }: { user: UsersDto }) {
  // Step 1: Initialize state variables
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const session = useSessionContext();
  const accountId = session?.account.id;
  const { result: isFollowing, reload: updateIsFollowing } = useQuery<boolean>(
    "is_following",
    accountId ? { my_id: accountId, your_id: user.id } : undefined
  );
  // Step 2: Handle follow/unfollow click
  const handleFollowClick = async (userId: Buffer, follow: boolean) => {
    if (!session) return;
    try {
      setIsLoading(true);
      // Step 3: Handle follow/unfollow logic
      await session.call({
        name: follow ? "follow_user" : "unfollow_user",
        args: [userId],
      });
      updateIsFollowing();
    } catch (error) {
      console.log(error);
    } finally {
      // Step 4: Reset the loading indicator
      setIsLoading(false);
    }
  };
  // Render the component
  return (
    <div className="flex justify-between mb-4">
      <div className="flex items-center">
        {/* User Avatar or Image */}
        <div className="w-10 h-10 bg-gray-300 rounded-full mr-4 flex justify-center items-center">
          {user.name[0]}
        </div>
        <span className="text-lg font-semibold">{user.name}</span>
      </div>
      <button
        className={`${
          isLoading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
        } w-32 hover:cursor-pointer text-white font-bold py-2 px-4 rounded float-right`}
        disabled={isLoading}
        onClick={() => handleFollowClick(user.id, !isFollowing)}
      >
        {isLoading ? "Loading..." : isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
}
