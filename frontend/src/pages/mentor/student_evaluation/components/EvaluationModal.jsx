import React, { useMemo } from 'react';
import { Modal, Form, Select, InputNumber, Input, Row, Col, Divider, Typography, Alert } from 'antd';

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

const EvaluationModal = ({ open, mode = 'create', onCancel, onSubmit, students = [], internships = [], selectedStudent = null, initialValues = {}, loading = false, allStudentsEvaluated = false }) => {
    const [form] = Form.useForm();

    const isView = mode === 'view';
    const isEdit = mode === 'edit';

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

    // Auto-select student and internship when student is selected
    React.useEffect(() => {
        if (selectedStudent) {
            const fieldValues = {};

            // Set student ID if available
            if (selectedStudent.id) {
                fieldValues.studentId = selectedStudent.id;
            }

            // Set internship ID if available
            if (selectedStudent.internshipId) {
                fieldValues.internshipId = selectedStudent.internshipId;
            }

            if (Object.keys(fieldValues).length > 0) {
                form.setFieldsValue(fieldValues);
            }
        }
    }, [selectedStudent, form]);

    // Update form when initialValues change
    React.useEffect(() => {
        if (initialValues && Object.keys(initialValues).length > 0) {
            form.setFieldsValue(initialValues);
        }
    }, [initialValues, form]);

    // Reset form when modal opens
    React.useEffect(() => {
        if (open) {
            form.resetFields();
            if (initialValues && Object.keys(initialValues).length > 0) {
                form.setFieldsValue(initialValues);
            }
        }
    }, [open, initialValues, form]);

    return (
        <Modal
            open={open}
            title={mode === 'create' ? 'Tạo đánh giá mới' : mode === 'edit' ? 'Cập nhật đánh giá' : 'Chi tiết đánh giá'}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            onOk={() => form.submit()}
            okButtonProps={{ loading, disabled: isView || (mode === 'create' && allStudentsEvaluated && !selectedStudent) }}
            cancelButtonProps={{ disabled: loading }}
            okText={mode === 'create' ? 'Tạo đánh giá' : 'Cập nhật đánh giá'}
            width={1000}
            destroyOnHidden
        >
            <Form
                layout="vertical"
                form={form}
                initialValues={initialValues}
                onFinish={onSubmit}
                disabled={isView || (mode === 'create' && allStudentsEvaluated && !selectedStudent)}
            >
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item name="studentId" label="Sinh viên" rules={[{ required: true, message: 'Vui lòng chọn sinh viên' }]}>
                            <Select
                                showSearch
                                placeholder="Chọn sinh viên"
                                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                options={students.map(s => ({ value: s.id, label: `${s.name} - ${s.studentCode}` }))}
                                disabled={!!selectedStudent || isEdit}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item name="internshipId" label="Công ty thực tập" rules={[{ required: true, message: 'Vui lòng chọn thực tập' }]}>
                            <Select
                                showSearch
                                placeholder="Chọn thực tập"
                                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                options={internships.map(i => ({ value: i.id, label: `${i.student?.user?.fullName || i.student?.fullName} - ${i.company?.companyName} (${i.jobTitle})` }))}
                                disabled={!!selectedStudent || isEdit}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Alert when trying to create new evaluation but all students are evaluated */}
                {mode === 'create' && allStudentsEvaluated && !selectedStudent && (
                    <Alert
                        message="Tất cả sinh viên đã được đánh giá"
                        description="Các sinh viên mà bạn hướng dẫn đã được đánh giá hết. Bạn có thể cập nhật đánh giá bằng cách chọn sinh viên từ danh sách và nhấn nút 'Cập nhật đánh giá'."
                        type="info"
                        showIcon
                        className="!mb-4"
                    />
                )}

                {/* Display student and company info when editing or viewing */}
                {(isEdit || isView) && selectedStudent && (
                    <Row gutter={16} className="!mb-4">
                        <Col xs={24} md={8}>
                            <div className="!p-3 !bg-blue-50 !rounded">
                                <div className="!text-sm !text-gray-600">Sinh viên:</div>
                                <div className="!font-medium">{selectedStudent.name} - {selectedStudent.studentCode}</div>
                            </div>
                        </Col>
                        <Col xs={24} md={8}>
                            <div className="!p-3 !bg-green-50 !rounded">
                                <div className="!text-sm !text-gray-600">Công ty:</div>
                                <div className="!font-medium">{selectedStudent.company}</div>
                            </div>
                        </Col>
                        <Col xs={24} md={8}>
                            <div className="!p-3 !bg-orange-50 !rounded">
                                <div className="!text-sm !text-gray-600">Ngày đánh giá:</div>
                                <div className="!font-medium">{selectedStudent.evaluations[0]?.date ? new Date(selectedStudent.evaluations[0].date).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN')}</div>
                            </div>
                        </Col>
                    </Row>
                )}

                {/* Display detailed scores in view mode */}
                {isView && selectedStudent && selectedStudent.evaluations && selectedStudent.evaluations.length > 0 && (
                    <div className="!mb-8">
                        <div className="!text-center !mb-6">
                            <h3 className="!text-xl !font-bold !text-gray-800 !mb-2">Tổng quan đánh giá</h3>
                            <p className="!text-gray-600">Kết quả đánh giá chi tiết của sinh viên</p>
                        </div>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={8}>
                                <div className="!text-center !p-6 !bg-gradient-to-br !from-blue-50 !to-blue-100 !rounded-xl !border !border-blue-200 !shadow-sm !hover:!shadow-md !transition-all">
                                    <div className="!w-16 !h-16 !bg-blue-500 !rounded-full !flex !items-center !justify-center !mx-auto !mb-4">
                                        <span className="!text-white !text-xl !font-bold">I</span>
                                    </div>
                                    <div className="!text-sm !text-gray-600 !mb-2">Điểm phần I</div>
                                    <div className="!text-3xl !font-bold !text-blue-600 !mb-1">
                                        {selectedStudent.evaluations[0].disciplineScore?.toFixed(1) || '0.0'}
                                    </div>
                                    <div className="!text-sm !text-gray-500">/ 6.0 điểm</div>
                                    <div className="!mt-3 !text-xs !text-blue-600 !font-medium">Kỷ luật & Thái độ</div>
                                </div>
                            </Col>
                            <Col xs={24} md={8}>
                                <div className="!text-center !p-6 !bg-gradient-to-br !from-green-50 !to-green-100 !rounded-xl !border !border-green-200 !shadow-sm !hover:!shadow-md !transition-all">
                                    <div className="!w-16 !h-16 !bg-green-500 !rounded-full !flex !items-center !justify-center !mx-auto !mb-4">
                                        <span className="!text-white !text-xl !font-bold">II</span>
                                    </div>
                                    <div className="!text-sm !text-gray-600 !mb-2">Điểm phần II</div>
                                    <div className="!text-3xl !font-bold !text-green-600 !mb-1">
                                        {selectedStudent.evaluations[0].professionalScore?.toFixed(1) || '0.0'}
                                    </div>
                                    <div className="!text-sm !text-gray-500">/ 4.0 điểm</div>
                                    <div className="!mt-3 !text-xs !text-green-600 !font-medium">Chuyên môn & Nghiệp vụ</div>
                                </div>
                            </Col>
                            <Col xs={24} md={8}>
                                <div className="!text-center !p-6 !bg-gradient-to-br !from-purple-50 !to-purple-100 !rounded-xl !border !border-purple-200 !shadow-sm !hover:!shadow-md !transition-all">
                                    <div className="!w-16 !h-16 !bg-purple-500 !rounded-full !flex !items-center !justify-center !mx-auto !mb-4">
                                        <span className="!text-white !text-xl !font-bold">∑</span>
                                    </div>
                                    <div className="!text-sm !text-gray-600 !mb-2">Tổng điểm</div>
                                    <div className="!text-3xl !font-bold !text-purple-600 !mb-1">
                                        {selectedStudent.evaluations[0].overallScore?.toFixed(1) || '0.0'}
                                    </div>
                                    <div className="!text-sm !text-gray-500">/ 10.0 điểm</div>
                                    <div className="!mt-3 !text-xs !text-purple-600 !font-medium">Điểm tổng kết</div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                )}

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
                                    className="!w-full"
                                    placeholder={`0 - ${field.maxScore}`}
                                />
                            </Form.Item>
                        </Col>
                    ))}
                </Row>

                {/* Display discipline scores in view mode */}
                {isView && selectedStudent && selectedStudent.evaluations && selectedStudent.evaluations.length > 0 && (
                    <div className="!mt-6">
                        <div className="!mb-4">
                            <div className="!flex !items-center !mb-3">
                                <div className="!w-3 !h-6 !bg-blue-500 !rounded !mr-3"></div>
                                <h4 className="!text-lg !font-semibold !text-blue-700 !m-0">I. Tinh thần kỷ luật, thái độ</h4>
                                <div className="!ml-auto !px-3 !py-1 !bg-blue-100 !text-blue-700 !rounded-full !text-sm !font-medium">
                                    {selectedStudent.evaluations[0].disciplineScore?.toFixed(1) || '0.0'}/6.0 điểm
                                </div>
                            </div>
                        </div>
                        <Row gutter={[16, 12]}>
                            {disciplineFields.map((field) => (
                                <Col xs={24} md={12} key={`view-${field.key}`}>
                                    <div className="!p-4 !bg-gradient-to-r !from-blue-50 !to-blue-100 !rounded-lg !border !border-blue-200 !hover:!shadow-md !transition-shadow">
                                        <div className="!flex !justify-between !items-start !mb-2">
                                            <div className="!text-sm !text-gray-700 !font-medium !flex-1">{field.label}</div>
                                            <div className="!ml-3 !text-right">
                                                <div className="!text-lg !font-bold !text-blue-600">
                                                    {selectedStudent.evaluations[0][field.key]?.toFixed(1) || '0.0'}
                                                </div>
                                                <div className="!text-xs !text-gray-500">/{field.maxScore}</div>
                                            </div>
                                        </div>
                                        <div className="!w-full !bg-blue-200 !rounded-full !h-2">
                                            <div
                                                className="!bg-blue-500 !h-2 !rounded-full !transition-all !duration-300"
                                                style={{
                                                    width: `${((selectedStudent.evaluations[0][field.key] || 0) / field.maxScore) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}

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
                                    className="!w-full"
                                    placeholder={`0 - ${field.maxScore}`}
                                />
                            </Form.Item>
                        </Col>
                    ))}
                </Row>

                {/* Display professional scores in view mode */}
                {isView && selectedStudent && selectedStudent.evaluations && selectedStudent.evaluations.length > 0 && (
                    <div className="!mt-6">
                        <div className="!mb-4">
                            <div className="!flex !items-center !mb-3">
                                <div className="!w-3 !h-6 !bg-green-500 !rounded !mr-3"></div>
                                <h4 className="!text-lg !font-semibold !text-green-700 !m-0">II. Khả năng chuyên môn, nghiệp vụ</h4>
                                <div className="!ml-auto !px-3 !py-1 !bg-green-100 !text-green-700 !rounded-full !text-sm !font-medium">
                                    {selectedStudent.evaluations[0].professionalScore?.toFixed(1) || '0.0'}/4.0 điểm
                                </div>
                            </div>
                        </div>
                        <Row gutter={[16, 12]}>
                            {professionalFields.map((field) => (
                                <Col xs={24} md={12} key={`view-${field.key}`}>
                                    <div className="!p-4 !bg-gradient-to-r !from-green-50 !to-green-100 !rounded-lg !border !border-green-200 !hover:!shadow-md !transition-shadow">
                                        <div className="!flex !justify-between !items-start !mb-2">
                                            <div className="!text-sm !text-gray-700 !font-medium !flex-1">{field.label}</div>
                                            <div className="!ml-3 !text-right">
                                                <div className="!text-lg !font-bold !text-green-600">
                                                    {selectedStudent.evaluations[0][field.key]?.toFixed(1) || '0.0'}
                                                </div>
                                                <div className="!text-xs !text-gray-500">/{field.maxScore}</div>
                                            </div>
                                        </div>
                                        <div className="!w-full !bg-green-200 !rounded-full !h-2">
                                            <div
                                                className="!bg-green-500 !h-2 !rounded-full !transition-all !duration-300"
                                                style={{
                                                    width: `${((selectedStudent.evaluations[0][field.key] || 0) / field.maxScore) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}

                {/* Score Summary */}
                <div className="!mt-4 !p-4 !bg-blue-50 !rounded-lg">
                    <Row gutter={16}>
                        <Col xs={24} md={8}>
                            <div className="!text-center">
                                <div className="!text-sm !text-gray-600">Điểm phần I</div>
                                <div className="!text-lg !font-bold !text-blue-600">{scores.disciplineScore.toFixed(1)}/6.0</div>
                            </div>
                        </Col>
                        <Col xs={24} md={8}>
                            <div className="!text-center">
                                <div className="!text-sm !text-gray-600">Điểm phần II</div>
                                <div className="!text-lg !font-bold !text-green-600">{scores.professionalScore.toFixed(1)}/4.0</div>
                            </div>
                        </Col>
                        <Col xs={24} md={8}>
                            <div className="!text-center">
                                <div className="!text-sm !text-gray-600">Tổng điểm</div>
                                <div className="!text-xl !font-bold !text-red-600">{scores.totalScore.toFixed(1)}/10.0</div>
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

                {/* Display comments in view mode */}
                {isView && selectedStudent && selectedStudent.evaluations && selectedStudent.evaluations.length > 0 && (
                    <div className="!mt-8">
                        <div className="!mb-4">
                            <div className="!flex !items-center !mb-3">
                                <div className="!w-3 !h-6 !bg-orange-500 !rounded !mr-3"></div>
                                <h4 className="!text-lg !font-semibold !text-orange-700 !m-0">Nhận xét & Đánh giá</h4>
                            </div>
                        </div>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <div className="!p-6 !bg-gradient-to-r !from-orange-50 !to-orange-100 !rounded-xl !border !border-orange-200 !shadow-sm">
                                    <div className="!flex !items-start !mb-4">
                                        <div className="!w-8 !h-8 !bg-orange-500 !rounded-full !flex !items-center !justify-center !mr-3 !flex-shrink-0">
                                            <span className="!text-white !text-sm !font-bold">💬</span>
                                        </div>
                                        <div className="!flex-1">
                                            <div className="!text-sm !text-orange-600 !font-medium !mb-2">Nhận xét chung</div>
                                            <div className="!text-base !text-gray-800 !whitespace-pre-wrap !leading-relaxed">
                                                {selectedStudent.evaluations[0].comments || 'Chưa có nhận xét'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                )}
            </Form>
        </Modal>
    );
};

export default EvaluationModal;
