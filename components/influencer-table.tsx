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

export function InfluencerTable() {
  const [influencers, setInfluencers] = useState<any>([]);
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {influencers.map((influencer: any) => (
          <TableRow key={influencer._id}>
            <TableHead>{influencer.instagramId}</TableHead>
            <TableCell>{influencer.name}</TableCell>
            <TableHead>{influencer.gender}</TableHead>
            <TableHead>{influencer.category}</TableHead>
            <TableCell>{influencer.url}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
