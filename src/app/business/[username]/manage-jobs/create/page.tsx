"use client";

import React from 'react';
import { CreateForm } from "../_components/create-form";

interface CreateJobProps {
    params: {
        username: string;
    }
}

const CreateJob = ({
    params
}: CreateJobProps) => {
    return (
        <div className="flex flex-col items-center">
            <div className="w-full max-w-4xl">
                <CreateForm
                    username={params.username}
                />
            </div>
        </div>
    );
}

export default CreateJob;