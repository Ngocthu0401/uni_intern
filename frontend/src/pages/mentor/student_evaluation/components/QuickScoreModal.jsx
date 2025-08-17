import React from 'react';
import { Modal, Form, InputNumber, Input, Row, Col, Typography } from 'antd';

const { TextArea } = Input;
const { Title } = Typography;

const QuickScoreModal = ({ open, onCancel, onSubmit, selectedStudent = null, initialValues = {}, loading = false, }) => {
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (open && selectedStudent) {
            form.setFieldsValue({
                mentorScore: selectedStudent.mentorScore || '',
                mentorComment: selectedStudent.mentorComment || ''
            });
        }
    }, [open, selectedStudent, form]);

    const handleSubmit = () => {
        form.validateFields().then(values => {
            onSubmit(values);
        });
    };

    return (
        <Modal
            open={open}
            title="Chấm điểm sinh viên"
            onCancel={onCancel}
            onOk={handleSubmit}
            okButtonProps={{ loading, disabled: !selectedStudent }}
            cancelButtonProps={{ disabled: loading }}
            okText="Lưu điểm"
            width={600}
            destroyOnClose
        >
            {selectedStudent && (
                <div className="!mb-4 !p-3 !bg-blue-50 !rounded-lg">
                    <Title level={5} style={{ margin: 0 }}>
                        {selectedStudent.name} - {selectedStudent.studentCode}
                    </Title>
                    <p className="!text-sm !text-gray-600 !mt-1">
                        {selectedStudent.company} • {selectedStudent.position}
                    </p>
                </div>
            )}

            <Form
                layout="vertical"
                form={form}
                initialValues={initialValues}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="mentorScore"
                            label="Điểm mentor (0-10)"
                            rules={[
                                { required: true, message: 'Vui lòng nhập điểm' },
                                { type: 'number', min: 0, max: 10, message: 'Điểm phải từ 0 đến 10' }
                            ]}
                        >
                            <InputNumber
                                min={0}
                                max={10}
                                step={0.1}
                                className="!w-full"
                                placeholder="Nhập điểm từ 0 đến 10"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="mentorComment"
                    label="Nhận xét"
                >
                    <TextArea
                        rows={4}
                        placeholder="Nhập nhận xét về quá trình thực tập..."
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default QuickScoreModal;
