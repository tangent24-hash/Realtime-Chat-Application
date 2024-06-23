"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Chat from "@/app/components/chat/chat";

interface PageProps {
  params: {
    id: number;
  };
}

const Page: React.FC<PageProps> = ({ params }) => {
  const { id } = params;
  const groupId = id;
  const router = useRouter();
  const [token, setToken] = useState("");

  useEffect(() => {
    // Attempt to get the token from localStorage on component mount
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      // If no token, redirect to home
      router.push("/");
    } else {
      // If token exists, set it in state
      setToken(accessToken);
    }
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>
      <Chat token={token} groupId={groupId} />
    </div>
  );
};

export default Page;
