import React from 'react';
import { Pagination, Card } from 'antd';
import { TeamOutlined } from '@ant-design/icons';

const BatchPagination = ({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageChange
}) => {
    if (totalPages <= 1) return null;

    const startItem = ((currentPage - 1) * pageSize) + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    return (
        <Card className="shadow-sm border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                {/* Items Info */}
                <div className="flex items-center space-x-2 text-gray-600">
                    <TeamOutlined className="text-gray-400" />
                    <span className="text-sm">
                        Hiển thị <span className="font-medium text-gray-900">{startItem}</span> - <span className="font-medium text-gray-900">{endItem}</span>
                        trong <span className="font-medium text-gray-900">{totalItems}</span> đợt thực tập
                    </span>
                </div>

                {/* Pagination */}
                <Pagination
                    current={currentPage}
                    total={totalItems}
                    pageSize={pageSize}
                    onChange={onPageChange}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} đợt thực tập`}
                    className="custom-pagination"
                    itemRender={(page, type, originalElement) => {
                        if (type === 'prev') {
                            return <span className="text-gray-600">Trước</span>;
                        }
                        if (type === 'next') {
                            return <span className="text-gray-600">Sau</span>;
                        }
                        return originalElement;
                    }}
                />
            </div>
        </Card>
    );
};

export default BatchPagination;
