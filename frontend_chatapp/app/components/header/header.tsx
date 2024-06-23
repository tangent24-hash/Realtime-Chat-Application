import React from "react";

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
      <a href="/" className="text-xl font-bold">
        <h1 className="text-2xl font-bold">Real Time Group Chat</h1>
      </a>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <a href="/">Home</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
