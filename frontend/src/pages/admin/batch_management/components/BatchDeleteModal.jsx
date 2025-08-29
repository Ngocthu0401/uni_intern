import React from 'react';
import { Modal, Alert, Button, Space } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';

const BatchDeleteModal = ({ batch, visible, onClose, onConfirm }) => {
    if (!visible || !batch) return null;

    return (
        <Modal
            title={
                <div className="flex items-center space-x-2">
                    <ExclamationCircleOutlined className="text-red-600" />
                    <span className="text-lg font-semibold">Xác nhận xóa</span>
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose} className="rounded-lg">
                    Hủy
                </Button>,
                <Button
                    key="delete"
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={onConfirm}
                    className="rounded-lg"
                >
                    Xóa đợt thực tập
                </Button>
            ]}
            width={500}
            className="batch-delete-modal"
            destroyOnHidden
        >
            <div className="space-y-4">
                <Alert
                    message="Cảnh báo"
                    description="Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến đợt thực tập này sẽ bị xóa vĩnh viễn."
                    type="warning"
                    showIcon
                    className="rounded-lg"
                />

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Thông tin đợt thực tập sẽ bị xóa:</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex justify-between">
                            <span>Tên đợt thực tập:</span>
                            <span className="font-medium">{batch.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Mã đợt thực tập:</span>
                            <span className="font-mono">{batch.batchCode}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Học kỳ:</span>
                            <span>{batch.getSemesterLabel()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Năm học:</span>
                            <span>{batch.academicYear}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Số sinh viên đăng ký:</span>
                            <span className="font-medium text-red-600">{batch.currentStudents} sinh viên</span>
                        </div>
                    </div>
                </div>

                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                        <ExclamationCircleOutlined className="text-red-600 mt-0.5" />
                        <div className="text-sm text-red-800">
                            <p className="font-medium mb-1">Dữ liệu sẽ bị xóa:</p>
                            <ul className="list-disc list-inside space-y-1 text-red-700">
                                <li>Thông tin đợt thực tập</li>
                                <li>Danh sách sinh viên đăng ký</li>
                                <li>Thông tin phân công công ty</li>
                                <li>Lịch sử đăng ký</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default BatchDeleteModal;
