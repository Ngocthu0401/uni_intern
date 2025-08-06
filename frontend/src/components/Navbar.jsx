import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  InformationCircleIcon,
  PhoneIcon,
  UserIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navigation = [
    { name: 'Trang chủ', href: '/', icon: HomeIcon },
    { name: 'Giới thiệu', href: '/about', icon: InformationCircleIcon },
    { name: 'Liên hệ', href: '/contact', icon: PhoneIcon },
  ];

  const getDashboardLink = (role) => {
    switch (role) {
      case 'DEPARTMENT':
      case 'ADMIN': 
        return '/admin';
      case 'STUDENT': 
        return '/student';
      case 'TEACHER': 
        return '/teacher';
      case 'MENTOR': 
        return '/mentor';
      default: 
        return '/';
    }
  };

  const getDashboardText = (role) => {
    switch (role) {
      case 'DEPARTMENT':
      case 'ADMIN': 
        return 'Quản trị';
      case 'STUDENT': 
        return 'Sinh viên';
      case 'TEACHER': 
        return 'Giảng viên';
      case 'MENTOR': 
        return 'Mentor';
      default: 
        return 'Dashboard';
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'DEPARTMENT':
        return 'Phòng đào tạo';
      case 'ADMIN': 
        return 'Quản trị viên';
      case 'STUDENT': 
        return 'Sinh viên';
      case 'TEACHER': 
        return 'Giảng viên';
      case 'MENTOR': 
        return 'Mentor';
      default: 
        return role;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'DEPARTMENT':
        return 'from-purple-500 to-purple-600';
      case 'ADMIN': 
        return 'from-red-500 to-red-600';
      case 'STUDENT': 
        return 'from-blue-500 to-blue-600';
      case 'TEACHER': 
        return 'from-green-500 to-green-600';
      case 'MENTOR': 
        return 'from-orange-500 to-orange-600';
      default: 
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo và Menu chính */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">UI</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                UniIntern
              </span>
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:ml-8 md:flex md:space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={getDashboardLink(user?.role)}
                  className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>{getDashboardText(user?.role)}</span>
                </Link>
                <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">
                      {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-800">{user?.fullName}</span>
                    <span className="text-xs text-gray-500">{getRoleDisplayName(user?.role)}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                  title="Đăng xuất"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Đăng xuất</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {isAuthenticated ? (
              <>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <Link
                    to={getDashboardLink(user?.role)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    <UserIcon className="h-5 w-5" />
                    <span>{getDashboardText(user?.role)}</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 font-medium"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;