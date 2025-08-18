import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Card, Space, Divider, message } from 'antd';
import { PlusOutlined, DeleteOutlined, BankOutlined } from '@ant-design/icons';
import { Semester, Batch } from '../../../../models';
import { companyService } from '../../../../services';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const BatchFormModal = ({
    visible,
    mode, // 'create' or 'edit'
    batch,
    onClose,
    onSubmit
}) => {
    const [form] = Form.useForm();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            loadCompanies();
            if (mode === 'edit' && batch) {
                form.setFieldsValue({
                    name: batch.name,
                    semester: batch.semester,
                    academicYear: batch.academicYear,
                    registrationDateRange: batch.registrationStartDate && batch.registrationEndDate ? [
                        dayjs(batch.registrationStartDate),
                        dayjs(batch.registrationEndDate)
                    ] : null,
                    internshipDateRange: batch.startDate && batch.endDate ? [
                        dayjs(batch.startDate),
                        dayjs(batch.endDate)
                    ] : null,
                    description: batch.description,
                    maxStudents: batch.maxStudents,
                    companies: batch.company ? [batch.company.id] : []
                });
                // Nếu có công ty, set selected company với quota từ maxStudents
                if (batch.company) {
                    setSelectedCompanies([{
                        ...batch.company,
                        quota: batch.maxStudents
                    }]);
                } else {
                    setSelectedCompanies([]);
                }
            } else {
                form.resetFields();
                setSelectedCompanies([]);
            }
        }
    }, [visible, mode, batch, form]);

    const loadCompanies = async () => {
        try {
            setLoading(true);
            const response = await companyService.getAllCompanies();
            setCompanies(response.data || []);
        } catch (error) {
            console.error('Error loading companies:', error);
            message.error('Không thể tải danh sách công ty');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values) => {
        try {
            setSubmitLoading(true);

            if (mode === 'create' && selectedCompanies.length > 0) {
                // Tạo batch cho từng công ty
                for (const company of selectedCompanies) {
                    const batchData = {
                        batchName: `${values.name} - ${company.companyName}`,
                        semester: values.semester,
                        academicYear: values.academicYear,
                        registrationStartDate: values.registrationDateRange?.[0]?.toISOString().split('T')[0],
                        registrationEndDate: values.registrationDateRange?.[1]?.toISOString().split('T')[0],
                        startDate: values.internshipDateRange?.[0]?.toISOString().split('T')[0],
                        endDate: values.internshipDateRange?.[1]?.toISOString().split('T')[0],
                        description: values.description,
                        companyId: company.id,
                        maxStudents: company.quota || 1
                    };
                    await onSubmit(batchData);
                }
                message.success(`Tạo thành công ${selectedCompanies.length} đợt thực tập cho các công ty`);
            } else if (mode === 'edit') {
                // Cập nhật batch
                const formData = {
                    id: batch.id,
                    batchName: values.name,
                    batchCode: batch.batchCode,
                    semester: values.semester,
                    academicYear: values.academicYear,
                    registrationStartDate: values.registrationDateRange?.[0]?.toISOString().split('T')[0],
                    registrationEndDate: values.registrationDateRange?.[1]?.toISOString().split('T')[0],
                    startDate: values.internshipDateRange?.[0]?.toISOString().split('T')[0],
                    endDate: values.internshipDateRange?.[1]?.toISOString().split('T')[0],
                    description: values.description,
                    maxStudents: values.maxStudents,
                    companyId: batch.company?.id || null,
                    isActive: batch.isActive
                };

                await onSubmit(formData);
                message.success('Cập nhật đợt thực tập thành công');
            } else {
                // Tạo batch không có công ty
                const formData = {
                    name: values.name,
                    semester: values.semester,
                    academicYear: values.academicYear,
                    registrationStartDate: values.registrationDateRange?.[0]?.toISOString().split('T')[0],
                    registrationEndDate: values.registrationDateRange?.[1]?.toISOString().split('T')[0],
                    startDate: values.internshipDateRange?.[0]?.toISOString().split('T')[0],
                    endDate: values.internshipDateRange?.[1]?.toISOString().split('T')[0],
                    description: values.description,
                    companies: selectedCompanies
                };

                await onSubmit(formData);
                message.success('Tạo đợt thực tập thành công');
            }

            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
            message.error('Có lỗi xảy ra khi lưu thông tin');
            throw error;
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleCompanyChange = (companyIds) => {
        const selectedCompanyData = companies.filter(company => companyIds.includes(company.id));
        const updatedCompanies = selectedCompanyData.map(company => {
            const existing = selectedCompanies.find(c => c.id === company.id);
            return existing ? existing : { ...company, quota: 1 };
        });
        setSelectedCompanies(updatedCompanies);
    };

    const handleCompanyQuotaChange = (companyId, quota) => {
        setSelectedCompanies(prev =>
            prev.map(company =>
                company.id === companyId
                    ? { ...company, quota: parseInt(quota) || 0 }
                    : company
            )
        );
    };

    const removeCompany = (companyId) => {
        setSelectedCompanies(prev => prev.filter(company => company.id !== companyId));
    };

    const semesterOptions = Object.values(Semester).map(semester => ({
        value: semester,
        label: new Batch({ semester }).getSemesterLabel()
    }));

    const companyOptions = companies.map(company => ({
        value: company.id,
        label: company.companyName
    }));

    return (
        <Modal
            title={
                <div className="!flex !items-center !space-x-2">
                    {/* <BuildingOutlined className="text-purple-600" /> */}
                    <span className="!text-lg !font-semibold">
                        {mode === 'create' ? 'Tạo Đợt thực tập mới' : 'Chỉnh sửa Đợt thực tập'}
                    </span>
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={null}
            width={800}
            className="batch-form-modal"
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    semester: Semester.SPRING
                }}
                className="mt-4"
            >

                <Form.Item
                    name="name"
                    label="Tên đợt thực tập"
                    rules={[{ required: true, message: 'Vui lòng nhập tên đợt thực tập' }]}
                >
                    <Input
                        placeholder="Thực tập HK1 2023-2024"
                        className="!rounded-lg"
                    />
                </Form.Item>
                <div className="!grid !grid-cols-2 !gap-4">


                    <Form.Item
                        name="semester"
                        label="Học kỳ"
                        rules={[{ required: true, message: 'Vui lòng chọn học kỳ' }]}
                    >
                        <Select
                            placeholder="Chọn học kỳ"
                            options={semesterOptions}
                            className="!rounded-lg"
                        />
                    </Form.Item>

                    <Form.Item
                        name="academicYear"
                        label="Năm học"
                        rules={[{ required: true, message: 'Vui lòng nhập năm học' }]}
                    >
                        <Input
                            placeholder="2023-2024"
                            className="!rounded-lg"
                        />
                    </Form.Item>
                </div>

                <div className="!grid !grid-cols-2 !gap-4">
                    <Form.Item
                        name="registrationDateRange"
                        label="Thời gian đăng ký"
                        rules={[
                            { required: true, message: 'Vui lòng chọn thời gian đăng ký' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value) return Promise.resolve();

                                    const internshipRange = getFieldValue('internshipDateRange');
                                    if (!internshipRange) return Promise.resolve();

                                    const registrationStart = value[0];
                                    const registrationEnd = value[1];
                                    const internshipStart = internshipRange[0];
                                    const internshipEnd = internshipRange[1];

                                    if (registrationStart && registrationEnd && internshipStart && internshipEnd) {
                                        // Thời gian đăng ký phải trước thời gian thực tập
                                        if (registrationEnd.isAfter(internshipStart)) {
                                            return Promise.reject(new Error('Thời gian đăng ký phải kết thúc trước khi thực tập bắt đầu'));
                                        }
                                    }

                                    return Promise.resolve();
                                }
                            })
                        ]}
                    >
                        <RangePicker
                            className="!w-full !rounded-lg"
                            placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                            format="DD/MM/YYYY"
                        />
                    </Form.Item>

                    <Form.Item
                        name="internshipDateRange"
                        label="Thời gian thực tập"
                        rules={[
                            { required: true, message: 'Vui lòng chọn thời gian thực tập' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value) return Promise.resolve();

                                    const registrationRange = getFieldValue('registrationDateRange');
                                    if (!registrationRange) return Promise.resolve();

                                    const internshipStart = value[0];
                                    const internshipEnd = value[1];
                                    const registrationStart = registrationRange[0];
                                    const registrationEnd = registrationRange[1];

                                    if (internshipStart && internshipEnd && registrationStart && registrationEnd) {
                                        // Thời gian thực tập phải sau thời gian đăng ký
                                        if (internshipStart.isBefore(registrationEnd)) {
                                            return Promise.reject(new Error('Thời gian thực tập phải bắt đầu sau khi đăng ký kết thúc'));
                                        }
                                    }

                                    return Promise.resolve();
                                }
                            })
                        ]}
                    >
                        <RangePicker
                            className="!w-full !rounded-lg"
                            placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                            format="DD/MM/YYYY"
                        />
                    </Form.Item>
                </div>


                <Form.Item
                    name="companies"
                    label="Chọn công ty"
                >
                    <Select
                        mode="multiple"
                        placeholder="Chọn công ty tham gia"
                        options={companyOptions}
                        onChange={handleCompanyChange}
                        loading={loading}
                        showSearch
                        filterOption={(input, option) =>
                            option.label.toLowerCase().includes(input.toLowerCase())
                        }
                        value={selectedCompanies.map(company => company.id)}
                        className="!rounded-lg"
                        disabled={mode === 'edit'} // Disable trong edit mode
                    />
                </Form.Item>

                {/* Hiển thị thông tin công ty trong edit mode */}
                {mode === 'edit' && batch?.company && (
                    <div className="!mt-4 !p-3 !bg-blue-50 !rounded-lg !border !border-blue-200">
                        <div className="!flex !items-center !space-x-2 !mb-2">
                            <BankOutlined className="!text-blue-600" />
                            <span className="!text-sm !font-medium !text-blue-800">Công ty hiện tại</span>
                        </div>
                        <div className="!text-sm !text-blue-700">
                            <div className="!font-medium">{batch.company.companyName}</div>
                            <div className="!text-xs !text-blue-600">{batch.company.industry}</div>
                        </div>
                    </div>
                )}

                {/* Trường maxStudents cho edit mode */}
                {mode === 'edit' && (
                    <Form.Item
                        name="maxStudents"
                        label="Số lượng sinh viên tối đa"
                        rules={[{ required: true, message: 'Vui lòng nhập số lượng sinh viên tối đa' }]}
                    >
                        <Input
                            type="number"
                            min="1"
                            placeholder="Nhập số lượng sinh viên tối đa"
                            className="!rounded-lg"
                        />
                    </Form.Item>
                )}

                {/* Selected Companies List */}
                {selectedCompanies.length > 0 && mode === 'create' && (
                    <div className="!mt-4">
                        <Divider orientation="left">Số lượng tuyển của từng công ty</Divider>
                        <div className="!space-y-3">
                            {selectedCompanies.map((company) => (
                                <div key={company.id} className="!flex !items-center !justify-between !p-3 !bg-gray-50 !rounded-lg !border !border-gray-200">
                                    <div className="!flex-1">
                                        <p className="!text-sm !font-medium !text-gray-900">{company.companyName}</p>
                                        <p className="!text-xs !text-gray-500">{company.industry}</p>
                                    </div>
                                    <Space>
                                        <Input
                                            type="number"
                                            placeholder="Số lượng"
                                            min="1"
                                            className="!w-24 !rounded-lg"
                                            value={company.quota || ''}
                                            onChange={(e) => handleCompanyQuotaChange(company.id, e.target.value)}
                                        />
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => removeCompany(company.id)}
                                            className="!text-red-600 hover:!text-red-800"
                                        />
                                    </Space>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                <Form.Item
                    name="description"
                    label="Mô tả chi tiết"
                >
                    <TextArea
                        rows={4}
                        placeholder="Mô tả chi tiết về đợt thực tập..."
                        className="!rounded-lg"
                    />
                </Form.Item>


                {/* Form Actions */}
                <div className="!flex !justify-end !space-x-3 !pt-4 !border-t !border-gray-200">
                    <Button
                        onClick={onClose}
                        className="rounded-lg"
                    >
                        Hủy
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={submitLoading}
                        className="!rounded-lg !bg-purple-600 hover:!bg-purple-700 !border-purple-600"
                    >
                        {mode === 'create' ? 'Tạo đợt thực tập' : 'Cập nhật'}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default BatchFormModal;
