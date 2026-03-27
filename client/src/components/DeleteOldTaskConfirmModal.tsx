interface DeleteOldTaskConfirmModalProps {
  taskId: string;
  onClose: () => void;
  onDeleteConfirmed: (taskId: string) => void;
  isLoading?: boolean;
}

export default function DeleteOldTaskConfirmModal({
  taskId,
  onClose,
  onDeleteConfirmed,
  isLoading = false,
}: DeleteOldTaskConfirmModalProps) {
  const handleDelete = () => {
    onDeleteConfirmed(taskId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-xl font-bold mb-4 text-red-600">Delete Old Task</h2>
        <p className="mb-6">
          Are you sure you want to delete this old task? This action <strong>cannot be undone</strong>.
        </p>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}