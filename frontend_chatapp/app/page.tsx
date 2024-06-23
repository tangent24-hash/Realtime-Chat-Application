"use client";
import React, { useState } from "react";
import Header from "./components/header/header";
import Login from "./components/auth/login";
import Register from "./components/auth/register";

const Page: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  return (
    <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-screen">
      <Header />
      <div className="flex justify-center items-center">
        {!token ? (
          <div className="flex space-x-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Register</h2>
              <Register />
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Login</h2>
              <Login setToken={setToken} />
            </div>
          </div>
        ) : (
          <div className="text-white text-2xl">Logged in</div>
        )}
      </div>
    </div>
  );
};

export default Page;
