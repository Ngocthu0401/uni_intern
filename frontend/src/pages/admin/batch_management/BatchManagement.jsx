import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { batchService } from '../../../services';
import { Batch, BatchSearchCriteria, PaginationOptions } from '../../../models';
import { BatchHeader, BatchSearchFilters, BatchTable, BatchPagination, BatchDetailModal, BatchFormModal, BatchDeleteModal } from './components';
import './BatchManagement.css';

const BatchManagement = () => {
  // Data states
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'

  // Search and filtering
  const [searchCriteria, setSearchCriteria] = useState(new BatchSearchCriteria());
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [pagination, setPagination] = useState(new PaginationOptions());
  const [totalBatches, setTotalBatches] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadBatches();
  }, [searchCriteria, pagination]);

  const loadBatches = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await batchService.searchBatches(searchCriteria, pagination);

      const batchData = response.data.map(batchData => new Batch(batchData));
      setBatches(batchData);
      setTotalBatches(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error loading batches:', error);
      setError('Không thể tải danh sách đợt thực tập');
      message.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Search and filter handlers
  const handleSearchChange = (keyword) => {
    setSearchCriteria(prev => ({ ...prev, keyword }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (field, value) => {
    setSearchCriteria(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleClearFilters = () => {
    setSearchCriteria(new BatchSearchCriteria());
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // Modal handlers
  const handleCreateBatch = () => {
    setModalMode('create');
    setSelectedBatch(null);
    setFormModalVisible(true);
  };

  const handleViewBatch = (batch) => {
    setSelectedBatch(batch);
    setDetailModalVisible(true);
  };

  const handleEditBatch = (batch) => {
    setModalMode('edit');
    setSelectedBatch(batch);
    setFormModalVisible(true);
  };

  const handleDeleteBatch = (batch) => {
    setSelectedBatch(batch);
    setDeleteModalVisible(true);
  };

  const closeDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedBatch(null);
  };

  const closeFormModal = () => {
    setFormModalVisible(false);
    setSelectedBatch(null);
  };

  const closeDeleteModal = () => {
    setDeleteModalVisible(false);
    setSelectedBatch(null);
  };

  // Form submission handler
  const handleFormSubmit = async (formData) => {
    try {
      if (modalMode === 'create') {
        // Kiểm tra xem có phải tạo batch cho từng công ty không
        if (formData.companyId) {
          // Tạo batch cho một công ty cụ thể
          await batchService.createBatch(formData);
        } else {
          // Tạo batch thông thường
          await batchService.createBatch(formData);
        }
      } else {
        await batchService.updateBatch(selectedBatch.id, formData);
        message.success('Cập nhật đợt thực tập thành công');
      }

      closeFormModal();
      loadBatches();
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Có lỗi xảy ra khi lưu thông tin');
      throw error;
    }
  };

  // Delete handler
  const handleDelete = async () => {
    try {
      await batchService.deleteBatch(selectedBatch.id);
      message.success('Xóa đợt thực tập thành công');
      closeDeleteModal();
      loadBatches();
    } catch (error) {
      console.error('Error deleting batch:', error);
      message.error('Có lỗi xảy ra khi xóa đợt thực tập');
    }
  };

  return (
    <div className="!space-y-6 !p-6 !bg-gray-50 !min-h-screen">
      <BatchHeader onCreateBatch={handleCreateBatch} />

      <BatchSearchFilters
        searchCriteria={searchCriteria}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        showFilters={showFilters}
        onToggleFilters={handleToggleFilters}
      />

      {error && (
        <div className="!bg-red-50 !border !border-red-200 !rounded-lg !p-4">
          <p className="!text-red-800">{error}</p>
        </div>
      )}

      <BatchTable
        batches={batches}
        loading={loading}
        onViewBatch={handleViewBatch}
        onEditBatch={handleEditBatch}
        onDeleteBatch={handleDeleteBatch}
      />

      <BatchPagination
        currentPage={pagination.page}
        totalPages={totalPages}
        totalItems={totalBatches}
        pageSize={pagination.size}
        onPageChange={handlePageChange}
      />

      <BatchDetailModal
        batch={selectedBatch}
        visible={detailModalVisible}
        onClose={closeDetailModal}
      />

      <BatchFormModal
        visible={formModalVisible}
        mode={modalMode}
        batch={selectedBatch}
        onClose={closeFormModal}
        onSubmit={handleFormSubmit}
      />

      <BatchDeleteModal
        batch={selectedBatch}
        visible={deleteModalVisible}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default BatchManagement; 