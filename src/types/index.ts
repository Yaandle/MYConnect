import { Doc, Id } from "@/convex/_generated/dataModel";

export type ImageWithUrlType = Doc<"jobMedia"> & {
    url: string;
};

export type FullJobType = Doc<"jobs"> & {
    storageId?: Id<"_storage"> | undefined;
    favorited: boolean;
    offer: Doc<"offers">;
    reviews: Doc<"reviews">[];
    seller: Doc<"users">;
};

export type MessageWithUserType = Doc<"messages"> & {
    user: Doc<"users">;
};

export type JobWithImageType = Doc<"jobs"> & {
    images: ImageWithUrlType[];
};

export type UserWithCountryType = Doc<"users"> & {
    country: Doc<"countries">;
};

export type ReviewFullType = Doc<"reviews"> & {
    author: UserWithCountryType;
    image: ImageWithUrlType;
    offers: Doc<"offers">[];
    job: Doc<"jobs">;
};

export type CategoriesFullType = Doc<"categories"> & {};
