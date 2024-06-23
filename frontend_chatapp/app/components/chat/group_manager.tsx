import React, { useState, useEffect } from "react";

interface Group {
  id: number;
  name: string;
}

const GroupManager: React.FC<{ token: string }> = ({ token }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupName, setGroupName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [currentGroupId, setCurrentGroupId] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/chat/groups/", {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setGroups(data));
  }, [token]);

  const createGroup = () => {
    fetch("http://localhost:8000/api/chat/groups/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({ name: groupName }),
    })
      .then((response) => response.json())
      .then((data) => {
        setGroups([...groups, data]);
        setGroupName("");
      });
  };

  const joinGroup = (groupId: number) => {
    fetch(`http://localhost:8000/api/chat/groups/${groupId}/join/`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setCurrentGroupId(groupId);
      });
  };

  const inviteUser = (groupId: number) => {
    fetch(`http://localhost:8000/api/chat/groups/${groupId}/invite/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({ Email: inviteEmail }),
    })
      .then((response) => response.json())
      .then((data) => {
        setInviteEmail("");
      });
  };

  const enterGroup = (groupId: number) => {
    // Redirect to /group/[id] route
    window.location.href = `/group/${groupId}`;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Group Manager</h1>
      <div className="mb-4">
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group name"
          className="border border-gray-300 text-black rounded-md px-4 py-2 mr-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
        />
        <button
          onClick={createGroup}
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Create Group
        </button>
      </div>
      <h2 className="text-xl font-bold mb-2">Groups</h2>
      <ul className="space-y-2">
        {groups?.map((group) => (
          <li
            key={group.id}
            className="flex items-center justify-between bg-gray-100 p-4 rounded-md shadow-md transition duration-300 ease-in-out hover:bg-gray-200"
          >
            <span className="font-medium text-black">{group.name}</span>
            <div>
              <button
                onClick={() => joinGroup(group.id)}
                className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 mr-2"
              >
                Join Group
              </button>
              <button
                onClick={() => enterGroup(group.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Enter Group
              </button>
            </div>
          </li>
        ))}
      </ul>
      {currentGroupId && (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">Invite User</h3>
          <div className="mb-4">
            <input
              type="text"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Email"
              className="border border-gray-300 rounded-md px-4 py-2 mr-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            />
            <button
              onClick={() => inviteUser(currentGroupId)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Invite
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupManager;
