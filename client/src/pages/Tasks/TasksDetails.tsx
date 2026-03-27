import { useState, useEffect, type ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskById, updateTask } from "../../api/taskApi";

interface TaskDetailsType {
  id: string;
  title: string;
  description?: string;
  files?: { name: string; url: string }[];
  status: string;
  dueDate: string;
}

export default function TaskDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<TaskDetailsType | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [filesToDelete, setFilesToDelete] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch task details
  const fetchTask = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await getTaskById(id);
      setTask(data);
      setTitle(data.title);
      setDescription(data.description || "");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch task details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewFiles(Array.from(e.target.files));
    }
  };

  const handleDeleteExistingFile = (fileUrl: string) => {
    setFilesToDelete((prev) => [...prev, fileUrl]);
    if (task) {
      setTask({
        ...task,
        files: task.files?.filter((f) => f.url !== fileUrl),
      });
    }
  };

  const handleSave = async () => {
    if (!task) return;
    setSaving(true);
    setError("");

    try {
      await updateTask(task.id, {
        title,
        description,
        file: newFiles,
        filesToDelete,
      });
      fetchTask(); // Refresh
      setNewFiles([]);
      setFilesToDelete([]);
    } catch (err) {
      console.error(err);
      setError("Failed to save task");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <p>Loading task details...</p>;
  if (!task) return <p>Task not found</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Task</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {/* Title */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-pink-200"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-pink-200"
        />
      </div>

      {/* Existing Files */}
      {task.files && task.files.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Existing Files</label>
          <ul className="list-disc list-inside">
            {task.files.map((file) => (
              <li key={file.url} className="flex justify-between items-center">
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  {file.name}
                </a>
                <button
                  onClick={() => handleDeleteExistingFile(file.url)}
                  className="text-red-500 ml-2 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Upload New Files */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Add New Files</label>
        <input type="file" multiple onChange={handleFileChange} />
        {newFiles.length > 0 && (
          <ul className="mt-2 text-sm text-gray-600">
            {newFiles.map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          disabled={saving}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded bg-pink-400 text-white hover:bg-pink-500"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}