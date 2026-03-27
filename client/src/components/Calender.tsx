import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTasksByUserId } from "../api/taskApi";
import { taskModal } from "./TaskModal";

interface Task {
    id: string;
    title: string;
    dueDate: string;
    status: string;
}
export default function Calender() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [tasks, setTasks] = useState<Task[]>([]);

    const [showAllTasksModal, setShowAllTasksModal] = useState<number | null>(null);

    // Get current year and month
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get first day of the month
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    // Get number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    // Fetch tasks for the current user 
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await getTasksByUserId();
                setTasks(data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
    }, [currentDate]);
    
    const handlePreviousMonth = () => {
        const newDate = new Date(year, month - 1, 1);
        setCurrentDate(newDate);
    }
    
    const handleNextMonth = () => {
        const newDate = new Date(year, month + 1, 1);
        setCurrentDate(newDate);
    }

    // Group tasks by due date
    const taskByDate: Record<string, Task[]> = {};
    tasks.forEach(task => {
        const dueDate = new Date(task.dueDate);
        const taskMonth = dueDate.getMonth();
        const taskYear = dueDate.getFullYear();
        const dayOfMonth = dueDate.getDate();
        // Show only those in current month and year
        if(taskMonth === month && taskYear === year){
            if (!taskByDate[dayOfMonth]){
                taskByDate[dayOfMonth] = [];
            } 
            taskByDate[dayOfMonth].push(task);
        }
        
    });
    const days = [];

    // Add empty divs for days before the first day of the month
    for(let i = 0 ; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className="w-1/7 h-16"></div>);
    }

    // Add divs for each day of the month
    for(let i = 1 ; i <= daysInMonth; i++) {
        const isToday = i === today.getDate() 
            && month === today.getMonth()
            && year === today.getFullYear();
        const tasksForDay = taskByDate[i] || [];
        days.push(
            <div
                onClick={() => setShowAllTasksModal(i)}
                key={`day-${i}`}
                className={`p-2 h-24 rounded-xl border flex flex-col
                    ${isToday ? 'bg-pink-500 text-white' : 'bg-pink-50 hover:bg-pink-100 cursor-pointer'}`}
                >
                {/* Days number */}
                <div className="font-bold">{i}</div>
                {/* Task titles */}
                <div className="mt-1 space-y-1">
                    {tasksForDay.slice(0, 3).map((task) => (
                        <div key={task.id} className="text-xs bg-pink-200 text-pink-800 p-1 rounded">
                            {task.title}
                        </div>
                    ))}
                </div>
                {/*If there are more than 3 tasks, show a "+X more" indicator */}
                {tasksForDay.length > 3 && (
                    <div className="text-xs text-pink-600 font-semibold">
                        +{tasksForDay.length - 3} more
                    </div>
                )}
            </div>
        );
    }
    
    const monthName = currentDate.toLocaleString('default', { month: 'long' });

    return (
        <div className="p-4">
            <div className="p-4 max-w-2xl mx-auto bg-pink-100 shadow-lg rounded-2xl">
                <h1 className="text-2xl font-bold mb-4 text-center text-pink-700">🌸 Calendar</h1>
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <button onClick = {handlePreviousMonth} className = "px-3 py-1 bg-pink-300 text-white rounded-lg hover:bg-pink-400"
                    >
                        <i className='fas fa-angle-left font-size:36px'></i>
                    </button>
                    <h2 className="text-lg font-semibold text-pink-700">{monthName} {year}</h2>
                    <button onClick = {handleNextMonth} className = "px-3 py-1 bg-pink-300 text-white rounded-lg hover:bg-pink-400"
                    >
                        <i className='fas fa-angle-right font-size:36px'></i>

                    </button>
                </div>
                {/* Week days */}
                <div className="grid grid-cols-7 text-center font-semibold mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day}>{day}</div>
                    ))}
                </div>
                {/* Days */}
                <div className="grid grid-cols-7 gap-1">
                    {days}
                </div>
            </div>
        </div>
    );
}