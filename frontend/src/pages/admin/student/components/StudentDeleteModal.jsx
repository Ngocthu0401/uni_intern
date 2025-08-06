import {
    Modal,
    Typography,
    Alert,
    Descriptions,
    Space,
    Button,
    Card
} from 'antd';
import {
    ExclamationCircleOutlined,
    DeleteOutlined,
    CloseOutlined,
    UserOutlined,
    MailOutlined,
    IdcardOutlined,
    BookOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const StudentDeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    student,
    loading = false
}) => {
    if (!student) return null;

    return (
        <Modal
            title={
                <div className="flex items-center text-red-600">
                    <ExclamationCircleOutlined className="mr-2 text-2xl" />
                    <span>Xác nhận xóa sinh viên</span>
                </div>
            }
            open={isOpen}
            onCancel={onClose}
            width={600}
            footer={null}
            destroyOnClose
            maskStyle={{ backdropFilter: 'blur(4px)' }}
            className="ant-modal-confirm"
        >
            <div className="space-y-6">
                {/* Warning Alert */}
                <Alert
                    message="Cảnh báo: Hành động này không thể hoàn tác!"
                    description="Việc xóa sinh viên sẽ ảnh hưởng đến tất cả dữ liệu liên quan bao gồm thông tin thực tập, đánh giá và báo cáo."
                    type="error"
                    showIcon
                    icon={<ExclamationCircleOutlined />}
                    className="border-red-300"
                />

                {/* Student Information */}
                <Card
                    title={
                        <div className="flex items-center">
                            <UserOutlined className="text-blue-500 mr-2" />
                            <span>Thông tin sinh viên sẽ bị xóa</span>
                        </div>
                    }
                    className="bg-gray-50"
                >
                    <Descriptions
                        column={1}
                        size="small"
                        items={[
                            {
                                key: 'fullName',
                                label: (
                                    <span>
                                        <UserOutlined className="mr-2" />
                                        Họ và tên
                                    </span>
                                ),
                                children: (
                                    <Text strong>
                                        {student.user?.fullName || 'Chưa có thông tin'}
                                    </Text>
                                )
                            },
                            {
                                key: 'studentCode',
                                label: (
                                    <span>
                                        <IdcardOutlined className="mr-2" />
                                        Mã sinh viên
                                    </span>
                                ),
                                children: (
                                    <Text code strong>
                                        {student.studentCode}
                                    </Text>
                                )
                            },
                            {
                                key: 'email',
                                label: (
                                    <span>
                                        <MailOutlined className="mr-2" />
                                        Email
                                    </span>
                                ),
                                children: (
                                    <Text>
                                        {student.user?.email || 'Chưa có email'}
                                    </Text>
                                )
                            },
                            {
                                key: 'class',
                                label: (
                                    <span>
                                        <BookOutlined className="mr-2" />
                                        Lớp - Ngành
                                    </span>
                                ),
                                children: (
                                    <Text>
                                        {student.className || 'Chưa xác định'} - {student.major || 'Chưa xác định'}
                                    </Text>
                                )
                            }
                        ]}
                    />
                </Card>

                {/* Consequences List */}
                <Card
                    title={
                        <div className="flex items-center text-red-600">
                            <ExclamationCircleOutlined className="mr-2" />
                            <span>Hậu quả khi xóa</span>
                        </div>
                    }
                    className="border-red-200"
                >
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            <span>Tài khoản sinh viên sẽ bị xóa hoàn toàn khỏi hệ thống</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            <span>Tất cả thông tin cá nhân và học tập sẽ bị mất vĩnh viễn</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            <span>Dữ liệu thực tập và đánh giá có thể bị ảnh hưởng</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            <span>Các báo cáo và thống kê sẽ không còn chính xác</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            <span>Không thể khôi phục dữ liệu sau khi xóa</span>
                        </li>
                    </ul>
                </Card>

                {/* Confirmation Question */}
                <div className="text-center py-4">
                    <Title level={4} className="text-gray-800">
                        Bạn có chắc chắn muốn xóa sinh viên này?
                    </Title>
                    <Text type="secondary">
                        Hãy cân nhắc kỹ trước khi thực hiện hành động này
                    </Text>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center">
                    <Space size="large">
                        <Button
                            type="default"
                            icon={<CloseOutlined />}
                            onClick={onClose}
                            size="large"
                            disabled={loading}
                            className="min-w-[120px]"
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={onConfirm}
                            loading={loading}
                            size="large"
                            className="min-w-[120px]"
                        >
                            Xóa sinh viên
                        </Button>
                    </Space>
                </div>
            </div>
        </Modal>
    );
};

export default StudentDeleteModal;