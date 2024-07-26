"use client";

import { useParams } from 'next/navigation';
import UserSettings from '@/components/UserSettings';

export default function ClientSettings() {
  const params = useParams();
  const username = params.username as string;

  return <UserSettings username={username} />;
}
