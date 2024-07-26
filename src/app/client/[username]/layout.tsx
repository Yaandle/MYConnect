import Navbar from "../../dashboard/[username]/_components/navbar";

interface UserJobLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout = ({ children }: UserJobLayoutProps) => {
    return (
        <div>
            <Navbar />
            <main className="p-0 sm:p-6 md:p-16 lg:px-64">
                {children}
            </main>
        </div>
    );
}

export default DashboardLayout;