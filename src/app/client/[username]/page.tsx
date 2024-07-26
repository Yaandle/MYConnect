"use client";

import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { ProfileCard } from "./_components/profile-card";
import { api } from "@/convex/_generated/api";
import { MyJobsList } from "./_components/my-jobs-list";
import { ReviewsStats } from "./_components/reviews/reviews-stats";
import { Reviews } from "./_components/reviews/reviews";
import { Button } from "@/components/ui/button"; // Adjust this import based on your UI library
import { useConvexAuth } from "convex/react";

interface SellerPageProps {
    params: {
        username: string
        jobId: string
    }
}

const SellerPage = ({
    params
}: SellerPageProps) => {
    const router = useRouter();
    const { isAuthenticated } = useConvexAuth();
    const currentUser = useQuery(api.users.getCurrentUser);
    const seller = useQuery(api.users.getUserByUsername, { username: params.username });
    const skills = useQuery(api.skills.getByUser, { username: params.username });
    const jobs = useQuery(api.jobs.getBySellerName, { sellerName: params.username });
    const reviews = useQuery(api.reviews.getBySellerName, { sellerName: params.username });

    const handleNavigateToSettings = () => {
        router.push(`/${params.username}/settings`);
    };

    const handleNavigateToUsernameSettings = () => {
        router.push(`/${params.username}/settings/username`);
    };

    if (seller === undefined || reviews === undefined || skills === undefined || jobs === undefined || currentUser === undefined) {
        return <div>Loading...</div>
    }

    if (seller === null || jobs === null) {
        return <div>Not found</div>
    }

    const isOwnProfile = isAuthenticated && currentUser && currentUser.username === params.username;

    const skillsString = skills ? skills.map((skill) => skill.skill).join(", ") : "";

    return (
        <div className="space-y-12">
            <div className="flex flex-col sm:flex-row w-full sm:justify-center p-0 sm:p-6 md:p-16 space-x-0 sm:space-x-3 lg:space-x-16">
                <div className="w-full space-y-8 max-w-[700px]">
                    <ProfileCard
                        seller={seller}
                        reviews={reviews}
                    />
                    {isOwnProfile && (
                        <div className="flex space-x-4">
                            <Button onClick={handleNavigateToSettings}>
                                Edit Profile
                            </Button>
                            <Button onClick={handleNavigateToUsernameSettings}>
                                Change Username
                            </Button>
                        </div>
                    )}
                    <div>
                        <p className="font-bold">About me</p>
                        <p>{seller.about}</p>
                    </div>
                    <div>
                        <p className="font-bold">Skills</p>
                        <p>{skillsString}</p>
                    </div>
                </div>
            </div>
            <MyJobsList
                sellerUsername={params.username}
            />
            <ReviewsStats
                reviews={reviews}
            />
            <Reviews
                reviews={reviews}
            />
        </div>
    )
}

export default SellerPage;