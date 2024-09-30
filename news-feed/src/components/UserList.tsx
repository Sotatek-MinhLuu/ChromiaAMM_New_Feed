"use client";

import { useQuery } from "@/app/hook";
import UserItem, { UsersDto } from "./UserItem";

export type GetUsersReturnType = {
  pointer: number;
  users: UsersDto[];
};

export default function UsersList() {
  // Define an example array of users

  const { result: users } = useQuery<GetUsersReturnType>("get_users", {
    n_users: 100,
    pointer: 0,
  });
  console.log("users", users);
  return (
    <div className="p-4 md:p-8">
      <ul>
        {users && users.users.length > 0 ? (
          users.users.map((user, index) => (
            <li key={user.id.toString()}>
              {/* Render the UserItem component for each user */}
              <UserItem user={user} />
              {/* Add a horizontal line between user items */}
              {index < users.users.length - 1 && (
                <hr className="my-4 border-t border-gray-300" />
              )}
            </li>
          ))
        ) : (
          <></>
        )}
      </ul>
    </div>
  );
}
