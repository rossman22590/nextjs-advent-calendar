"use client";

import { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  claimed_days: number;
  wheel_spins: number;
}

interface UserTableProps {
  users: User[];
}

export default function UserTable({ users }: UserTableProps) {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="mb-4">
        <Input
          placeholder="Search users by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="lg"
          isClearable
          onClear={() => setSearch("")}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-3">Email</th>
              <th className="text-center p-3">Days Claimed</th>
              <th className="text-center p-3">Wheel Spins</th>
              <th className="text-center p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-3 font-semibold">{user.email}</td>
                <td className="p-3 text-center">{user.claimed_days}</td>
                <td className="p-3 text-center">{user.wheel_spins}</td>
                <td className="p-3 text-center">
                  <Button
                    as={Link}
                    href={`/admin/user/${user.id}`}
                    size="sm"
                    color="primary"
                    variant="flat"
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {search ? "No users match your search" : "No users found"}
          </div>
        )}
      </div>
    </>
  );
}
