import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
    children: ReactNode;
};

type State = {
    hasError: boolean;
    error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="grid min-h-dvh place-items-center bg-[#f7f7f8] px-4 py-12">
                    <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-xl text-center">
                        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4">
                            <AlertTriangle className="size-6" />
                        </div>
                        <h2 className="text-lg font-bold text-zinc-900">Something went wrong</h2>
                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                            An unexpected error occurred in the editor. Don't worry, your local draft is safely stored in your browser.
                        </p>
                        <div className="mt-6">
                            <Button onClick={this.handleReset} className="w-full h-10 rounded-xl bg-primary text-xs font-semibold">
                                <RefreshCw className="size-4 mr-2" />
                                Reload Application
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
