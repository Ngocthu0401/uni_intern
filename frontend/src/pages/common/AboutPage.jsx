import { 
  AcademicCapIcon, 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const AboutPage = () => {
  const features = [
    {
      icon: AcademicCapIcon,
      title: 'Quản lý sinh viên',
      description: 'Theo dõi thông tin, tiến độ và kết quả thực tập của sinh viên một cách toàn diện.'
    },
    {
      icon: BuildingOfficeIcon,
      title: 'Kết nối doanh nghiệp',
      description: 'Tạo cầu nối giữa nhà trường và các doanh nghiệp để tạo cơ hội thực tập tốt nhất.'
    },
    {
      icon: UserGroupIcon,
      title: 'Hỗ trợ đa vai trò',
      description: 'Phục vụ nhu cầu của sinh viên, giảng viên, cán bộ hướng dẫn và quản trị viên.'
    },
    {
      icon: ChartBarIcon,
      title: 'Báo cáo chi tiết',
      description: 'Cung cấp báo cáo và thống kê chi tiết về quá trình thực tập và kết quả đạt được.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Bảo mật cao',
      description: 'Đảm bảo an toàn thông tin với các biện pháp bảo mật hiện đại và đáng tin cậy.'
    },
    {
      icon: ClockIcon,
      title: 'Theo dõi thời gian thực',
      description: 'Cập nhật và theo dõi tiến độ thực tập của sinh viên theo thời gian thực.'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Sinh viên' },
    { number: '50+', label: 'Doanh nghiệp' },
    { number: '100+', label: 'Giảng viên' },
    { number: '95%', label: 'Hài lòng' }
  ];

  const team = [
    {
      name: 'Nhóm phát triển ABC',
      role: 'Đội ngũ phát triển',
      description: 'Đội ngũ sinh viên tài năng với niềm đam mê công nghệ và giáo dục.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="text-sm font-medium text-white">🚀 Hệ thống quản lý thực tập hàng đầu</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Về UniIntern
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  Management
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed text-indigo-100">
                Hệ thống quản lý thực tập hiện đại, kết nối sinh viên với cơ hội nghề nghiệp tương lai
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="bg-white text-indigo-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300 shadow-xl">
                  Tìm hiểu thêm
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-indigo-600 transition-all duration-300">
                  Liên hệ
                </button>
              </div>
            </div>
            
            {/* Right Image */}
            <div className="flex-1 relative">
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Team collaboration" 
                  className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                />
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg z-20">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Đang hoạt động</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-xl shadow-lg z-20">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm">Hỗ trợ</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Sứ mệnh của chúng tôi
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            UniIntern Management được tạo ra với mục tiêu cải thiện chất lượng quản lý thực tập, 
            tạo cầu nối hiệu quả giữa nhà trường và doanh nghiệp, đồng thời mang lại trải nghiệm 
            tốt nhất cho sinh viên trong quá trình thực tập.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Tính năng nổi bật
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hệ thống được thiết kế với các tính năng hiện đại, đáp ứng mọi nhu cầu quản lý thực tập
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const gradients = [
                'from-blue-500 to-indigo-600',
                'from-purple-500 to-pink-600', 
                'from-green-500 to-teal-600',
                'from-orange-500 to-red-600',
                'from-cyan-500 to-blue-600',
                'from-indigo-500 to-purple-600'
              ];
              return (
                <div key={index} className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  <div className={`flex items-center justify-center w-16 h-16 bg-gradient-to-r ${gradients[index]} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-indigo-600 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  <div className="mt-4 flex items-center text-indigo-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm">Tìm hiểu thêm</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Công nghệ sử dụng
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
            Được xây dựng trên nền tảng công nghệ hiện đại, đảm bảo hiệu suất và độ tin cậy cao
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="text-2xl font-bold text-blue-600 mb-2">React</div>
            <div className="text-gray-600">Frontend Framework</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="text-2xl font-bold text-green-600 mb-2">Spring Boot</div>
            <div className="text-gray-600">Backend Framework</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="text-2xl font-bold text-blue-800 mb-2">MySQL</div>
            <div className="text-gray-600">Database</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="text-2xl font-bold text-orange-600 mb-2">Firebase</div>
            <div className="text-gray-600">Cloud Storage</div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Đội ngũ phát triển
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Được phát triển bởi đội ngũ sinh viên tài năng với niềm đam mê công nghệ
            </p>
          </div>

          {/* Team Image */}
          <div className="mb-12">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
              alt="Development team" 
              className="rounded-2xl shadow-2xl w-full max-w-4xl mx-auto h-64 object-cover"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="group bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="relative mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80" 
                    alt="Team member" 
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors duration-300">{member.name}</h3>
                <p className="text-indigo-600 font-semibold mb-4">{member.role}</p>
                <p className="text-gray-600 leading-relaxed">{member.description}</p>
                
                {/* Social Links */}
                <div className="flex justify-center gap-3 mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-200 cursor-pointer">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-900 transition-colors duration-200 cursor-pointer">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-200 cursor-pointer">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Sẵn sàng bắt đầu?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Tham gia cùng chúng tôi để trải nghiệm hệ thống quản lý thực tập hiện đại nhất
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Đăng ký ngay
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors duration-200">
              Tìm hiểu thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;