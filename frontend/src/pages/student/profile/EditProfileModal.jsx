import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';

const EditProfileModal = ({ open, onCancel, onSubmit, initialValues }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open) {
            form.setFieldsValue({
                className: initialValues?.className || '',
                major: initialValues?.major || '',
                academicYear: initialValues?.academicYear || '',
                gpa: initialValues?.gpa ?? null,
            });
        }
    }, [open, initialValues, form]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            // Sanitize payload for backend
            onSubmit({
                className: values.className?.trim() || '',
                major: values.major?.trim() || '',
                academicYear: values.academicYear?.trim() || '',
                gpa: typeof values.gpa === 'number' ? values.gpa : null,
            });
        } catch (_) {
            // validation errors are shown by antd
        }
    };

    return (
        <Modal
            title="Cập nhật thông tin học tập"
            open={open}
            onOk={handleOk}
            onCancel={onCancel}
            okText="Lưu"
            cancelText="Hủy"
            destroyOnClose
        >
            <Form layout="vertical" form={form} preserve={false}>
                <Form.Item label="Lớp" name="className">
                    <Input placeholder="VD: D20CQCN01" allowClear />
                </Form.Item>
                <Form.Item label="Chuyên ngành" name="major">
                    <Input placeholder="Nhập chuyên ngành" allowClear />
                </Form.Item>
                <Form.Item label="Năm học" name="academicYear">
                    <Input placeholder="VD: 2023-2027" allowClear />
                </Form.Item>
                <Form.Item label="GPA" name="gpa" rules={[{ type: 'number', min: 0, max: 4, message: 'GPA từ 0 đến 4' }]}>
                    <InputNumber className="w-full" step={0.01} min={0} max={4} placeholder="VD: 3.2" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditProfileModal;


