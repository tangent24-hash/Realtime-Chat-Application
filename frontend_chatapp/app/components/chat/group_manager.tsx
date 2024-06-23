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
    <div>
      <h1 className="text-2xl font-bold">Group Manager</h1>
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Group name"
        className="border border-gray-300 rounded-md px-2 py-1 mt-2"
      />
      <button
        onClick={createGroup}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
      >
        Create Group
      </button>
      <h2 className="text-xl font-bold mt-4">Groups</h2>
      <ul>
        {groups?.map((group) => (
          <li key={group.id} className="flex items-center justify-between mt-2">
            <span>{group.name}</span>
            <button
              onClick={() => joinGroup(group.id)}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Join Group
            </button>
            <button
              onClick={() => enterGroup(group.id)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Enter Group
            </button>
          </li>
        ))}
      </ul>
      {currentGroupId && (
        <div>
          <h3 className="text-lg font-bold mt-4">Invite User</h3>
          <input
            type="text"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Email"
            className="border border-gray-300 rounded-md px-2 py-1 mt-2"
          />
          <button
            onClick={() => inviteUser(currentGroupId)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
          >
            Invite
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupManager;
