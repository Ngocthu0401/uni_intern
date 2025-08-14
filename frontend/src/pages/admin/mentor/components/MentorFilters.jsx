import { useMemo } from 'react';
import { Input, Button, Select, Row, Col, Space } from 'antd';

const MentorFilters = ({
    keyword,
    onKeywordChange,
    showAdvanced,
    onToggleAdvanced,
    expertiseOptions,
    companies,
    criteria,
    onCriteriaChange,
    onClear,
}) => {
    const companyOptions = useMemo(() => {
        if (!Array.isArray(companies)) return [];
        return companies.map((c) => ({ label: c.companyName, value: String(c.id) }));
    }, [companies]);

    const normalizeEmpty = (val) => (val === undefined || val === null || val === '' ? null : val);

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <Row gutter={[12, 12]} align="middle">
                <Col xs={24} md={16}>
                    <Input.Search
                        placeholder="Tìm kiếm theo tên, email, công ty..."
                        value={keyword}
                        onChange={(e) => onKeywordChange(e.target.value)}
                        allowClear
                    />
                </Col>
                <Col xs={24} md={8} className="flex md:justify-end">
                    <Space>
                        <Button onClick={onToggleAdvanced}>Bộ lọc</Button>
                        <Button onClick={onClear} type="text">Xóa bộ lọc</Button>
                    </Space>
                </Col>
            </Row>

            {showAdvanced && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <Row gutter={[12, 12]}>
                        <Col xs={24} md={8}>
                            <div className="flex flex-col gap-2">
                                <span className="text-sm text-gray-600">Trình độ chuyên môn</span>
                                <Select
                                    options={[{ label: 'Tất cả trình độ', value: '' }, ...expertiseOptions]}
                                    value={criteria.expertiseLevel ?? ''}
                                    onChange={(val) => onCriteriaChange('expertiseLevel', normalizeEmpty(val))}
                                    allowClear
                                />
                            </div>
                        </Col>
                        <Col xs={24} md={8}>
                            <div className="flex flex-col gap-2">
                                <span className="text-sm text-gray-600">Công ty</span>
                                <Select
                                    showSearch
                                    placeholder="Chọn công ty"
                                    options={companyOptions}
                                    value={criteria.company ?? undefined}
                                    onChange={(val) => onCriteriaChange('company', normalizeEmpty(val))}
                                    allowClear
                                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                />
                            </div>
                        </Col>
                        <Col xs={24} md={8}>
                            <div className="flex flex-col gap-2">
                                <span className="text-sm text-gray-600">Kinh nghiệm (năm)</span>
                                <Input
                                    type="number"
                                    min={0}
                                    placeholder="Số năm kinh nghiệm tối thiểu"
                                    value={criteria.minYearsOfExperience ?? ''}
                                    onChange={(e) => onCriteriaChange('minYearsOfExperience', normalizeEmpty(e.target.value === '' ? null : parseInt(e.target.value, 10)))}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
            )}
        </div>
    );
};

export default MentorFilters;


