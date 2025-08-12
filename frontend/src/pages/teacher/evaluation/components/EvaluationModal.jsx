import React, { useMemo } from 'react';
import { Modal, Form, Select, InputNumber, Input, Row, Col, Divider } from 'antd';

const { TextArea } = Input;

const scoreFields = [
    { key: 'technicalSkills', label: 'Kỹ năng chuyên môn (20%)' },
    { key: 'softSkills', label: 'Kỹ năng mềm (15%)' },
    { key: 'workAttitude', label: 'Thái độ làm việc (15%)' },
    { key: 'learningAbility', label: 'Khả năng học hỏi (10%)' },
    { key: 'teamwork', label: 'Làm việc nhóm (10%)' },
    { key: 'communication', label: 'Giao tiếp (10%)' },
    { key: 'problemSolving', label: 'Giải quyết vấn đề (10%)' },
    { key: 'creativity', label: 'Sáng tạo (5%)' },
    { key: 'punctuality', label: 'Tính đúng giờ (5%)' },
    { key: 'responsibility', label: 'Trách nhiệm (10%)' },
    { key: 'overallPerformance', label: 'Hiệu suất tổng thể (10%)' },
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
            technicalSkills = 0, softSkills = 0, workAttitude = 0, learningAbility = 0,
            teamwork = 0, communication = 0, problemSolving = 0, creativity = 0,
            punctuality = 0, responsibility = 0, overallPerformance = 0,
        } = { ...initialValues, ...values };
        const weightedTotal = (
            (technicalSkills * 0.20) +
            (softSkills * 0.15) +
            (workAttitude * 0.15) +
            (learningAbility * 0.10) +
            (teamwork * 0.10) +
            (communication * 0.10) +
            (problemSolving * 0.10) +
            (creativity * 0.05) +
            (punctuality * 0.05) +
            (responsibility * 0.10) +
            (overallPerformance * 0.10)
        );
        return Math.round(weightedTotal);
    }, [form, initialValues]);

    console.log('students', students);
    console.log('internships', internships);

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
                        <Form.Item name="evaluationType" label="Loại đánh giá" rules={[{ required: true }]}>
                            <Select
                                options={[
                                    { value: 'MIDTERM', label: 'Giữa kỳ' },
                                    { value: 'FINAL', label: 'Cuối kỳ' },
                                    { value: 'MONTHLY', label: 'Hàng tháng' },
                                ]}
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

                <Divider orientation="left">Tiêu chí đánh giá (0-100 điểm)</Divider>

                <Row gutter={16}>
                    {scoreFields.map((field) => (
                        <Col xs={24} md={12} key={field.key}>
                            <Form.Item name={field.key} label={field.label} rules={[{ type: 'number', min: 0, max: 100 }]}>
                                <InputNumber min={0} max={100} className="w-full" />
                            </Form.Item>
                        </Col>
                    ))}
                </Row>

                <div className="mt-2 p-3 bg-gray-50 rounded-md flex items-center justify-between">
                    <span className="text-base font-medium">Tổng điểm:</span>
                    <span className="text-xl font-bold">{totalScore}/100</span>
                </div>

                <Divider orientation="left">Nhận xét</Divider>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="strengths" label="Điểm mạnh">
                            <TextArea rows={3} placeholder="Mô tả các điểm mạnh..." />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="weaknesses" label="Điểm yếu cần cải thiện">
                            <TextArea rows={3} placeholder="Mô tả các điểm yếu cần cải thiện..." />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="recommendations" label="Đề xuất và khuyến nghị">
                            <TextArea rows={3} placeholder="Đưa ra các đề xuất..." />
                        </Form.Item>
                    </Col>
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


