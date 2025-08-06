import { Link } from 'react-router-dom';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative max-w-4xl w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* 404 Number */}
            <div className="mb-8">
              <h1 className="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-4 leading-none">
                404
              </h1>
              <div className="w-32 h-2 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto lg:mx-0 rounded-full"></div>
            </div>

            {/* Error Message */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Oops! Trang không tồn tại
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. Hãy thử các liên kết bên dưới.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Link
                to="/"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <HomeIcon className="w-5 h-5 mr-2" />
                Về trang chủ
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-full hover:border-indigo-500 hover:text-indigo-600 transition-all duration-300"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Quay lại trang trước
              </button>
            </div>

            {/* Additional Help */}
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center justify-center lg:justify-start">
                <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Cần hỗ trợ?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ với quản trị viên hệ thống qua email: support@uniintern.edu.vn
              </p>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="flex-1 relative">
            <div className="relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1584824486509-112e4181ff6b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Page not found illustration" 
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
            </div>
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg z-20">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Trang không tìm thấy</span>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-xl shadow-lg z-20">
              <div className="text-2xl font-bold">404</div>
              <div className="text-sm">Error</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;