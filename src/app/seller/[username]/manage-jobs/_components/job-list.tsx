"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { JobCard } from "./job-card";

export const JobList = () => {
    const { data: jobs, isLoading, isError } = useQuery<any>(api.job.get, {}); // Adjust any type for temporary fix

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError || !jobs) {
        return <div>Error loading jobs.</div>;
    }

    return (
        <>
            {jobs.map((job: any) => ( // Adjust job type as per your API response structure
                <JobCard
                    key={job._id}
                    job={job}
                />
            ))}
        </>
    );
};
