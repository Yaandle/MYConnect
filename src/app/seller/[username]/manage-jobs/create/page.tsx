"use client";
import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CreateForm } from "./_components/create-form";

interface CreateJobProps {
    params: {
        username: string;
    }
}

const CreateJob = ({
    params
}: CreateJobProps) => {
    const insertCategories = useMutation(api.seedCategories.create);
    useEffect(() => {
        insertCategories({})
            .then(() => console.log("Categories seeded successfully"))
            .catch((error) => console.error("Failed to seed categories", error));
    }, [insertCategories]);
    return (
        <div className="flex justify-center">
            <CreateForm
                username={params.username}
            />
        </div>
    );
}
export default CreateJob;
