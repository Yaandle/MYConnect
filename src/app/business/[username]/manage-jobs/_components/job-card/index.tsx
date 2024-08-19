import { Doc } from "@/convex/_generated/dataModel";

interface JobCardProps {
    job: Doc<"jobs">;
}

export const JobCard = ({
    job
}: JobCardProps) => {
    return (
        <div>
            {job.title}
        </div>
    )
}