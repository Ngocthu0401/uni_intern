import { useState } from 'react';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ClockIcon,
  UserIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: MapPinIcon,
      title: 'Địa chỉ',
      details: [
        'Trường Đại học ABC',
        '123 Đường Giáo Dục, Quận 1',
        'TP. Hồ Chí Minh, Việt Nam'
      ]
    },
    {
      icon: PhoneIcon,
      title: 'Điện thoại',
      details: [
        '(028) 1234 5678',
        '(028) 8765 4321',
        'Hotline: 1900 1234'
      ]
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      details: [
        'info@uniintern.edu.vn',
        'support@uniintern.edu.vn',
        'admin@uniintern.edu.vn'
      ]
    },
    {
      icon: ClockIcon,
      title: 'Giờ làm việc',
      details: [
        'Thứ 2 - Thứ 6: 8:00 - 17:00',
        'Thứ 7: 8:00 - 12:00',
        'Chủ nhật: Nghỉ'
      ]
    }
  ];

  const departments = [
    {
      name: 'Phòng Đào tạo',
      email: 'daotao@uniintern.edu.vn',
      phone: '(028) 1234 5678'
    },
    {
      name: 'Phòng Hợp tác Doanh nghiệp',
      email: 'hoptac@uniintern.edu.vn',
      phone: '(028) 1234 5679'
    },
    {
      name: 'Phòng Hỗ trợ Sinh viên',
      email: 'hotro@uniintern.edu.vn',
      phone: '(028) 1234 5680'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white overflow-hidden">
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
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-white mr-2" />
                <span className="text-sm font-medium text-white">Hỗ trợ 24/7</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Liên hệ với
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  chúng tôi
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed text-blue-100">
                Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ với chúng tôi qua các kênh dưới đây.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300 shadow-xl">
                  Gửi tin nhắn
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-blue-600 transition-all duration-300">
                  Gọi ngay
                </button>
              </div>
            </div>
            
            {/* Right Image */}
            <div className="flex-1 relative">
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80" 
                  alt="Customer support" 
                  className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                />
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg z-20">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Đang online</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 rounded-xl shadow-lg z-20">
                <div className="text-2xl font-bold">&lt; 1h</div>
                <div className="text-sm">Phản hồi</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Gửi tin nhắn
              </h2>
              <p className="text-gray-600">
                Điền thông tin vào form bên dưới và chúng tôi sẽ phản hồi trong thời gian sớm nhất.
              </p>
            </div>

            {isSubmitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-green-800 font-medium">
                    Tin nhắn đã được gửi thành công! Chúng tôi sẽ phản hồi sớm nhất có thể.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Nhập email"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Chủ đề *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Nhập chủ đề"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Nhập nội dung tin nhắn..."
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang gửi...
                  </div>
                ) : (
                  'Gửi tin nhắn'
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Thông tin liên hệ
              </h2>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  const gradients = [
                    'from-blue-500 to-indigo-600',
                    'from-green-500 to-teal-600', 
                    'from-purple-500 to-pink-600',
                    'from-orange-500 to-red-600'
                  ];
                  return (
                    <div key={index} className="group flex items-start hover:bg-gray-50 p-4 rounded-xl transition-all duration-300">
                      <div className={`w-16 h-16 bg-gradient-to-r ${gradients[index]} rounded-2xl flex items-center justify-center mr-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                          {info.title}
                        </h3>
                        <div className="space-y-2">
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-gray-600 leading-relaxed">
                              {detail}
                            </p>
                          ))}
                        </div>
                        <div className="mt-3 flex items-center text-indigo-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-sm">Liên hệ ngay</span>
                          <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Departments */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Các phòng ban
              </h2>
              
              <div className="space-y-4">
                {departments.map((dept, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {dept.name}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center">
                        <EnvelopeIcon className="w-4 h-4 mr-2" />
                        {dept.email}
                      </p>
                      <p className="flex items-center">
                        <PhoneIcon className="w-4 h-4 mr-2" />
                        {dept.phone}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Vị trí
              </h2>
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPinIcon className="w-12 h-12 mx-auto mb-2" />
                  <p>Bản đồ sẽ được hiển thị tại đây</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;