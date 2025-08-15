import React, { useMemo } from 'react';
import { Modal, Form, Select, InputNumber, Input, Row, Col, Divider, Typography } from 'antd';

const { TextArea } = Input;
const { Title } = Typography;

// Part I: Tinh thần kỷ luật, thái độ (6.0 điểm tối đa)
const disciplineFields = [
    { key: 'understandingOrganization', label: 'Hiểu biết về cơ quan nơi thực tập', maxScore: 1.0 },
    { key: 'followingRules', label: 'Thực hiện nội quy của cơ quan, đơn vị', maxScore: 1.0 },
    { key: 'workScheduleCompliance', label: 'Chấp hành giờ giấc làm việc', maxScore: 1.0 },
    { key: 'communicationAttitude', label: 'Thái độ giao tiếp với cán bộ, nhân viên', maxScore: 1.0 },
    { key: 'propertyProtection', label: 'Ý thức bảo vệ của công', maxScore: 1.0 },
    { key: 'workEnthusiasm', label: 'Tích cực trong công việc', maxScore: 1.0 }
];

// Part II: Khả năng chuyên môn, nghiệp vụ (4.0 điểm tối đa)
const professionalFields = [
    { key: 'jobRequirementsFulfillment', label: 'Đáp ứng yêu cầu công việc', maxScore: 2.0 },
    { key: 'learningSpirit', label: 'Tinh thần học hỏi, nâng cao trình độ chuyên môn, nghiệp vụ', maxScore: 1.0 },
    { key: 'initiativeCreativity', label: 'Có đề xuất, sáng kiến, năng động trong công việc', maxScore: 1.0 }
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

    const scores = useMemo(() => {
        const values = form.getFieldsValue();
        const allValues = { ...initialValues, ...values };

        // Calculate discipline score (Part I)
        const disciplineScore = disciplineFields.reduce((sum, field) => {
            return sum + (allValues[field.key] || 0);
        }, 0);

        // Calculate professional score (Part II)
        const professionalScore = professionalFields.reduce((sum, field) => {
            return sum + (allValues[field.key] || 0);
        }, 0);

        // Calculate overall score
        const totalScore = disciplineScore + professionalScore;

        return {
            disciplineScore,
            professionalScore,
            totalScore
        };
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
            width={1000}
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

                {/* Part I: Tinh thần kỷ luật, thái độ */}
                <Divider orientation="left">
                    <Title level={4} style={{ margin: 0 }}>I. Tinh thần kỷ luật, thái độ (6.0 điểm tối đa)</Title>
                </Divider>

                <Row gutter={16}>
                    {disciplineFields.map((field) => (
                        <Col xs={24} md={12} key={field.key}>
                            <Form.Item
                                name={field.key}
                                label={`${field.label} (${field.maxScore} điểm)`}
                                rules={[{ type: 'number', min: 0, max: field.maxScore }]}
                            >
                                <InputNumber
                                    min={0}
                                    max={field.maxScore}
                                    step={0.1}
                                    className="w-full"
                                    placeholder={`0 - ${field.maxScore}`}
                                />
                            </Form.Item>
                        </Col>
                    ))}
                </Row>

                {/* Part II: Khả năng chuyên môn, nghiệp vụ */}
                <Divider orientation="left">
                    <Title level={4} style={{ margin: 0 }}>II. Khả năng chuyên môn, nghiệp vụ (4.0 điểm tối đa)</Title>
                </Divider>

                <Row gutter={16}>
                    {professionalFields.map((field) => (
                        <Col xs={24} md={12} key={field.key}>
                            <Form.Item
                                name={field.key}
                                label={`${field.label} (${field.maxScore} điểm)`}
                                rules={[{ type: 'number', min: 0, max: field.maxScore }]}
                            >
                                <InputNumber
                                    min={0}
                                    max={field.maxScore}
                                    step={0.1}
                                    className="w-full"
                                    placeholder={`0 - ${field.maxScore}`}
                                />
                            </Form.Item>
                        </Col>
                    ))}
                </Row>

                {/* Score Summary */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <Row gutter={16}>
                        <Col xs={24} md={8}>
                            <div className="text-center">
                                <div className="text-sm text-gray-600">Điểm phần I</div>
                                <div className="text-lg font-bold text-blue-600">{scores.disciplineScore.toFixed(1)}/6.0</div>
                            </div>
                        </Col>
                        <Col xs={24} md={8}>
                            <div className="text-center">
                                <div className="text-sm text-gray-600">Điểm phần II</div>
                                <div className="text-lg font-bold text-green-600">{scores.professionalScore.toFixed(1)}/4.0</div>
                            </div>
                        </Col>
                        <Col xs={24} md={8}>
                            <div className="text-center">
                                <div className="text-sm text-gray-600">Tổng điểm</div>
                                <div className="text-xl font-bold text-red-600">{scores.totalScore.toFixed(1)}/10.0</div>
                            </div>
                        </Col>
                    </Row>
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


