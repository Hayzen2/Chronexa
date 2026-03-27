import api from './axios';

export const getTasksByUserId = async () => {
    try {
        const response = await api.get('/tasks/view-all');
        return response.data; 
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
} 

export const createTask = async (
    taskData: { 
        title: string; 
        description?: string; 
        file?: File | File[] 
    }
) => {
    try {
        const formData = new FormData();
        formData.append('title', taskData.title);
        if (taskData.description) {
            formData.append('description', taskData.description);
        }
        if (taskData.file) {
            if (Array.isArray(taskData.file)) {
                taskData.file.forEach((file) => formData.append('file', file));
            } else {
                formData.append('file', taskData.file);
            }
        }

        const response = await api.post('/tasks/create', formData);
        return response.data; 
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
}

export const updateTask = async (taskId: string, 
    taskData: { 
        title?: string; 
        description?: string; 
        filesToDelete?: string[]; 
        file?: File | File[] }) => {
    try {
        const formData = new FormData();
        if (taskData.title) {
            formData.append('title', taskData.title);
        }
        if (taskData.description) {
            formData.append('description', taskData.description);
        }
        if (taskData.filesToDelete) {
            taskData.filesToDelete.forEach((fileId) => formData.append('filesToDelete', fileId));
        }
        if (taskData.file) {
            if (Array.isArray(taskData.file)) {
                taskData.file.forEach((file) => formData.append('file', file));
            } else {
                formData.append('file', taskData.file);
            }
        }
        const response = await api.put(`/tasks/edit/${taskId}`, formData);
        return response.data; 
    } catch (error) {
        console.error('Error updating task:', error);
        throw error;
    }
}

export const deleteTask = async (taskId: string) => {
    try {
        const response = await api.delete(`/tasks/delete/${taskId}`);
        return response.data; 
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
}

export const getTaskById = async (taskId: string) => {
    try {
        const response = await api.get(`/tasks/view/${taskId}`);
        return response.data; 
    } catch (error) {
        console.error('Error fetching task:', error);
        throw error;
    }
}