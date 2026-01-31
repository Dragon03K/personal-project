"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

export function InfluencerTable() {
  const [influencers, setInfluencers] = useState<any>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchInfluencers = async () => {
      const res = await fetch("/api/influencer/getAllInfluencer", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setInfluencers(data);
    };
    fetchInfluencers();
  }, []);

  const deleteInfluencer = async (id: string) => {
    // Optimistic Update: Immediately remove from UI
    const previousInfluencers = [...influencers];
    setInfluencers(influencers.filter((inf: any) => inf._id !== id));

    try {
      const res = await fetch(`/api/influencer/deleteInfluencer?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      console.error("Delete error:", error);
      // Rollback if failed
      setInfluencers(previousInfluencers);
      alert("Failed to delete influencer. Please try again.");
    }
  };

  return (
    <Table>
      <TableCaption>A list of Influencers</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Instagram ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead>Niche</TableHead>
          <TableHead>URL</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {influencers.map((influencer: any) => (
          <TableRow key={influencer._id}>
            <TableCell className="font-medium">
              {influencer.instagramId}
            </TableCell>
            <TableCell>{influencer.name}</TableCell>
            <TableCell>{influencer.gender}</TableCell>
            <TableCell>{influencer.category}</TableCell>
            <TableCell>
              <a
                href={influencer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Link
              </a>
            </TableCell>
            <TableCell className="text-right">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the influencer{" "}
                      <span className="font-semibold text-foreground">
                        {influencer.name}
                      </span>{" "}
                      from the database.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteInfluencer(influencer._id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
