import Image from "next/image"

export const EmptyFavorites = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Image
                src="/empty-favorites.svg"
                alt="Empty"
                width={340}
                height={340}
            />
            <h2 className="text-2xl font-semibold mt-6">
                There are no favourite Jobs!
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
                Try favoriting a Job!
            </p>
        </div>
    );
};