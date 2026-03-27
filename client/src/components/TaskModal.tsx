import { useNavigate } from "react-router-dom";

interface Task {
    id: string;
    title: string;
    description?: string | null;
    status: string;
    dueDate: string;
}

interface TaskModalProps {
    tasks: Task[];
    day: number;
    onClose: () => void;
}

export default function TaskModal({ tasks, day, onClose }: TaskModalProps) {
    const navigate = useNavigate();
    const getStatusColor = (status: string) => {
        switch (status) {
            case "TODO":
                return "bg-blue-500";
            case "COMPLETED":
                return "bg-green-500";
            case "OVERDUE":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };
    return ( 
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-2xl w-80 shadow-lg">
                <div className="flex justify-between mb-3">
                    <h2 className="font-bold text-lg">Tasks - Day {day}</h2>
                    <button onClick={onClose}>✕</button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {tasks.map((task) => (
                        <div 
                        key={task.id} 
                        className={`p-2 rounded-lg ${getStatusColor(task.status)}`}
                        onClick={() => navigate(`/tasks/${task.id}`)}
                        >
                            <h3 className="font-semibold">{task.title}</h3>
                            {task.description && (
                                <p className="text-sm text-white/80">{task.description}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}