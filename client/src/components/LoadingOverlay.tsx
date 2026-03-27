export default function LoadingOverlay() {
    return (
        <div className="fixed inset-0 bg-pink-200/40 backdrop-blur-sm flex flex-col items-center justify-center z-50">
            
            {/* Spinner */}
            <div className="rounded-full border-4 border-pink-200 border-t-pink-500 h-16 w-16 animate-spin"></div>

            {/* Text */}
            <div className="text-pink-700 text-lg mt-4 font-semibold">
                Loading...
            </div>

        </div>
    );
}