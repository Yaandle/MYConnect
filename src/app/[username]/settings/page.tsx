// app/[username]/settings/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function UserSettings() {
  const params = useParams();
  const username = params.username as string;

  const user = useQuery(api.users.getUserByUsername, { username });
  const updateUser = useMutation(api.users.updateUser);

  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setTitle(user.title || '');
      setAbout(user.about || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      await updateUser({
        userId: user._id,
        fullName,
        title,
        about,
      });
      alert('Profile updated successfully!');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Settings for {username}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="about">About:</label>
          <textarea
            id="about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}