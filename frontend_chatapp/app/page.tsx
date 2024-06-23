"use client";
import React, { useEffect, useState } from "react";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import GroupManager from "./components/chat/group_manager";

const Page: React.FC = () => {
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:8000/api/token/verify/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        cache: "no-cache",
        method: "POST",
      });
      if (response.status !== 200) {
        console.log("Token expired. Refreshing token...");

        const refreshToken = localStorage.getItem("refresh_token");
        const refreshResponse = await fetch(
          "http://localhost:8000/api/token/refresh/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh: refreshToken }),
            credentials: "include",
            cache: "no-cache",
          }
        );
        if (refreshResponse.ok) {
          console.log("Token refreshed successfully.");

          const data = await refreshResponse.json();
          const { access } = data;
          localStorage.setItem("access_token", access);
          setToken(access);
        } else {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          setToken("");
        }
      } else {
        setToken(token || "");
        console.log("Token is valid.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gradient-to-r from-purple-500 to-blue-500  flex items-center justify-center">
      {!token ? (
        <div className="flex space-x-8">
          <div className="bg-white rounded-lg shadow-lg p-6 transform transition-transform duration-500 hover:scale-105">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            <Register />
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 transform transition-transform duration-500 hover:scale-105">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <Login />
          </div>
        </div>
      ) : (
        <GroupManager token={token} />
      )}
    </div>
  );
};

export default Page;
