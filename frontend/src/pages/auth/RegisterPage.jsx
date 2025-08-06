import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EnvelopeIcon, LockClosedIcon, UserPlusIcon } from '@heroicons/react/24/solid'; // Ví dụ sử dụng Heroicons

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Mật khẩu không khớp!"); // Cân nhắc sử dụng một thông báo tinh tế hơn
      return;
    }
    // Xử lý logic đăng ký ở đây
    console.log('Đăng ký với:', { email, password });
    // Ví dụ: Sau khi đăng ký thành công, chuyển hướng đến trang đăng nhập
    // navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 via-orange-50 to-red-100 p-4">
      <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-500 hover:scale-105">
        <div className="text-center mb-10">
          <Link to="/">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 inline-block">
              Tạo Tài Khoản UniIntern
            </h1>
          </Link>
          <p className="text-slate-600 mt-2">Tham gia cộng đồng UniIntern ngay hôm nay!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1 sr-only">
              Email
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <EnvelopeIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm placeholder-slate-400 transition-colors duration-300"
              placeholder="Địa chỉ email của bạn"
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1 sr-only">
              Mật khẩu
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockClosedIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm placeholder-slate-400 transition-colors duration-300"
              placeholder="Tạo mật khẩu (ít nhất 8 ký tự)"
            />
          </div>
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-1 sr-only">
              Xác nhận mật khẩu
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockClosedIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </div>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm placeholder-slate-400 transition-colors duration-300"
              placeholder="Xác nhận lại mật khẩu"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <UserPlusIcon className="h-5 w-5 mr-2" />
              Đăng Ký Ngay
            </button>
          </div>
        </form>
        <p className="mt-8 text-center text-sm text-slate-600">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-semibold text-amber-600 hover:text-amber-500 hover:underline transition-colors duration-300">
            Đăng nhập tại đây
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;