"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import "@blocknote/core/fonts/inter.css";
import { BlockNoteViewRaw, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";

import { useMutation } from "convex/react";
import { AlertOctagon } from "lucide-react";
import { toast } from "sonner";

interface DescriptionProps {
    jobId: Id<"jobs">;
    initialContent?: string;
    editable: boolean;
    className?: string;
}

export const Description = ({
    jobId,
    initialContent,
    editable,
    className
}: DescriptionProps) => {
    const update = useMutation(api.job.updateDescription);

    const editor = useCreateBlockNote({
        initialContent:
            initialContent
                ? JSON.parse(initialContent)
                : undefined,
    });

    const handleChange = () => {
        if (editor.document) {
            const contentLength = JSON.stringify(editor.document).length;
            if (contentLength < 20000) {
                update({
                    id: jobId,
                    description: JSON.stringify(editor.document, null, 2)
                });
            } else {
                toast.error('Content is too long. Not saved.', {
                    duration: 2000,
                    icon: <AlertOctagon />,
                });
            }
        }
    };

    return (
        <BlockNoteViewRaw
            editor={editor}
            editable={editable}
            theme="light"
            onChange={handleChange}
            className={className}
        />
    );
}
