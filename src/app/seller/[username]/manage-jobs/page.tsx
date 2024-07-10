"use client";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { JobList } from "./_components/job-list";
import { Separator } from "@/components/ui/separator";
import { JobData, columns } from "./_components/columns";
import { Loading } from "@/components/auth/loading";
import { DataTable } from "./_components/data-table";

const ManageJobs = () => {
    const currentUser = useQuery(api.users.getCurrentUser);
    const jobs = useQuery(api.jobs.getJobsWithOrderAmountAndRevenue);

    if (jobs === undefined || currentUser === undefined) {
        return <Loading />
    }

    if (jobs === null || currentUser === null) {
        return <div>Not found</div>
    }

    const data: JobData[] = jobs.map(job => ({
        id: job._id,
        title: job.title,
        image: job.ImageUrl || "https://images.unsplash.com/photo-1559311648-d46f5d8593d6?q=80&w=2050&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        clicks: job.clicks,
        orders: job.orderAmount,
        revenue: job.totalRevenue,
        username: currentUser.username
    }));

    return (
        <>
            <div className="flex items-center">
                <div className="space-y-2">
                    <h1 className="text-4xl font-semibold">Jobs</h1>
                    <p className="text-muted-foreground">
                        Manage, create and edit your jobs and offers.
                    </p>
                </div>
                <Button className="ml-auto" variant={"blue"}>
                    <Link href={`/seller/${currentUser?.username}/manage-jobs/create`}>Create</Link>
                </Button>
            </div>
            <Separator className="my-6" />
            <DataTable columns={columns} data={data} />
        </>
    )
}

export default ManageJobs;