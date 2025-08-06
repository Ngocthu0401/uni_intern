import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Calendar, Users, FileText, MessageSquare, Star, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import internshipService from '../../services/internshipService';
import reportService from '../../services/reportService';
import evaluationService from '../../services/evaluationService';

const MentorDashboardPage = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    completedStudents: 0,
    weeklyMeetings: 0
  });

  // Load dashboard data from API
  useEffect(() => {
    console.log('MentorDashboardPage - User object:', user);
    if (user?.id) {
      // Use user.id if mentorId is not available
      const mentorId = user.mentorId || user.id;
      console.log('Using mentorId:', mentorId);
      loadDashboardData(mentorId);
    } else {
      console.log('No user or user.id found');
      setError('Không tìm thấy thông tin mentor. Vui lòng đăng nhập lại.');
      setLoading(false);
    }
  }, [user]);

  const loadDashboardData = async (mentorId) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading dashboard data for mentorId:', mentorId);

      // Load internships for this mentor
      console.log('Fetching internships...');
      const internshipsResponse = await internshipService.getInternshipsByMentor(mentorId);
      const internships = internshipsResponse || [];
      console.log('Internships loaded:', internships);

      // Load reports for this mentor
      console.log('Fetching reports...');
      const reportsResponse = await reportService.getReportsByMentor(mentorId);
      const reports = reportsResponse || [];
      console.log('Reports loaded:', reports);

      // Transform internships to students
      const studentsData = internships
        .filter(internship => internship.student)
        .map(internship => {
          const studentReports = reports.filter(report => 
            report.student?.id === internship.student.id || report.studentId === internship.student.id
          );

          // Get last report date
          const lastReport = studentReports.length > 0 
            ? studentReports.sort((a, b) => new Date(b.submissionDate || b.createdAt) - new Date(a.submissionDate || a.createdAt))[0]
            : null;

          return {
            id: internship.student.id,
            name: internship.student.fullName || internship.student.name,
            email: internship.student.email || '',
            company: internship.company?.name || 'N/A',
            position: internship.position || 'N/A',
            startDate: internship.startDate,
            status: getInternshipStatus(internship),
            progress: calculateProgress(internship),
            lastReport: lastReport ? (lastReport.submissionDate || lastReport.createdAt) : null,
            avatar: '/api/placeholder/40/40',
            internshipId: internship.id
          };
        });

      setStudents(studentsData);

      // Calculate stats
      const totalStudents = studentsData.length;
      const activeStudents = studentsData.filter(s => s.status === 'active').length;
      const completedStudents = studentsData.filter(s => s.status === 'completed').length;
      
      setStats({
        totalStudents,
        activeStudents,
        completedStudents,
        weeklyMeetings: 0 // This would need a separate meetings API
      });

      // Generate mock meetings for now (replace with actual API when available)
      const mockMeetings = studentsData
        .filter(student => student.status === 'active')
        .slice(0, 2)
        .map((student, index) => ({
          id: index + 1,
          studentName: student.name,
          date: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: index === 0 ? '14:00' : '10:00',
          type: index === 0 ? 'Weekly Check-in' : 'Progress Review',
          status: 'scheduled'
        }));
      
      setMeetings(mockMeetings);
      setStats(prev => ({ ...prev, weeklyMeetings: mockMeetings.length }));

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Không thể tải dữ liệu dashboard. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getInternshipStatus = (internship) => {
    if (!internship.startDate || !internship.endDate) return 'pending';
    const now = new Date();
    const start = new Date(internship.startDate);
    const end = new Date(internship.endDate);
    
    if (now < start) return 'pending';
    if (now > end) return 'completed';
    return 'active';
  };

  const calculateProgress = (internship) => {
    if (!internship.startDate || !internship.endDate) return 0;
    const start = new Date(internship.startDate);
    const end = new Date(internship.endDate);
    const now = new Date();
    const total = end - start;
    const elapsed = now - start;
    return Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <Star className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim() || !selectedStudent) return;

    try {
      // This would need a feedback/message API endpoint
      // For now, just log and reset form
      console.log('Feedback submitted for student:', selectedStudent.id, feedback);
      
      // Reset form
      setFeedback('');
      setSelectedStudent(null);
      
      // Show success message (you might want to add a toast notification here)
      alert('Phản hồi đã được gửi thành công!');
      
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert('Không thể gửi phản hồi. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-800">{error}</p>
          </div>
          <Button 
            onClick={() => loadDashboardData(user?.mentorId || user?.id)}
            className="mt-3 bg-red-600 hover:bg-red-700"
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mentor Dashboard</h1>
          <p className="text-gray-600 mt-1">Quản lý và hỗ trợ sinh viên thực tập</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng sinh viên</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đang thực tập</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeStudents}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hoàn thành</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedStudents}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cuộc họp tuần này</p>
                <p className="text-2xl font-bold text-gray-900">{stats.weeklyMeetings}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="students" className="space-y-6">
        <TabsList>
          <TabsTrigger value="students">Sinh viên</TabsTrigger>
          <TabsTrigger value="meetings">Lịch họp</TabsTrigger>
          <TabsTrigger value="feedback">Phản hồi</TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Danh sách sinh viên
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.map((student) => (
                  <div key={student.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">{student.name}</h3>
                          <p className="text-sm text-gray-600">{student.email}</p>
                          <p className="text-sm text-gray-600">{student.company} - {student.position}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(student.status)}
                            <Badge className={getStatusColor(student.status)}>
                              {student.status === 'active' ? 'Đang thực tập' :
                               student.status === 'completed' ? 'Hoàn thành' : 'Chờ xử lý'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Tiến độ: {student.progress}%
                          </p>
                          <p className="text-sm text-gray-600">
                            Báo cáo cuối: {student.lastReport ? new Date(student.lastReport).toLocaleDateString('vi-VN') : 'Chưa có'}
                          </p>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Chi tiết
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Thông tin chi tiết - {student.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Họ tên</label>
                                  <p className="text-gray-900">{student.name}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Email</label>
                                  <p className="text-gray-900">{student.email}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Công ty</label>
                                  <p className="text-gray-900">{student.company}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Vị trí</label>
                                  <p className="text-gray-900">{student.position}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Ngày bắt đầu</label>
                                  <p className="text-gray-900">
                                    {new Date(student.startDate).toLocaleDateString('vi-VN')}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Tiến độ</label>
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${student.progress}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm text-gray-600">{student.progress}%</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Meetings Tab */}
        <TabsContent value="meetings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Lịch họp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {meetings.map((meeting) => (
                  <div key={meeting.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{meeting.type}</h3>
                        <p className="text-sm text-gray-600">Sinh viên: {meeting.studentName}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(meeting.date).toLocaleDateString('vi-VN')} - {meeting.time}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          {meeting.status === 'scheduled' ? 'Đã lên lịch' : 'Hoàn thành'}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Tham gia
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Gửi phản hồi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn sinh viên
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={selectedStudent?.id || ''}
                    onChange={(e) => {
                      const student = students.find(s => s.id === parseInt(e.target.value));
                      setSelectedStudent(student);
                    }}
                  >
                    <option value="">Chọn sinh viên...</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} - {student.company}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung phản hồi
                  </label>
                  <Textarea
                    placeholder="Nhập phản hồi cho sinh viên..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={6}
                  />
                </div>
                <Button
                  onClick={handleSubmitFeedback}
                  disabled={!feedback.trim() || !selectedStudent}
                  className="w-full"
                >
                  Gửi phản hồi
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MentorDashboardPage;