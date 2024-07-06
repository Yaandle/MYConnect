"use client";
import React from 'react';
import CalendarSystem from '@/components/CalendarSystem';

interface Dashboard {
    params: {
        username: string;
    }
}

const Dashboard = ({
    params
}: Dashboard) => {
    return (
        <div className="flex flex-col items-center">
            <div className="w-full max-w-4xl">
                <CalendarSystem />
            </div>
        </div>
    );
}

export default Dashboard;