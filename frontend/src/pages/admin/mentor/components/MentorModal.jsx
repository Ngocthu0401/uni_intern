import { Modal, Form, Input, Select, InputNumber, Alert, Descriptions, Tag } from 'antd';
import { useEffect } from 'react';

const MentorModal = ({
    open,
    mode, // 'view' | 'create' | 'edit' | 'delete'
    onCancel,
    onOk,
    loading,
    formData,
    setFormData,
    formErrors,
    companies,
    expertiseOptions,
    selectedMentor,
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open && (mode === 'create' || mode === 'edit')) {
            form.setFieldsValue(formData);
        }
    }, [open, mode, formData, form]);

    const titleMap = {
        view: 'Chi tiết Mentor',
        create: 'Thêm Mentor mới',
        edit: 'Chỉnh sửa Mentor',
        delete: 'Xác nhận xóa',
    };

    if (!open) return null;

    if (mode === 'delete') {
        return (
            <Modal open={open} onCancel={onCancel} onOk={onOk} confirmLoading={loading} okButtonProps={{ danger: true }} okText="Xóa" cancelText="Hủy" title={titleMap[mode]}>
                <p>
                    Bạn có chắc chắn muốn xóa mentor <b>{selectedMentor?.user?.fullName}</b>? Hành động này không thể hoàn tác.
                </p>
                {formErrors?.general && <Alert type="error" message={formErrors.general} showIcon />}
            </Modal>
        );
    }

    if (mode === 'view') {
        const user = selectedMentor?.user;
        const company = selectedMentor?.company;
        return (
            <Modal open={open} onCancel={onCancel} footer={null} title={titleMap[mode]} width={820}>
                <div className="bg-white">
                    <div className="flex items-start gap-4">
                        <div className="shrink-0">
                            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold">
                                {(user?.fullName || user?.username || 'M')[0]}
                            </div>
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xl font-semibold truncate max-w-[420px]">{user?.fullName}</span>
                                <Tag color="green">Mentor</Tag>
                            </div>
                            <div className="text-gray-500 truncate">{user?.email}</div>
                            <div className="text-gray-500">{user?.phoneNumber || 'Chưa có số điện thoại'}</div>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Descriptions bordered size="small" column={1} className="!w-full">
                            <Descriptions.Item label="Công ty">
                                {company?.companyName || 'Chưa có công ty'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Chức vụ">
                                {selectedMentor?.position || 'Chưa xác định'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Địa điểm làm việc">
                                {selectedMentor?.officeLocation || 'Chưa cập nhật'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Kinh nghiệm">
                                {selectedMentor?.yearsOfExperience || 0} năm
                            </Descriptions.Item>
                        </Descriptions>

                        <Descriptions bordered size="small" column={1} className="!w-full">
                            <Descriptions.Item label="Trình độ">
                                {selectedMentor?.expertiseLevel || 'Chưa xác định'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số lượng hướng dẫn tối đa">
                                {selectedMentor?.maxInterns || 0} sinh viên
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái hoạt động">
                                {selectedMentor?.isActive ? (
                                    <Tag color="green">Hoạt động</Tag>
                                ) : (
                                    <Tag>Không hoạt động</Tag>
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Cập nhật lần cuối">
                                {selectedMentor?.updatedAt || '—'}
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                </div>
            </Modal>
        );
    }

    const companyOptions = (companies || []).map((c) => ({ label: c.companyName, value: String(c.id) }));
    // const expertiseOptions = (expertiseOptions || []).map((opt) => ({ label: opt.label, value: opt.value }));

    return (
        <Modal
            open={open}
            title={titleMap[mode]}
            onCancel={onCancel}
            okText={mode === 'create' ? 'Thêm' : 'Cập nhật'}
            cancelText="Hủy"
            onOk={() => form.submit()}
            confirmLoading={loading}
            width={720}
        >
            {formErrors?.general && <Alert className="mb-3" type="error" message={formErrors.general} showIcon />}
            {mode === 'edit' && (
                <Alert
                    className="mb-3"
                    type="info"
                    message={
                        <span>
                            <b>Lưu ý:</b> Thông tin tài khoản (tên đăng nhập, email, họ tên, số điện thoại) không thể chỉnh sửa. Chỉ có thể chỉnh sửa thông tin mentor.
                        </span>
                    }
                    showIcon
                />
            )}
            <Form
                layout="vertical"
                form={form}
                initialValues={formData}
                onValuesChange={(changed, all) => setFormData(all)}
                onFinish={onOk}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item name="username" label={<>Tên đăng nhập <span className="text-red-500">*</span></>} rules={mode === 'create' ? [{ required: true, message: 'Tên đăng nhập không được để trống' }] : []}>
                        <Input placeholder="mentor123" disabled={mode === 'edit'} />
                    </Form.Item>
                    <Form.Item name="email" label={<>Email <span className="text-red-500">*</span></>} rules={mode === 'create' ? [
                        { required: true, message: 'Email không được để trống' },
                        { type: 'email', message: 'Email không hợp lệ' }
                    ] : []}>
                        <Input placeholder="mentor@company.com" disabled={mode === 'edit'} />
                    </Form.Item>
                    <Form.Item name="fullName" label={<>Họ và tên <span className="text-red-500">*</span></>} rules={mode === 'create' ? [{ required: true, message: 'Họ và tên không được để trống' }] : []}>
                        <Input placeholder="Nguyễn Văn A" disabled={mode === 'edit'} />
                    </Form.Item>
                    <Form.Item name="phone" label={<>Số điện thoại <span className="text-red-500">*</span></>} rules={mode === 'create' ? [{ required: true, message: 'Số điện thoại không được để trống' }] : []}>
                        <Input placeholder="0123456789" disabled={mode === 'edit'} />
                    </Form.Item>

                    <Form.Item name="company" label={<>Công ty <span className="text-red-500">*</span></>} rules={[{ required: true, message: 'Công ty không được để trống' }]}>
                        <Select options={companyOptions} placeholder="Chọn công ty" showSearch filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())} />
                    </Form.Item>
                    <Form.Item name="position" label={<>Chức vụ <span className="text-red-500">*</span></>} rules={[{ required: true, message: 'Chức vụ không được để trống' }]}>
                        <Input placeholder="Senior Developer" />
                    </Form.Item>
                    <Form.Item name="officeLocation" label="Địa điểm làm việc">
                        <Input placeholder="Tầng 3, Phòng 301" />
                    </Form.Item>
                    <Form.Item name="expertiseLevel" label={<>Trình độ chuyên môn <span className="text-red-500">*</span></>} rules={[{ required: true, message: 'Vui lòng chọn trình độ chuyên môn' }]}>
                        <Select options={expertiseOptions} placeholder="Chọn trình độ" allowClear />
                    </Form.Item>
                    <Form.Item name="yearsOfExperience" label="Số năm kinh nghiệm" rules={[{ type: 'number', min: 0, message: 'Số năm kinh nghiệm không được âm' }]}>
                        <InputNumber min={0} className="w-full" />
                    </Form.Item>
                    <Form.Item name="maxInterns" label="Số lượng hướng dẫn tối đa">
                        <InputNumber min={1} max={10} className="w-full" />
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    );
};

export default MentorModal;


