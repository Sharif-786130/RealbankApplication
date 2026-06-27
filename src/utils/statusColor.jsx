export const statusColor = (status) => {
    switch (status) {
        case "APPROVED":
            return "bg-green-100 text-green-700";
        case "REJECTED":
            return "bg-red-100 text-red-700";
        case "PENDING":
            return "bg-yellow-100 text-yellow-700";
        default:
            return "bg-gray-100 text-gray-600";
    }
};