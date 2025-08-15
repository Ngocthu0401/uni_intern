import React, { useState, useEffect } from 'react';
import { Modal, Card, Descriptions, Tag, Table, Button, Space, Avatar, Divider, Spin, Empty } from 'antd';
import { EyeOutlined, UserOutlined, CalendarOutlined, TeamOutlined, BankOutlined, ClockCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { studentService } from '../../../../services';
import StudentDetailModal from './StudentDetailModal';

const BatchDetailModal = ({ batch, visible, onClose }) => {
    const [students, setStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentDetailVisible, setStudentDetailVisible] = useState(false);


    const loadStudents = async () => {
        if (!batch) return;

        try {
            setLoadingStudents(true);
            const response = await studentService.getStudentsByBatch(batch.id);
            setStudents(response || []);
        } catch (error) {
            console.error('Error loading students:', error);
            setStudents([]);
        } finally {
            setLoadingStudents(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE':
                return 'green';
            case 'PENDING':
                return 'orange';
            case 'COMPLETED':
                return 'blue';
            default:
                return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'ACTIVE':
                return 'Hoạt động';
            case 'PENDING':
                return 'Chờ xác nhận';
            case 'COMPLETED':
                return 'Đã hoàn thành';
            default:
                return 'Không xác định';
        }
    };

    const studentColumns = [
        {
            title: 'Sinh viên',
            key: 'student',
            render: (_, record) => (
                <Space>
                    <Avatar icon={<UserOutlined />} className="bg-blue-500" />
                    <div>
                        <div className="font-medium text-gray-900">{record?.user?.fullName}</div>
                        <div className="text-sm text-gray-500">{record?.user?.email}</div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Mã sinh viên',
            dataIndex: 'studentCode',
            key: 'studentCode',
            className: '!text-gray-700',
        },
        {
            title: 'Lớp',
            dataIndex: 'className',
            key: 'className',
            className: '!text-gray-700',
        },
        // {
        //     title: 'Công ty',
        //     key: 'company',
        //     render: (_, record) => (
        //         <Space>
        //             <BankOutlined className="!text-gray-400" />
        //             <span className="!text-gray-700">
        //                 {record?.internships?.map(item => item?.company?.companyName).join(', ') || 'Chưa phân công'}
        //             </span>
        //         </Space>
        //     ),
        // },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_, record) => (
                <Tag color={getStatusColor(record.status)}>
                    {getStatusText(record.status)}
                </Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => {
                        setSelectedStudent(record);
                        setStudentDetailVisible(true);
                    }}
                    className="text-purple-600 hover:text-purple-800"
                >
                    Xem chi tiết
                </Button>
            ),
        },
    ];

    useEffect(() => {
        if (visible && batch) {
            loadStudents();
        }
    }, [visible, batch]);


    console.log('students', students);

    if (!visible || !batch) return null;



    return (
        <>
            <Modal
                title={
                    <div className="!flex !items-center !space-x-2">
                        <FileTextOutlined className="!text-purple-600" />
                        <span className="!text-lg !font-semibold">Chi tiết Đợt thực tập</span>
                    </div>
                }
                open={visible}
                onCancel={onClose}
                footer={[
                    <Button key="close" onClick={onClose} className="!rounded-lg">
                        Đóng
                    </Button>
                ]}
                width={1000}
                className="!batch-detail-modal"
                destroyOnClose
            >
                <div className="!space-y-6">
                    {/* Basic Information */}
                    <Card
                        title={
                            <div className="!flex !items-center !space-x-2">
                                <CalendarOutlined className="!text-blue-600" />
                                <span className="!text-lg !font-semibold">Thông tin đợt thực tập</span>
                            </div>
                        }
                        className="!shadow-sm !border-gray-200"
                        size="small"
                    >
                        <Descriptions column={2} bordered size="small" className="!border-gray-200">
                            <Descriptions.Item label="Tên đợt thực tập" span={2}>
                                <span className="!font-medium !text-gray-900">{batch.name}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Mã đợt thực tập">
                                <span className="!font-mono !text-gray-700">{batch.batchCode}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag color={batch.isActive() ? 'green' : 'orange'}>
                                    {batch.getStatusLabel()}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Học kỳ">
                                <span className="!text-gray-700">{batch.getSemesterLabel()}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Năm học">
                                <span className="!text-gray-700">{batch.academicYear}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Số lượng sinh viên">
                                <Space>
                                    <TeamOutlined className="!text-gray-400" />
                                    <span className="!text-gray-700">
                                        {batch.currentStudents}/{batch.maxStudents} sinh viên
                                    </span>
                                </Space>
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời lượng">
                                <Space>
                                    <ClockCircleOutlined className="!text-gray-400" />
                                    <span className="!text-gray-700">
                                        {batch.getDurationInWeeks()} tuần
                                    </span>
                                </Space>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                    {/* Timeline Information */}
                    <Card
                        title={
                            <div className="!flex !items-center !space-x-2">
                                <ClockCircleOutlined className="!text-green-600" />
                                <span className="!text-lg !font-semibold">Thời gian</span>
                            </div>
                        }
                        className="!shadow-sm !border-gray-200"
                        size="small"
                    >
                        <Descriptions column={2} bordered size="small" className="!border-gray-200">
                            <Descriptions.Item label="Thời gian đăng ký" span={2}>
                                <Space>
                                    <CalendarOutlined className="!text-gray-400" />
                                    <span className="!text-gray-700">
                                        {batch.getFormattedRegistrationStartDate()} - {batch.getFormattedRegistrationEndDate()}
                                    </span>
                                    <Tag color={batch.isRegistrationOpen() ? 'green' : 'red'}>
                                        {batch.isRegistrationOpen() ? 'Đang mở' : 'Đã đóng'}
                                    </Tag>
                                </Space>
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời gian thực tập" span={2}>
                                <Space>
                                    <CalendarOutlined className="!text-gray-400" />
                                    <span className="!text-gray-700">
                                        {batch.getFormattedInternshipStartDate()} - {batch.getFormattedInternshipEndDate()}
                                    </span>
                                </Space>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                    {/* Description */}
                    {batch.description && (
                        <Card
                            title={
                                <div className="!flex !items-center !space-x-2">
                                    <FileTextOutlined className="!text-purple-600" />
                                    <span className="!text-lg !font-semibold">Mô tả</span>
                                </div>
                            }
                            className="!shadow-sm !border-gray-200"
                            size="small"
                        >
                            <p className="!text-gray-700 !leading-relaxed">{batch.description}</p>
                        </Card>
                    )}

                    {/* Students List */}
                    <Card
                        title={
                            <div className="!flex !items-center !justify-between">
                                <div className="!flex !items-center !space-x-2">
                                    <TeamOutlined className="!text-blue-600" />
                                    <span className="!text-lg !font-semibold">Danh sách sinh viên đăng ký</span>
                                </div>
                                <Tag color="blue">{students.length} sinh viên</Tag>
                            </div>
                        }
                        className="!shadow-sm !border-gray-200"
                        size="small"
                    >
                        {loadingStudents ? (
                            <div className="!text-center !py-8">
                                <Spin size="large" />
                                <p className="!mt-2 !text-gray-500">Đang tải danh sách sinh viên...</p>
                            </div>
                        ) : students.length === 0 ? (
                            <Empty
                                description="Chưa có sinh viên nào đăng ký đợt thực tập này"
                                className="!py-8"
                            />
                        ) : (
                            <Table
                                columns={studentColumns}
                                dataSource={students}
                                rowKey="id"
                                pagination={false}
                                size="small"
                                className="custom-table"
                            />
                        )}
                    </Card>
                </div>
            </Modal>

            {/* Student Detail Modal */}
            <StudentDetailModal
                student={selectedStudent}
                visible={studentDetailVisible}
                onClose={() => {
                    setStudentDetailVisible(false);
                    setSelectedStudent(null);
                }}
            />
        </>
    );
};

export default BatchDetailModal;
