"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface UserSettingsProps {
  username: string;
}

const UserSettings = ({ username }: UserSettingsProps) => {
  const router = useRouter();
  const user = useQuery(api.users.getUserByUsername, { username });
  const userSkills = useQuery(api.skills.getByUser, { username });
  const updateUser = useMutation(api.users.updateUser);
  const updateSkills = useMutation(api.skills.updateUserSkills);

  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setTitle(user.title || '');
      setAbout(user.about || '');
    }
    if (userSkills) {
      setSkills(userSkills.map(skill => skill.skill));
    }
  }, [user, userSkills]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      try {
        await updateUser({
          userId: user._id,
          fullName,
          title,
          about,
        });
        await updateSkills({
          username,
          skills,
        });
        setNotification('Profile and skills updated successfully!');
      } catch (error) {
        setNotification('Failed to update profile. Please try again.');
      }
    }
  };

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleBackToProfile = () => {
    router.push(`/${username}`);
  };

  if (!user) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="h-screen w-full dark:bg-black bg-white dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] relative flex items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      
      <Card className="max-w-2xl mx-auto relative z-10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Settings for {username}</CardTitle>
        </CardHeader>
        <CardContent>
          {notification && (
            <div className="mb-4 p-2 bg-blue-100 text-blue-700 rounded">
              {notification}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="about">About</Label>
              <Textarea
                id="about"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Skills</Label>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <div key={index} className="bg-gray-200 rounded-full px-3 py-1 text-sm flex items-center">
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 text-red-600"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a new skill"
                />
                <Button type="button" onClick={handleAddSkill}>Add Skill</Button>
              </div>
            </div>
            <div className="flex gap-4">
              <Button type="submit" className="w-full">Save Changes</Button>
              <Button
                type="button"
                className="w-full bg-gray-500 hover:bg-gray-700"
                onClick={handleBackToProfile}
              >
                Back to Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSettings;
