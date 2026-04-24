import type { ReactNode } from "react";
import TopBar from "./TopBar";

type AppLayoutProps = {
    children: ReactNode;
    saveStatus?: string;
    onClear?: () => void;
    onCopyAll?: () => void;
};

function AppLayout({
    children,
    saveStatus = "Saved locally",
    onClear = () => undefined,
    onCopyAll = () => undefined,
}: AppLayoutProps) {
    return (
        <div className="flex min-h-screen w-full flex-col items-center bg-muted/30">
            <TopBar saveStatus={saveStatus} onClear={onClear} onCopyAll={onCopyAll} />
            <main className="flex w-full flex-1 flex-col items-center px-4 py-8">
                {children}
            </main>
        </div>
    );
}

export default AppLayout;
