import { Modal, Form, Input, Select } from 'antd';

const EditStudentModal = ({ open, onCancel, onSave, form }) => {
    return (
        <Modal title="Chỉnh sửa thông tin sinh viên" open={open} onCancel={onCancel} okText="Lưu" onOk={onSave}>
            <Form form={form} layout="vertical">
                <Form.Item label="Mã sinh viên" name="studentCode" rules={[{ required: true, message: 'Nhập mã sinh viên' }]}>
                    <Input placeholder="VD: 211234567" />
                </Form.Item>
                <Form.Item label="Lớp" name="className">
                    <Input placeholder="VD: D21CQCN01-N" />
                </Form.Item>
                <Form.Item label="Ngành" name="major">
                    <Input placeholder="VD: Khoa học máy tính" />
                </Form.Item>
                <Form.Item label="Khóa/Năm học" name="academicYear">
                    <Select
                        options={[
                            { value: 'FIRST_YEAR', label: 'Năm 1' },
                            { value: 'SECOND_YEAR', label: 'Năm 2' },
                            { value: 'THIRD_YEAR', label: 'Năm 3' },
                            { value: 'FOURTH_YEAR', label: 'Năm 4' },
                            { value: 'FIFTH_YEAR', label: 'Năm 5' }
                        ]}
                        allowClear
                        placeholder="Chọn năm học"
                    />
                </Form.Item>
                <Form.Item label="GPA" name="gpa" rules={[{ pattern: /^(\d+(\.\d+)?)?$/, message: 'GPA không hợp lệ' }]}>
                    <Input placeholder="VD: 3.2" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditStudentModal;


