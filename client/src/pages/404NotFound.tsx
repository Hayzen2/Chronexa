import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow flex items-center justify-center">
                <h2 className="text-3xl font-bold">404 Not Found</h2>
                <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => directToHomePage()}>
                    Go to Home
                </button>
            </main>
        </div>
    );

    function directToHomePage() {
        navigate("/");
    }
}

