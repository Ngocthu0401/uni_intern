import React, { useMemo } from 'react';
import { Modal, Form, Select, InputNumber, Input, Row, Col, Divider } from 'antd';

const { TextArea } = Input;

const scoreFields = [
    { key: 'discipline', label: 'Tinh thần kỷ luật' },
    { key: 'knowledge', label: 'Hiểu biết về cơ quan' },
    { key: 'compliance', label: 'Thực hiện nội quy' },
    { key: 'communication', label: 'Giao tiếp' },
    { key: 'protection', label: 'Bảo vệ của công' },
    { key: 'initiative', label: 'Sáng kiến' },
    { key: 'jobRequirements', label: 'Đáp ứng yêu cầu công việc' },
    { key: 'learning', label: 'Tinh thần học hỏi' },
    { key: 'creativity', label: 'Sáng tạo' }
];

const EvaluationModal = ({
    open,
    mode = 'create',
    onCancel,
    onSubmit,
    students = [],
    internships = [],
    initialValues = {},
    loading = false,
}) => {
    const [form] = Form.useForm();

    const isView = mode === 'view';

    const totalScore = useMemo(() => {
        const values = form.getFieldsValue();
        const {
            discipline = 0, knowledge = 0, compliance = 0, communication = 0,
            protection = 0, initiative = 0, jobRequirements = 0, learning = 0,
            creativity = 0
        } = { ...initialValues, ...values };
        const total = (
            discipline + knowledge + compliance + communication +
            protection + initiative + jobRequirements + learning +
            creativity
        );
        return total;
    }, [form, initialValues]);

    return (
        <Modal
            open={open}
            title={mode === 'create' ? 'Tạo đánh giá mới' : mode === 'edit' ? 'Chỉnh sửa đánh giá' : 'Chi tiết đánh giá'}
            onCancel={onCancel}
            onOk={() => form.submit()}
            okButtonProps={{ loading, disabled: isView }}
            cancelButtonProps={{ disabled: loading }}
            okText={mode === 'create' ? 'Tạo đánh giá' : 'Cập nhật'}
            width={900}
            destroyOnClose
        >
            <Form
                layout="vertical"
                form={form}
                initialValues={initialValues}
                onFinish={onSubmit}
                disabled={isView}
            >
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item name="studentId" label="Sinh viên" rules={[{ required: true, message: 'Vui lòng chọn sinh viên' }]}>
                            <Select
                                showSearch
                                placeholder="Chọn sinh viên"
                                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                options={students.map(s => ({ value: s.id, label: `${s.user?.fullName} - ${s.studentCode}` }))}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item name="internshipId" label="Thực tập" rules={[{ required: true, message: 'Vui lòng chọn thực tập' }]}>
                            <Select
                                showSearch
                                placeholder="Chọn thực tập"
                                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                options={internships.map(i => ({ value: i.id, label: `${i.student?.user?.fullName} - ${i.company?.companyName} (${i.jobTitle})` }))}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item name="semester" label="Học kỳ" rules={[{ required: true, message: 'Vui lòng nhập học kỳ' }]}>
                            <Input placeholder="VD: 1, 2, 3" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item name="academicYear" label="Năm học" rules={[{ required: true, message: 'Vui lòng nhập năm học' }]}>
                            <Input placeholder="VD: 2023-2024" />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider orientation="left">Tiêu chí đánh giá (0-10 điểm)</Divider>

                <Row gutter={16}>
                    {scoreFields.map((field) => (
                        <Col xs={24} md={12} key={field.key}>
                            <Form.Item name={field.key} label={field.label} rules={[{ type: 'number', min: 0, max: 10 }]}>
                                <InputNumber min={0} max={10} className="w-full" />
                            </Form.Item>
                        </Col>
                    ))}
                </Row>

                <div className="mt-2 p-3 bg-gray-50 rounded-md flex items-center justify-between">
                    <span className="text-base font-medium">Tổng điểm:</span>
                    <span className="text-xl font-bold">{totalScore}/10</span>
                </div>

                <Divider orientation="left">Nhận xét</Divider>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="comments" label="Nhận xét chung">
                            <TextArea rows={4} placeholder="Nhận xét tổng thể..." />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default EvaluationModal;


