"use client";

import { useQuery } from "convex/react";
import { Header } from "./_components/header";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Offers } from "./_components/offers";
import { Seller } from "./_components/seller";
import { Images } from "../../../components/images";
import { Description } from "@/components/description";
import { Info } from "lucide-react";
import { SellerDetails } from "./_components/seller-details";
import { Reviews } from "../_components/reviews/reviews";
import { AddReview } from "../_components/reviews/add-review";

interface PageProps {
    params: {
        username: string;
        jobId: string;
    }
}

const JobPage = ({
    params
}: PageProps) => {
    const job = useQuery(api.jobs.get, { id: params.jobId as Id<"jobs"> });
    const categoryAndSubcategory = useQuery(api.jobs.getCategoryAndSubcategory, { jobId: params.jobId as Id<"jobs"> });
    const offers = useQuery(api.offers.get, { jobId: params.jobId as Id<"offers"> });
    const reviews = useQuery(api.reviews.getByJob, { jobId: params.jobId as Id<"reviews"> });
    const reviewsFull = useQuery(api.reviews.getFullByJob, { jobId: params.jobId as Id<"reviews"> });

    if (job === undefined || reviews === undefined || reviewsFull === undefined || categoryAndSubcategory === undefined || offers === undefined) {
        return <div>Loading...</div>;
    }

    if (job === null || categoryAndSubcategory === null || offers === null) {
        return <div>Not found</div>;
    }

    if (job.published === false) {
        return <div>This job is not published</div>;
    }

    const editUrl = `/seller/${job.seller.username}/manage-jobs/edit/${job._id}`;

    return (
        <div>
            <div className="flex flex-col sm:flex-row w-full sm:justify-center space-x-0 sm:space-x-3 lg:space-x-16">
                <div className="w-full space-y-8">
                    <Header
                        {...categoryAndSubcategory}
                        editUrl={editUrl}
                        ownerId={job.seller._id}
                    />
                    <h1 className="text-3xl font-bold break-words text-[#3F3F3F]">{job.title}</h1>
                    <Seller
                        seller={job.seller}
                        reviews={reviews}
                    />
                    <Images
                        images={job.images}
                        title={job.title}
                        allowDelete={false}
                    />
                    <Description
                        editable={false}
                        initialContent={job.description}
                        jobId={job._id}
                    />
                    <div className="border border-zinc-400 p-4 space-y-2 rounded-2xl">
                        <div className="flex space-x-2">
                            <Info />
                            <h4>Delivery preferences</h4>
                        </div>
                        <p>Please communicate any preferences or concerns regarding the utilization of AI tools in the fulfillment and/or delivery of your request.</p>
                    </div>
                    <SellerDetails
                        seller={job.seller}
                        reviews={reviews}
                        lastFulFilmentTime={job.lastFulfilment?.fulfilmentTime}
                        languages={job.seller.languages}
                    />
                    <AddReview
                        jobId={job._id}
                        sellerId={job.seller._id}
                    />
                </div>
                <Offers
                    offers={offers}
                    sellerId={job.seller._id}
                    editUrl={editUrl}
                />
            </div>
        </div>
    );
}

export default JobPage;
