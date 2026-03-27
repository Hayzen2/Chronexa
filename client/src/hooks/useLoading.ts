import { useContext } from "react";
import { LoadingContext } from "../context/loadingContext";

// Custom hook to access the loading context
export const useLoading = () => useContext(LoadingContext);