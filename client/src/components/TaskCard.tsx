import { useNavigate } from "react-router-dom";
import { getStatusColor } from "../utils/taskColor";

interface TaskCardProps {
    id: string;
    title: string;
    description?: string;
    status: string;
    dueDate: string;
}

export default function TaskCard({
    id,
    title,
    description,
    status,
    dueDate
}: TaskCardProps) {
    const navigate = useNavigate();

    const formattedDate = new Date(dueDate).toLocaleDateString();

    return (
        <div
            onClick={() => navigate(`/tasks/${id}`)}
            className="bg-pink-50 border border-pink-100 rounded-2xl p-4 shadow-sm 
                       hover:shadow-md hover:bg-pink-100 transition-all duration-200 cursor-pointer"
        >
            {/* Top section */}
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-pink-700 truncate">
                    {title}
                </h3>

                <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusColor(status)}`}
                >
                    {status}
                </span>
            </div>

            {/* Description */}
            {description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {description}
                </p>
            )}

            {/* Footer */}
            <div className="flex justify-between items-center text-xs text-gray-500">
                <span>📅 {formattedDate}</span>
                <span className="text-pink-400">View →</span>
            </div>
        </div>
    );
}