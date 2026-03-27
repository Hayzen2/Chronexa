import { useState, useEffect } from "react";
import TaskCard from "../../components/TaskCard";
import AddNewTaskModal from "../../components/AddNewTaskModal";
import { getTasksByUserId } from "../../api/taskApi";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  dueDate: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const data = await getTasksByUserId();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-pink-400 text-white rounded hover:bg-pink-500"
        >
          + Add New Task
        </button>
      </div>

      {isLoading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found. Add a new task to get started.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} {...task} />
          ))}
        </div>
      )}

      {showAddModal && (
        <AddNewTaskModal
          onClose={() => setShowAddModal(false)}
          onTaskCreated={fetchTasks} // Refresh tasks after adding
        />
      )}
    </div>
  );
}