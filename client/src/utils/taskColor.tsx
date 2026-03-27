export const getStatusColor = (status: string) => {
    switch (status) {
        case "COMPLETED":
            return "bg-green-100 text-green-700";
        case "TODO":
            return "bg-blue-100 text-blue-700";
        case "OVERDUE":
            return "bg-red-100 text-red-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
};