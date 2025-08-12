import { EyeIcon } from '@heroicons/react/24/outline';
import { getStatusBadgeClass, getStatusText } from './helpers';

const InternshipsGrid = ({ internships, onOpen }) => {
    if (internships.length === 0) {
        return (
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 text-center text-gray-500">
                <svg className="h-12 w-12 mx-auto text-gray-400 mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4C7 4 2.73 7.11 1 12c1.73 4.89 6 8 11 8s9.27-3.11 11-8c-1.73-4.89-6-8-11-8Zm0 13a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z" fill="currentColor" />
                </svg>
                <p>Chưa có sinh viên thực tập nào được phân công.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {internships.map((internship) => (
                <div key={internship.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {internship.student?.user?.fullName || internship.student?.fullName || 'N/A'}
                                    </h3>
                                    <span className={getStatusBadgeClass(internship.status)}>
                                        {getStatusText(internship.status)}
                                    </span>
                                </div>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <p><strong>Mã SV:</strong> {internship.student?.studentCode || 'N/A'}</p>
                                    <p><strong>Vị trí:</strong> {internship.jobTitle || internship.position || 'N/A'}</p>
                                    <p><strong>Công ty:</strong> {internship.company?.companyName || internship.company?.name || 'N/A'}</p>
                                    <p><strong>Bắt đầu:</strong> {internship.startDate ? new Date(internship.startDate).toLocaleDateString('vi-VN') : 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={() => onOpen(internship)}
                                className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <EyeIcon className="h-4 w-4 mr-2" />
                                Chi tiết
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InternshipsGrid;


