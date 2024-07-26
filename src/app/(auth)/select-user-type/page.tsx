"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { api } from '@/convex/_generated/api';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/useAuth';

export default function SelectUserType() {
  const router = useRouter();
  const { userId } = useAuth(); // Get userId from the custom hook
  const { mutate: setUserType, pending: isLoading } = useApiMutation(api.users.setUserType);

  const handleSelectUserType = async (userType: 'contractor' | 'business') => {
    if (!userId) {
      console.error('User ID is not available');
      return;
    }

    try {
      console.log('Setting user type:', userType);
      
      // Set the user type
      await setUserType({ userId, userType });

      console.log('User type set successfully');
      
      // Redirect based on user type
      const redirectPath = userType === 'business' 
        ? `/business/${userId}/settings` 
        : `/${userId}/settings`;
      
      console.log('Redirecting to:', redirectPath);
      router.push(redirectPath);
    } catch (error) {
      console.error('Error setting user type:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Select Your Account Type</h1>
      <div className="space-y-4">
        <Button
          onClick={() => handleSelectUserType('contractor')}
          disabled={isLoading}
          className="w-full"
        >
          I am a Contractor
        </Button>
        <Button
          onClick={() => handleSelectUserType('business')}
          disabled={isLoading}
          className="w-full"
        >
          Business
        </Button>
      </div>
    </div>
  );
}
