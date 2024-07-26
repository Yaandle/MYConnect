// src/app/[username]/_components/images.tsx
import React from "react";
import { ImageWithUrlType } from "@/types"; // Adjust the import path as necessary

interface ImagesProps {
    images: ImageWithUrlType[];
    title: string;
    allowDelete: boolean;
}

const Images: React.FC<ImagesProps> = ({ images, title, allowDelete }) => {
    return (
        <div className="images-container">
            {images.length === 0 ? (
                <p>No images available</p>
            ) : (
                images.map((image) => (
                    <div key={image._id} className="image-wrapper">
                        <img src={image.url} alt={title} className="image" />
                        {allowDelete && (
                            <button className="delete-button">
                                Delete
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default Images;
