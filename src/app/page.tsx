import Image from "next/image";
import Link from 'next/link';
import Navbar from '@/components/global/navbar';
import { FlipWords } from "../components/ui/flip-words";
import { BackgroundBeams } from "../components/ui/background-beams";

const Page = () => {
    const words = ["Employers", "Contractors", "Work", "Tools", "Technology"];
    const colors = ['text-blue-500', 'text-green-500', 'text-purple-500', 'text-yellow-500','text-red-500'];
    
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Navbar />
            <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
                <section className="mt-[-10px] w-full">

                    {/* FlipWordsDemo Component */}
                    <div className="h-[40rem] flex justify-center items-center px-4">
                        <div className="text-4xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
                            Find{" "}
                            <FlipWords words={words} colors={colors} duration={2000} />{" "}
                            <br />
                            with MY Connect
                        </div>
                    </div>

                    {/* Container for the cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-100 p-8 rounded-lg shadow-md relative">
                            <h2 className="text-2xl text-gray-900 font-bold mb-4">For Contractors</h2>
                            <p className="text-gray-900 mb-6">
                                Showcase your skills and expertise to potential employers. Find rewarding projects and expand your professional network.
                            </p>
                            <ul>
                                <li>
                                    <Link href="/sign-up" legacyBehavior>
                                        <a className="relative inline-flex h-10 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-white">
                                            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                                            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                                                Sign Up
                                            </span>
                                        </a>
                                    </Link>
                                </li>
                            </ul>
                            <BackgroundBeams />
                        </div>

                        <div className="bg-gray-100 p-8 rounded-lg shadow-md relative">
                            <h2 className="text-2xl text-gray-900 font-bold mb-4">For Businesses</h2>
                            <p className="text-gray-900 mb-6">
                                Access a pool of talented contractors to help you tackle your projects. Find the right talent for your business needs.
                            </p>
                            <ul>
                                <li>
                                    <Link href="/sign-in" legacyBehavior>
                                        <a className="relative inline-flex h-10 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-white">
                                            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                                            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                                                Sign In
                                            </span>
                                        </a>
                                    </Link>
                                </li>
                            </ul>
                            <BackgroundBeams />
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Page;