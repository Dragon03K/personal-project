import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";

export function TableDemo({
  users,
  handleApprove,
}: {
  users: any;
  handleApprove: (id: string, approved: boolean) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="text-right">Role</TableHead>
          <TableHead className="text-right">Approved</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user: any) => (
          <TableRow key={user._id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell className="text-right">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  user.admin
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {user.admin ? "Admin" : "User"}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant={user.approved ? "default" : "outline"}
                disabled={user.approved}
                onClick={() => handleApprove(user._id, true)}
              >
                {user.approved ? "Approved" : "Pending"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
