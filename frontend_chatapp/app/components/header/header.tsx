import React from "react";

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
      <h1 className="text-2xl font-bold">Real Time Group Chat</h1>
      <nav className="flex space-x-4">
        <a
          href="#"
          className="text-white hover:text-gray-200 transition duration-300"
        >
          Home
        </a>
        <a
          href="#"
          className="text-white hover:text-gray-200 transition duration-300"
        >
          Chat Rooms
        </a>
        <a
          href="#"
          className="text-white hover:text-gray-200 transition duration-300"
        >
          Profile
        </a>
        {/* Additional menus for unauthenticated users */}
        <a
          href="#"
          className="text-white hover:text-gray-200 transition duration-300"
        >
          Login
        </a>
        <a
          href="#"
          className="text-white hover:text-gray-200 transition duration-300"
        >
          Registration
        </a>
        {/* Additional menus for logged in users */}
        <a
          href="#"
          className="text-white hover:text-gray-200 transition duration-300"
        >
          Join Group
        </a>
        <a
          href="#"
          className="text-white hover:text-gray-200 transition duration-300"
        >
          Create Group
        </a>
        <a
          href="#"
          className="text-white hover:text-gray-200 transition duration-300"
        >
          Profile
        </a>
        <a
          href="#"
          className="text-white hover:text-gray-200 transition duration-300"
        >
          Logout
        </a>
      </nav>
    </header>
  );
};

export default Header;
