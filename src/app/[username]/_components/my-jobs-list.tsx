"use client";
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Images } from "@/components/images";
import Link from "next/link";

interface MyJobsListProps {
    sellerUsername: string;
}

export const MyJobsList = ({
    sellerUsername
}: MyJobsListProps) => {
    const jobs = useQuery(api.jobs.getJobsWithImages, { sellerUsername: sellerUsername });
    if (jobs === undefined) {
        return <div>Loading...</div>;
    }

    return (
        <Carousel opts={{
            align: "start",
            loop: true,
            dragFree: false,

        }} className="w-full">
            <CarouselContent>
                {jobs.map((job) => (
                    <CarouselItem className="basis-1/3" key={job._id}>
                        <Link href={`/${sellerUsername}/${job._id}`}>
                            <Images
                                images={job.images}
                                title={job.title}
                                allowDelete={false}
                            />
                        </Link>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
};
