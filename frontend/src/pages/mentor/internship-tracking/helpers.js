export const getStatusBadgeClass = (status) => {
    const base = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (status) {
        case 'ACTIVE':
        case 'ASSIGNED':
        case 'IN_PROGRESS':
            return `${base} bg-green-100 text-green-800`;
        case 'PENDING':
            return `${base} bg-yellow-100 text-yellow-800`;
        case 'COMPLETED':
            return `${base} bg-blue-100 text-blue-800`;
        case 'SUSPENDED':
            return `${base} bg-red-100 text-red-800`;
        default:
            return `${base} bg-gray-100 text-gray-800`;
    }
};

export const getStatusText = (status) => {
    switch (status) {
        case 'ACTIVE':
        case 'ASSIGNED':
        case 'IN_PROGRESS':
            return 'Đang thực tập';
        case 'PENDING':
            return 'Chờ duyệt';
        case 'COMPLETED':
            return 'Hoàn thành';
        case 'SUSPENDED':
            return 'Tạm ngừng';
        default:
            return status || 'N/A';
    }
};

export const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-blue-600';
    if (progress >= 40) return 'text-yellow-600';
    return 'text-red-600';
};

export const getProgressBarClass = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
};

export const getPriorityBadgeClass = (priority) => {
    const base = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (priority) {
        case 'HIGH':
            return `${base} bg-red-100 text-red-800`;
        case 'MEDIUM':
            return `${base} bg-yellow-100 text-yellow-800`;
        case 'LOW':
            return `${base} bg-green-100 text-green-800`;
        default:
            return `${base} bg-gray-100 text-gray-800`;
    }
};


