"use client";

import React, { useEffect } from 'react';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import CalendarSystem from '@/components/CalendarSystem';
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface DashboardProps {
    params: {
        username: string;
    };
    searchParams: {
        search?: string;
        favorites?: string;
        filter?: string;
    };
}

const Dashboard = ({
    params,
    searchParams
}: DashboardProps) => {
    const store = useMutation(api.users.store);
    const { isLoaded, isSignedIn, user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.replace('/sign-in');
        } else if (isLoaded && isSignedIn && user?.username !== params.username) {
            router.replace(`/seller/${user?.username}/dashboard`);
        }
    }, [isLoaded, isSignedIn, user, router, params.username]);

    useEffect(() => {
        const storeUser = async () => {
            await store({});
        }
        if (isSignedIn) {
            storeUser();
        }
    }, [store, isSignedIn]);

    if (!isLoaded || !isSignedIn) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center">
            <div className="w-full max-w-4xl">
                <CalendarSystem />
                {/* Add dailyhours component here */}
            </div>
            {/* You can add JobList component here if needed */}
            {/* <JobList query={searchParams} /> */}
        </div>
    );
};

export default Dashboard;