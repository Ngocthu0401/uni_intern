import React, { useState, useEffect } from 'react';
import { Spin, message } from 'antd';
import { batchService, internshipService } from '../../../services';
import { PaymentHeader, BatchSelection, PaymentStatistics, PaymentTable, StudentDetailModal } from './components';

const PaymentManagement = () => {
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [paymentData, setPaymentData] = useState([]);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const unitPrice = 420000;

  useEffect(() => {
    loadBatches();
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      loadInternshipsByBatch(selectedBatch);
    }
  }, [selectedBatch]);

  const loadBatches = async () => {
    try {
      setLoading(true);
      const response = await batchService.getActiveBatchesGroupedForPayment();
      setBatches(response.content || response.data || response || []);
    } catch (error) {
      console.error('Error loading batches:', error);
      message.error('Không thể tải danh sách đợt thực tập');
    } finally {
      setLoading(false);
    }
  };

  const loadInternshipsByBatch = async (batchName) => {
    try {
      setLoading(true);
      // Lấy tất cả các batch có cùng tên đợt (phần trước dấu gạch nối)
      const allBatches = await batchService.getActiveBatches();
      const relatedBatches = allBatches.filter(batch => {
        const batchDisplayName = batch.batchName.split(' - ')[0].trim();
        return batchDisplayName === batchName;
      });

      // Lấy tất cả internships từ các batch liên quan
      const allInternships = [];
      for (const batch of relatedBatches) {
        const response = await internshipService.getInternshipsByBatch(batch.id);
        const internshipsData = response.content || response.data || response || [];
        allInternships.push(...internshipsData);
      }

      const paymentData = processInternshipsForPayment(allInternships);
      setPaymentData(paymentData);
    } catch (error) {
      console.error('Error loading internships:', error);
      message.error('Không thể tải danh sách thực tập');
    } finally {
      setLoading(false);
    }
  };

  const processInternshipsForPayment = (internshipsData) => {
    const groupedByCompany = internshipsData.reduce((acc, internship) => {
      const companyId = internship.company?.id;
      const companyName = internship.company?.companyName || 'Chưa phân công';

      if (!acc[companyId]) {
        acc[companyId] = {
          companyId,
          companyName,
          teacher: internship.teacher,
          mentor: internship.mentor,
          students: [],
          totalAmount: 0
        };
      }

      if (internship.student) {
        acc[companyId].students.push(internship.student);
      }

      return acc;
    }, {});

    Object.values(groupedByCompany).forEach(company => {
      company.totalAmount = company.students.length * unitPrice;
    });

    return Object.values(groupedByCompany);
  };

  const handleBatchChange = (batchName) => {
    setSelectedBatch(batchName);
  };

  const handleViewStudents = (internship) => {
    setSelectedInternship(internship);
    setShowStudentModal(true);
  };

  const handleCloseStudentModal = () => {
    setShowStudentModal(false);
    setSelectedInternship(null);
  };

  const calculateTotalAmount = () => {
    return paymentData.reduce((total, company) => total + company.totalAmount, 0);
  };

  const calculateTotalStudents = () => {
    return paymentData.reduce((total, company) => total + company.students.length, 0);
  };

  if (loading && !batches.length) {
    return (
      <div className="!min-h-screen !bg-gray-50 !flex !items-center !justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="!min-h-screen !bg-gray-50 !py-8">
      <div className="!max-w-7xl !mx-auto !px-4 !sm:!px-6 !lg:!px-8">
        <PaymentHeader
          onReload={loadBatches}
          loading={loading}
        />

        <BatchSelection
          batches={batches}
          selectedBatch={selectedBatch}
          onBatchChange={handleBatchChange}
          loading={loading}
          unitPrice={unitPrice}
        />

        {selectedBatch && paymentData.length > 0 && (
          <PaymentStatistics
            paymentData={paymentData}
            totalAmount={calculateTotalAmount()}
            totalStudents={calculateTotalStudents()}
          />
        )}

        <PaymentTable
          selectedBatch={selectedBatch}
          paymentData={paymentData}
          totalAmount={calculateTotalAmount()}
          onViewStudents={handleViewStudents}
        />

        <StudentDetailModal
          visible={showStudentModal}
          internship={selectedInternship}
          onClose={handleCloseStudentModal}
        />
      </div>
    </div>
  );
};

export default PaymentManagement;