import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import SharedCaptionPage from "@/pages/SharedCaptionPage";

export function AppRouter() {
    const path = window.location.pathname;

    if (path === "/") {
        return <HomePage />;
    }

    if (path.startsWith("/c/")) {
        return <SharedCaptionPage />;
    }

    return <NotFoundPage />;
}
