import type { ReactNode } from "react";
import TopBar from "./TopBar";
import type { CaptionDocument } from "@/types/caption";

type AppLayoutProps = {
    children: ReactNode;
    document?: CaptionDocument;
    saveStatus?: string;
    onClear?: () => void;
    onCopyAll?: () => void;
    copyAllCopied?: boolean;
    copyAllError?: boolean;
};

function AppLayout({
    children,
    document,
    saveStatus = "Saved locally",
    onClear = () => undefined,
    onCopyAll = () => undefined,
    copyAllCopied = false,
    copyAllError = false,
}: AppLayoutProps) {
    return (
        <div className="flex min-h-dvh w-full flex-col bg-[#f7f7f8]">
            <TopBar
                document={document}
                saveStatus={saveStatus}
                onClear={onClear}
                onCopyAll={onCopyAll}
                copyAllCopied={copyAllCopied}
                copyAllError={copyAllError}
            />
            <main className="w-full flex-1 px-4 py-7 sm:px-6 lg:px-8">
                {children}
            </main>
            <footer className="mt-auto flex w-full items-center justify-between border-t bg-white px-8 py-4 text-xs text-muted-foreground">
                <span>© 2024 CaptionForge</span>
                <div className="flex gap-5">
                    <span>Privacy</span>
                    <span>Terms</span>
                    <span>API</span>
                </div>
            </footer>
        </div>
    );
}

export default AppLayout;
