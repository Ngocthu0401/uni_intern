import { Modal, Button, Select, Progress, Tag, List, Typography } from 'antd';

const { Text } = Typography;

const DetailsModal = ({
    internship,
    tasks,
    progressData,
    onClose,
    onOpenTask,
    onOpenProgress,
    onChangeTaskStatus,
    onOpenEdit,
    open = true
}) => {
    if (!internship) return null;
    const statusColor = (s) =>
        s === 'COMPLETED' ? 'blue' : s === 'PENDING' ? 'gold' : s === 'SUSPENDED' ? 'red' : 'green';

    return (
        <Modal
            title={`Chi tiết Thực tập - ${internship.student?.user?.fullName || internship.student?.fullName || ''}`}
            open={open}
            onCancel={onClose}
            footer={null}
            width={1000}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-md font-medium text-gray-900">Danh sách Nhiệm vụ</h4>
                        <Button type="primary" onClick={onOpenTask}>Thêm nhiệm vụ</Button>
                    </div>

                    <List
                        locale={{ emptyText: 'Chưa có nhiệm vụ nào.' }}
                        dataSource={tasks}
                        renderItem={(task) => (
                            <List.Item className="border border-gray-100 rounded-md" actions={[
                                <Select
                                    size="small"
                                    value={task.status}
                                    onChange={(v) => onChangeTaskStatus(task.id, v)}
                                    options={[
                                        { value: 'PENDING', label: 'Chờ làm' },
                                        { value: 'IN_PROGRESS', label: 'Đang làm' },
                                        { value: 'COMPLETED', label: 'Hoàn thành' },
                                        { value: 'CANCELLED', label: 'Hủy' }
                                    ]}
                                    style={{ width: 130 }}
                                />
                            ]}>
                                <List.Item.Meta
                                    title={<div className="flex items-center gap-2"><Text strong>{task.title}</Text><Tag color={task.priority === 'HIGH' ? 'red' : task.priority === 'MEDIUM' ? 'gold' : 'green'}>{task.priority}</Tag><Tag color={statusColor(internship.status)}>{internship.status}</Tag></div>}
                                    description={
                                        <div className="text-sm text-gray-600">
                                            <div>{task.description}</div>
                                            <div className="flex justify-between text-xs mt-1">
                                                <span>Hạn: {task.dueDate}</span>
                                                <span>{task.estimatedHours}h</span>
                                            </div>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-md font-medium text-gray-900">Theo dõi Tiến độ</h4>
                        <Button onClick={onOpenProgress}>Cập nhật</Button>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">Tiến độ tổng thể</span>
                                <span className="text-lg font-semibold">{progressData.overallProgress || 0}%</span>
                            </div>
                            <Progress percent={progressData.overallProgress || 0} showInfo={false} />
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Tuần {progressData.currentWeek}/{progressData.totalWeeks}</p>
                            <div className="grid grid-cols-2 gap-4 text-xs">
                                <div className="bg-green-50 p-3 rounded">
                                    <p className="font-medium text-green-800">Hoàn thành</p>
                                    <p className="text-green-600">{tasks.filter(t => t.status === 'COMPLETED').length} nhiệm vụ</p>
                                </div>
                                <div className="bg-yellow-50 p-3 rounded">
                                    <p className="font-medium text-yellow-800">Đang làm</p>
                                    <p className="text-yellow-600">{tasks.filter(t => t.status === 'IN_PROGRESS').length} nhiệm vụ</p>
                                </div>
                                <div className="bg-blue-50 p-3 rounded">
                                    <p className="font-medium text-blue-800">Chờ làm</p>
                                    <p className="text-blue-600">{tasks.filter(t => t.status === 'PENDING').length} nhiệm vụ</p>
                                </div>
                                <div className="bg-red-50 p-3 rounded">
                                    <p className="font-medium text-red-800">Quá hạn</p>
                                    <p className="text-red-600">{tasks.filter(t => t.status === 'OVERDUE').length} nhiệm vụ</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
                <Button onClick={onOpenEdit} type="primary">Chỉnh sửa</Button>
                <Button onClick={onClose}>Đóng</Button>
            </div>
        </Modal>
    );
};

export default DetailsModal;


