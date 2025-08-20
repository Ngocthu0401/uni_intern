import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/common/HomePage';
import AboutPage from '../pages/common/AboutPage';
import ContactPage from '../pages/common/ContactPage';
import NotFoundPage from '../pages/common/NotFoundPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import StudentDashboard from '../pages/student/StudentDashboard';
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import MentorDashboard from '../pages/mentor/MentorDashboard';
import StudentManagement from '../pages/admin/student/StudentManagement';
import CompanyManagement from '../pages/admin/CompanyManagement';
import TeacherManagement from '../pages/admin/TeacherManagement';
import MentorManagement from '../pages/admin/mentor/MentorManagement';
import BatchManagement from '../pages/admin/batch_management/BatchManagement';
import InternshipManagement from '../pages/admin/internship';
import ProfilePage from '../pages/student/profile/ProfilePage';
import InternshipApplicationPage from '../pages/student/InternshipApplicationPage';
import ReportsPage from '../pages/student/ReportsPage';
import ContractsPage from '../pages/student/ContractsPage';
import EvaluationsPage from '../pages/student/EvaluationsPage';
import StudentManagementPage from '../pages/teacher/student_management/StudentManagementPage';
import ReportReviewPage from '../pages/teacher/ReportReviewPage';
import EvaluationManagement from '../pages/teacher/evaluation/EvaluationManagement';
// import PaymentManagement from '../pages/admin/payment/PaymentManagement';
import StatisticsPage from '../pages/teacher/StatisticsPage';
import MentorDashboardPage from '../pages/mentor/MentorDashboardPage';
import StudentEvaluationPage from '../pages/mentor/student_evaluation/StudentEvaluationPage';
import StudentDetailPage from '../pages/mentor/StudentDetailPage';
import MentorReportsPage from '../pages/mentor/ReportsPage';
import InternshipTracking from '../pages/mentor/InternshipTracking';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import StudentLayout from '../layouts/StudentLayout';
import TeacherLayout from '../layouts/TeacherLayout';
import MentorLayout from '../layouts/MentorLayout';
import PaymentManagement from '../pages/admin/payment/PaymentManagement';

const AppRouter = () => {
  return (
    <Routes>
      {/* Common Pages */}
      <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
      <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
      <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />

      {/* Auth Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/admin/students" element={<AdminLayout><StudentManagement /></AdminLayout>} />
      <Route path="/admin/companies" element={<AdminLayout><CompanyManagement /></AdminLayout>} />
      <Route path="/admin/teachers" element={<AdminLayout><TeacherManagement /></AdminLayout>} />
      <Route path="/admin/mentors" element={<AdminLayout><MentorManagement /></AdminLayout>} />
      <Route path="/admin/batches" element={<AdminLayout><BatchManagement /></AdminLayout>} />
      <Route path="/admin/internships" element={<AdminLayout><InternshipManagement /></AdminLayout>} />
      {/* <Route path="/admin/contracts" element={<AdminLayout><ContractManagement /></AdminLayout>} /> */}
      <Route path="/admin/payments" element={<AdminLayout><PaymentManagement /></AdminLayout>} />

      {/* Student Routes */}
      <Route path="/student" element={<StudentLayout><StudentDashboard /></StudentLayout>} />
      <Route path="/student/profile" element={<StudentLayout><ProfilePage /></StudentLayout>} />
      <Route path="/student/internship-application" element={<StudentLayout><InternshipApplicationPage /></StudentLayout>} />
      <Route path="/student/reports" element={<StudentLayout><ReportsPage /></StudentLayout>} />
      <Route path="/student/contracts" element={<StudentLayout><ContractsPage /></StudentLayout>} />
      <Route path="/student/evaluations" element={<StudentLayout><EvaluationsPage /></StudentLayout>} />

      {/* Teacher Routes */}
      <Route path="/teacher" element={<TeacherLayout><TeacherDashboard /></TeacherLayout>} />
      <Route path="/teacher/student-management" element={<TeacherLayout><StudentManagementPage /></TeacherLayout>} />
      <Route path="/teacher/report-review" element={<TeacherLayout><ReportReviewPage /></TeacherLayout>} />
      <Route path="/teacher/evaluation-management" element={<TeacherLayout><EvaluationManagement /></TeacherLayout>} />
      <Route path="/teacher/statistics" element={<TeacherLayout><StatisticsPage /></TeacherLayout>} />

      {/* Mentor Routes */}
      <Route path="/mentor" element={<MentorLayout><MentorDashboard /></MentorLayout>} />
      <Route path="/mentor/dashboard" element={<MentorLayout><MentorDashboardPage /></MentorLayout>} />
      <Route path="/mentor/student-evaluation" element={<MentorLayout><StudentEvaluationPage /></MentorLayout>} />
      <Route path="/mentor/student/:studentId" element={<MentorLayout><StudentDetailPage /></MentorLayout>} />
      <Route path="/mentor/reports" element={<MentorLayout><MentorReportsPage /></MentorLayout>} />
      <Route path="/mentor/internship-tracking" element={<MentorLayout><InternshipTracking /></MentorLayout>} />

      {/* 404 Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;