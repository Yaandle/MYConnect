"use client";

import { CreateForm } from "./components/create-form";

interface CreateJobProps {
    params: {
        username: string;
    }
}

const CreateJob = ({
    params
}: CreateJobProps) => {
    return (
        <div className="flex justify-center">
            <CreateForm
                username={params.username}
            />
        </div>
    );
}
export default CreateJob;