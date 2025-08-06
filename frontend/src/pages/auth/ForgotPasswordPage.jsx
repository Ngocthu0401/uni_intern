import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import { authService } from '../../services';
import { ForgotPasswordRequest } from '../../models';

const ForgotPasswordPage = () => {
  const [formData, setFormData] = useState(new ForgotPasswordRequest());
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});

    try {
      await authService.forgotPassword(formData.email);
      setSuccess(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      setErrors({ 
        general: error.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-slate-50 to-cyan-100 p-4">
        <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-lg text-center">
          <div className="mb-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Email đã được gửi!
            </h1>
            <p className="text-slate-600">
              Chúng tôi đã gửi link đặt lại mật khẩu đến email:
            </p>
            <p className="text-sky-600 font-semibold mt-1">
              {formData.email}
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-slate-500">
              Vui lòng kiểm tra hộp thư của bạn và làm theo hướng dẫn để đặt lại mật khẩu.
              Link sẽ hết hạn sau 15 phút.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/login"
                className="flex-1 flex justify-center items-center py-3 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-300"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Quay lại đăng nhập
              </Link>
              <button
                onClick={() => {
                  setSuccess(false);
                  setFormData(new ForgotPasswordRequest());
                }}
                className="flex-1 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-300"
              >
                Gửi lại email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-slate-50 to-cyan-100 p-4">
      <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-500 inline-block">
              UniIntern
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 mt-4 mb-2">
            Quên mật khẩu?
          </h2>
          <p className="text-slate-600">
            Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu
          </p>
        </div>
        
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">
              Email
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              <EnvelopeIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm placeholder-slate-400 transition-colors duration-300 ${
                errors.email ? 'border-red-300 bg-red-50' : 'border-slate-300'
              }`}
              placeholder="your.email@example.com"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang gửi...
                </span>
              ) : (
                'Gửi link đặt lại mật khẩu'
              )}
            </button>
            
            <Link
              to="/login"
              className="w-full flex justify-center items-center py-3 px-4 border border-slate-300 rounded-lg shadow-sm text-base font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-300"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Quay lại đăng nhập
            </Link>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-center text-sm text-slate-600">
            Chưa có tài khoản?{' '}
            <Link 
              to="/register" 
              className="font-semibold text-sky-600 hover:text-sky-500 hover:underline transition-colors duration-300"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;