"use client";

import { DashboardCard } from "@/components/dashboard-card";
import { HomeIcon } from "@/components/ui/home";
import { InstagramIcon } from "@/components/ui/instagram";
import { UsersIcon } from "@/components/ui/users";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Dashboard = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [influencersCount, setInfluencersCount] = useState(0);
  const [businessCount, setBusinessCount] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/getAllUser");
        const data = await res.json();
        setUsersCount(data.users?.length || 0);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    const fetchInfluencers = async () => {
      try {
        const res = await fetch("/api/influencer/getAllInfluencer");
        const data = await res.json();
        setInfluencersCount(data.length || 0);
      } catch (error) {
        return toast.error("Failed to fetch influencers");
      }
    };

    const fetchBusiness = async () => {
      try {
        const res = await fetch("/api/business/getAllBusiness");
        const data = await res.json();
        setBusinessCount(data.business?.length || 0);
      } catch (error) {
        return toast.error("Failed to fetch business");
      }
    };
    fetchUsers();
    fetchInfluencers();
    fetchBusiness();
  }, []);

  const cardsData = [
    {
      title: "Total Users",
      value: usersCount,
      icon: <UsersIcon />,
    },
    {
      title: "Influencers",
      value: influencersCount,
      icon: <InstagramIcon />,
    },
    {
      title: "Business",
      value: businessCount,
      icon: <HomeIcon />,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cardsData.map((card, index) => (
          <DashboardCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
          />
        ))}
      </div>
    </>
  );
};

export default Dashboard;
