"use client";

import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { FormEvent, useRef, useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Description } from "@/components/description";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Images } from "@/components/images";
import { TitleEditor } from "@/components/title-editor";

import { Label } from "@/components/ui/label";

const Edit = () => {
    const params = useParams();
    const jobID = params.jobID as string;

    console.log("Params received:", params);
    console.log("Job ID:", jobID);

    const router = useRouter();
    const identity = useAuth();

    useEffect(() => {
        if (!identity) {
            console.error("User is not authenticated");
            router.push("/login"); // Redirect to login page
        }
    }, [identity, router]);

    if (!jobID) {
        console.error("Job ID is missing from params:", params);
        return <div>Error: No job ID provided</div>;
    }

    const job = useQuery(api.job.get, { id: jobID as Id<"jobs"> });
    console.log("Job query result:", job);

    const published = useQuery(api.job.isPublished, { id: jobID as Id<"jobs"> });
    const {
        mutate: remove,
        pending: removePending,
    } = useApiMutation(api.job.remove);
    const {
        mutate: publish,
        pending: publishPending,
    } = useApiMutation(api.job.publish);
    const {
        mutate: unpublish,
        pending: unpublishPending,
    } = useApiMutation(api.job.unpublish);

    const generateUploadUrl = useMutation(api.jobMedia.generateUploadUrl);

    const imageInput = useRef<HTMLInputElement>(null);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const sendImage = useMutation(api.jobMedia.sendImage);

    if (job === undefined || published === undefined) {
        return <div>Loading...</div>;
    }

    if (job === null) {
        console.error(`Job not found for ID: ${jobID}`);
        return <div>Job not found. Please check the job ID and try again.</div>;
    }

    async function handleSendImage(event: FormEvent) {
        event.preventDefault();
        if (job === undefined) return;

        const nonNullableJob = job as Doc<"jobs">;

        try {
            const postUrl = await generateUploadUrl();

            await Promise.all(selectedImages.map(async (image) => {
                const result = await fetch(postUrl, {
                    method: "POST",
                    headers: { "Content-Type": image.type },
                    body: image,
                });

                const json = await result.json();

                if (!result.ok) {
                    throw new Error(`Upload failed: ${JSON.stringify(json)}`);
                }
                const { storageId } = json;
                await sendImage({ storageId, format: "image", jobId: nonNullableJob._id });
            }));

            setSelectedImages([]);
            if (imageInput.current) imageInput.current.value = "";
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image. Please try again.");
        }
    }

    const onPublish = async () => {
        try {
            if (published !== true) {
                await publish({ id: jobID as Id<"jobs"> });
            } else {
                await unpublish({ id: jobID as Id<"jobs"> });
            }
        } catch (error) {
            console.error("Error publishing/unpublishing:", error);
            toast.error("Failed to publish/unpublish. Please make sure there are at least 1 image, 3 offers and a description.");
        }
    }

    const onDelete = async () => {
        try {
            await remove({ id: jobID as Id<"jobs"> });
            router.back();
        } catch (error) {
            console.error("Error deleting job:", error);
            toast.error("Failed to delete job. Please try again.");
        }
    };

    return (
        <>
            <div className="space-y-12 2xl:px-64 xl:px-36 md:px-12 px-12">
                <div className="flex justify-end pr-2 space-x-2">
                    <Button disabled={publishPending || unpublishPending} variant={"default"} onClick={onPublish}>
                        {published === true ? "Unpublish" : "Publish"}
                    </Button>
                    <Link href={`/${job.seller.username}/${job._id}`}>
                        <Button disabled={removePending} variant={"secondary"}>
                            Preview
                        </Button>
                    </Link>
                    <Button disabled={removePending} variant={"secondary"} onClick={onDelete}>
                        Delete
                    </Button>
                </div>

                <div className="w-[800px]">
                    <Images
                        images={job.images}
                        title={job.title}
                        allowDelete={true}
                    />
                </div>
                <form onSubmit={handleSendImage} className="space-y-2">
                    <Label className="font-normal">Add up to 5 images:</Label>
                    <div className="flex space-x-2">
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            ref={imageInput}
                            onChange={(event) => setSelectedImages(Array.from(event.target.files || []))}
                            multiple
                            className="cursor-pointer w-fit bg-zinc-100 text-zinc-700 border-zinc-300 hover:bg-zinc-200 hover:border-zinc-400 focus:border-zinc-400 focus:bg-zinc-200"
                            disabled={selectedImages.length !== 0}
                        />
                        <Button
                            type="submit"
                            disabled={selectedImages.length === 0}
                            className="w-fit"
                        >Upload Image</Button>
                    </div>
                </form>
                <div className="flex rounded-md border border-zinc-300 items-center space-x-4 w-fit p-2 cursor-default">
                    <p className="text-muted-foreground">👨‍🎨 Creator: {job.seller.username}</p>
                </div>

                <h2 className="font-semibold">About this job</h2>
            </div>
            <Description
                initialContent={job.description}
                editable={true}
                className="pb-40 mt-12 2xl:px-[200px] xl:px-[90px] xs:px-[17px]"
                jobId={job._id}
            />
        </>
    )
}

export default Edit;