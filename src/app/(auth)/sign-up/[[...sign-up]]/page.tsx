"use client";

import { SignUp, useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  useEffect(() => {
    // Redirect to /select-user-type if user is signed in
    if (isSignedIn) {
      router.push('/select-user-type');
    }
  }, [isSignedIn, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <SignUp
        afterSignInUrl="/select-user-type"
        redirectUrl="/select-user-type"
      />
    </div>
  );
}
