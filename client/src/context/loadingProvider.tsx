
import { useState, useMemo, type ReactNode } from "react";
import LoadingOverlay from "../components/LoadingOverlay";
import { LoadingContext } from "./loadingContext";

// Component that provides the loading state to all child components
// { children } = tsx element that will be wrapped by the provider
export const LoadingProvider = ({ children }: { children: ReactNode }) => {
    // useState creates a state variable that can change
    // When it changes, the component will re-render to reflect the new state
    // Initial value of isloading = false
    const [isLoading, setLoading] = useState(false);
    // useMemo is used to prevent re-renders by memorizing values
    const value = useMemo(() => (
        { isLoading, setLoading } // The object being memorized
    ), [isLoading]); // Dependency array: value will only be recomputed when isLoading changes

    // Returns the TSX that wraps the components and shares the loading state
    return (
        // LoadingContext.Provider: "Share this data with all children"
        // value: the data being shared (isLoading and setLoading)
        <LoadingContext.Provider value = {value}>
            {children} {/* Render the children that are wrapped by the provider */}
            {isLoading && <LoadingOverlay />} {/*If isLoading = true => render */}
        </LoadingContext.Provider>
    );
};