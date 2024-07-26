"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { EmptySearch } from "./empty-search";
import { EmptyFavorites } from "./empty-favorites";
import { JobCard } from "./job-card";
import { Loading } from "@/components/auth/loading";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { FullJobType } from "@/types";
import { useEffect, useState } from "react";

interface JobListProps { 
    query: {
        search?: string;
        favorites?: string;
        filter?: string;
    };
};

export const JobList = ({ 
    query,
}: JobListProps) => {
    const jobs: FullJobType[] | undefined = useQuery(api.jobs.get, { search: query.search, favorites: query.favorites, filter: query.filter }); // Changed from api.gigs.get to api.jobs.get
    const [jobsWithFavorite, setJobsWithFavorite] = useState<FullJobType[] | undefined>(undefined);

    useEffect(() => {
        if (query.favorites) {
            const favoriteJobs = jobs?.filter((job) => job.favorited);
            setJobsWithFavorite(favoriteJobs);
        } else {
            setJobsWithFavorite(jobs);
        }
    }, [query.favorites, jobs]);

    if (jobs === undefined) {
        return (
            <>Loading jobs...</> 
        );
    }

    if (!jobs?.length && query.search) {
        return (
            <EmptySearch />
        );
    }

    if (!jobsWithFavorite?.length && query.favorites) {
        return (
            <EmptyFavorites />
        );
    }

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-8 pb-10 mx-10">
                {jobsWithFavorite?.map((job) => ( 
                    <JobCard
                        key={job._id}
                        id={job._id}
                        sellerId={job.seller._id}
                        title={job.title}
                        description={job.description}
                        createdAt={job._creationTime}
                        isFavorite={job.favorited}
                        storageId={job.storageId}
                        offer={job.offer}
                        reviews={job.reviews}
                    />
                ))}
            </div>
        </div>
    );
};
