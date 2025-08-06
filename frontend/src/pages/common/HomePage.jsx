import React from 'react';
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  BuildingOfficeIcon,
  ChartBarIcon,
  StarIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-4 py-2 mb-6">
                <StarIcon className="w-5 h-5 text-yellow-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Hệ thống quản lý thực tập hàng đầu</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 mb-6 leading-tight">
                UniIntern
                <br />
                <span className="text-4xl md:text-5xl">Management</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Giải pháp toàn diện cho việc quản lý và theo dõi quá trình thực tập của sinh viên. 
                Kết nối sinh viên, giảng viên và doanh nghiệp một cách hiệu quả.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-full text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                  Bắt đầu ngay
                </button>
                <button className="flex items-center justify-center border-2 border-gray-300 text-gray-700 font-semibold px-8 py-4 rounded-full text-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300">
                  <PlayIcon className="w-5 h-5 mr-2" />
                  Xem demo
                </button>
              </div>
              
              {/* Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600">1000+</div>
                  <div className="text-sm text-gray-600">Sinh viên</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">50+</div>
                  <div className="text-sm text-gray-600">Doanh nghiệp</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-600">100+</div>
                  <div className="text-sm text-gray-600">Giảng viên</div>
                </div>
              </div>
            </div>
            
            {/* Right Image */}
            <div className="flex-1 relative">
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80" 
                  alt="Students collaborating" 
                  className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                />
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-lg z-20">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">1,234 sinh viên online</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-xl shadow-lg z-20">
                <div className="text-2xl font-bold">95%</div>
                <div className="text-sm">Tỷ lệ hài lòng</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Tính năng nổi bật
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Khám phá những tính năng mạnh mẽ giúp quản lý thực tập hiệu quả
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="group bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <AcademicCapIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Dành cho Sinh viên</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Tìm kiếm cơ hội thực tập, nộp báo cáo, theo dõi tiến độ và nhận đánh giá từ giảng viên và doanh nghiệp.
              </p>
              <div className="flex items-center text-blue-600 font-semibold">
                <span>Tìm hiểu thêm</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            
            <div className="group bg-gradient-to-br from-purple-50 to-pink-100 p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <UserGroupIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Dành cho Giảng viên</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Quản lý nhóm sinh viên, theo dõi quá trình thực tập, đánh giá báo cáo và kết quả của sinh viên.
              </p>
              <div className="flex items-center text-purple-600 font-semibold">
                <span>Tìm hiểu thêm</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            
            <div className="group bg-gradient-to-br from-cyan-50 to-teal-100 p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-r from-cyan-500 to-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BuildingOfficeIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Dành cho Bộ môn</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Quản lý tổng thể các đợt thực tập, phân công giảng viên, theo dõi và thống kê kết quả thực tập toàn khoa.
              </p>
              <div className="flex items-center text-cyan-600 font-semibold">
                <span>Tìm hiểu thêm</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Sẵn sàng bắt đầu hành trình thực tập?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Tham gia cùng hàng nghìn sinh viên đã tin tưởng và sử dụng UniIntern Management
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 font-bold px-8 py-4 rounded-full text-lg hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300 shadow-xl">
                Đăng ký miễn phí
              </button>
              <button className="border-2 border-white text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-white hover:text-blue-600 transition-all duration-300">
                Liên hệ tư vấn
              </button>
            </div>
            
            {/* Testimonial */}
            <div className="mt-16 bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80" 
                  alt="Student testimonial" 
                  className="w-16 h-16 rounded-full object-cover border-4 border-white/30"
                />
              </div>
              <p className="text-white/90 text-lg italic mb-4">
                "UniIntern đã giúp tôi tìm được vị trí thực tập mơ ước và theo dõi tiến độ một cách dễ dàng. Giao diện thân thiện và tính năng đầy đủ!"
              </p>
              <div className="text-white/80">
                <div className="font-semibold">Nguyễn Văn A</div>
                <div className="text-sm">Sinh viên CNTT - ĐH ABC</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;