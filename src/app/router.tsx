import { lazy, Suspense } from "react";

const HomePage = lazy(() => import("@/pages/HomePage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const SharedCaptionPage = lazy(() => import("@/pages/SharedCaptionPage"));

export function AppRouter() {
    const path = window.location.pathname;

    let Page = NotFoundPage;
    if (path === "/") {
        Page = HomePage;
    } else if (path.startsWith("/c/")) {
        Page = SharedCaptionPage;
    }

    return (
        <Suspense fallback={null}>
            <Page />
        </Suspense>
    );
}
