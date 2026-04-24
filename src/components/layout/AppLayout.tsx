import type { ReactNode } from "react";
import TopBar from "./TopBar";

type AppLayoutProps = {
    children: ReactNode;
};

function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="flex min-h-screen w-full flex-col items-center px-4 py-8">
            <TopBar />
            {children}
        </div>
    );
}

export default AppLayout;
