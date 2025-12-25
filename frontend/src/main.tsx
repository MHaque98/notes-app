import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

async function enableMocking() {
  // Check if MSW is explicitly enabled via environment variable
  const shouldEnableMSW = import.meta.env.VITE_ENABLE_MSW === "true";

  if (!shouldEnableMSW) {
    return;
  }

  const { worker } = await import("./mocks/browser");
  const result = await worker.start({
    onUnhandledRequest: "bypass",
  });
  console.log("✅ MSW enabled and ready");
  return result;
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>
  );
});
