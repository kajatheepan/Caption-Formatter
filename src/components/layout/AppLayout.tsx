import { useState, type ReactNode } from "react";
import TopBar from "./TopBar";
import PolicyModal from "./PolicyModal";
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
    const [policyType, setPolicyType] = useState<"privacy" | "terms" | null>(null);

    return (
        <div className="flex min-h-dvh w-full flex-col bg-[#f7f7f8]">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
            >
                Skip to main content
            </a>
            <TopBar
                document={document}
                saveStatus={saveStatus}
                onClear={onClear}
                onCopyAll={onCopyAll}
                copyAllCopied={copyAllCopied}
                copyAllError={copyAllError}
            />
            <main id="main-content" tabIndex={-1} className="w-full flex-1 px-4 py-7 sm:px-6 lg:px-8">
                {children}
            </main>
            <footer className="mt-auto flex w-full flex-col sm:flex-row items-center justify-between border-t bg-white px-6 py-4 text-xs text-muted-foreground gap-3">
                <span>© {new Date().getFullYear()} CaptionForge. All rights reserved.</span>
                <div className="flex gap-5">
                    <button
                        type="button"
                        onClick={() => setPolicyType("privacy")}
                        className="hover:text-zinc-900 transition"
                    >
                        Privacy Policy
                    </button>
                    <button
                        type="button"
                        onClick={() => setPolicyType("terms")}
                        className="hover:text-zinc-900 transition"
                    >
                        Terms of Service
                    </button>
                </div>
            </footer>
            <PolicyModal type={policyType} onClose={() => setPolicyType(null)} />
        </div>
    );
}

export default AppLayout;
