import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Replace with your actual method to get user ID
const fetchUserId = async (): Promise<string | null> => {
  // Replace this with actual logic, e.g., from a context or API
  return "some-user-id"; // Placeholder
};

export const useAuth = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUserId = async () => {
      try {
        const id = await fetchUserId();
        setUserId(id);
      } catch (error) {
        console.error('Error fetching user ID:', error);
        router.push('/login'); // Redirect to login if there's an issue
      }
    };

    getUserId();
  }, [router]);

  return { userId };
};
