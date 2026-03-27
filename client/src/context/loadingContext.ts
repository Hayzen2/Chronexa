import { createContext} from "react";

// Define the shape of the loading context
interface LoadingContextType {
    isLoading: boolean;
    setLoading: (loading: boolean) => void;
}

// Create an instance of the loading context with default values
export const LoadingContext = createContext<LoadingContextType>({
    isLoading: false,
    setLoading: () => {}, // Placeholder for the setLoading function
});

