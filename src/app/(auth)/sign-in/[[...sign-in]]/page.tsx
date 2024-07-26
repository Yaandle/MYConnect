import { SignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation'; // Updated import
import { useEffect } from 'react';

export default function SignUpPage() {
  const router = useRouter();

  useEffect(() => {
    // Function to handle redirection after sign up
    const handleSignUpComplete = () => {
      router.push('/select-user-type');
    };

    // Adding event listener for Clerk's sign up event
    document.addEventListener('clerk:signed-up', handleSignUpComplete);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('clerk:signed-up', handleSignUpComplete);
    };
  }, [router]);

  return <SignUp />;
}
