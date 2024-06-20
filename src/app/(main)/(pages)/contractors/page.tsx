'use client'; // This directive is necessary for client components in Next.js 14

import React from 'react';
import Link from 'next/link';
import { Calendar } from '@/components/ui/calendar';

const ContractorsPage = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <div className="bg-white min-h-screen flex flex-col justify-center">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl text-gray-900 font-bold mb-4">Contractors</h1>
          <p className="text-lg text-gray-600">
            Find exciting projects and expand your professional network.
          </p>
        </div>

        <div className="bg-gray-100 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl text-gray-600 font-bold mb-4">Getting Started</h2>
          <p className="text-gray-600 mb-6">
            Create your profile and showcase your skills and expertise to potential clients.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-300">
            Create Profile
          </button>
          <div className="mt-8">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/">
            <button className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors duration-300">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContractorsPage;
