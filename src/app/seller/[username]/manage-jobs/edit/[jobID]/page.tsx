"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { FormEvent, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Description } from "@/components/description";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Images } from "@/components/images";
import { TitleEditor } from "@/components/title-editor";

import { Label } from "@/components/ui/label";

interface EditdPageProps {
    params: {
        jobId: string;
    };
}

const Edit = ({ params }: EditdPageProps) => {
    console.log("Params received:", params);

    if (!params.jobId) {
        console.error("Job ID is missing from params:", params);
        return <div>Error: No job ID provided</div>;
    }

    const job = useQuery(api.job.get, { id: params.jobId as Id<"jobs"> });
    const published = useQuery(api.job.isPublished, { id: params.jobId as Id<"jobs"> });
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
    const router = useRouter();

    const identity = useAuth();

    const generateUploadUrl = useMutation(api.jobMedia.generateUploadUrl);

    const imageInput = useRef<HTMLInputElement>(null);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const sendImage = useMutation(api.jobMedia.sendImage);

    if (!identity) {
        throw new Error("Unauthorized");
    }

    if (job === undefined || published === undefined) {
        return <div>Loading...</div>;
    }

    if (job === null) {
        return <div>Job not found</div>;
    }

    async function handleSendImage(event: FormEvent) {
        event.preventDefault();
        if (job === undefined) return;

        const nonNullableJob = job as Doc<"jobs">;

        // Step 1: Get a short-lived upload URL
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
            // Step 3: Save the newly allocated storage id to the database
            await sendImage({ storageId, format: "image", jobId: nonNullableJob._id })
                .catch((error) => {
                    console.log(error);
                    toast.error("Maximum 5 files reached.");
                });
        }));

        setSelectedImages([]);
        imageInput.current!.value = "";
    }

    const onPublish = async () => {
        if (published !== true) {
            publish({ id: params.jobId as Id<"jobs"> })
                .catch((error) => {
                    console.log(error);
                    toast.error("Failed to publish. Please make sure there are at least 1 image, 3 offers and a description.");
                });
        } else {
            unpublish({ id: params.jobId as Id<"jobs"> })
        }
    }

    const onDelete = async () => {
        remove({ id: params.jobId as Id<"jobs"> });
        router.back();
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
                    <p className="text-muted-foreground">👨‍🎨 Creator: {"Vuk Rosic"}</p>
                </div>

                <h2 className="font-semibold">About this job</h2>
            </div>
        </>
    )
}

export default Edit;