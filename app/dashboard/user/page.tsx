"use client";

import { TableDemo } from "@/components/table";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const UserPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/user/getAllUser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        setUsers(data.users);
      }
    };

    fetchUsers();
  }, []);

  const handleApprove = async (userId: string, approved: boolean) => {
    try {
      const res = await fetch("/api/user/approveUser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, approved }),
      });

      const data = await res.json();

      if (res.ok) {
        setUsers((prevUsers: any) =>
          prevUsers.map((u: any) =>
            u._id === userId ? { ...u, approved } : u,
          ),
        );
        toast.success("User approved successfully");
      } else {
        toast.error(data.message || "Failed to approve user");
      }
    } catch (error) {
      toast.error("An error occurred while approving user");
    }
  };

  return (
    <div className="p-6">
      <TableDemo users={users} handleApprove={handleApprove} />
    </div>
  );
};

export default UserPage;
