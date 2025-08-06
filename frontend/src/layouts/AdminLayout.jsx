import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  UserGroupIcon, 
  AcademicCapIcon, 
  BuildingOfficeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  MagnifyingGlassIcon,
  UserIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Tạo initials từ tên user
  const getUserInitials = (fullName) => {
    if (!fullName) return 'AD';
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  // Lấy role display name
  const getRoleDisplayName = (role) => {
    if (!role) return 'Chưa xác định';
    
    // Xử lý role có thể là string hoặc object
    const roleValue = typeof role === 'object' ? role.name || role.authority : role;
    
    const roleMap = {
      'ADMIN': 'Quản trị viên',
      'TEACHER': 'Giảng viên', 
      'STUDENT': 'Sinh viên',
      'MENTOR': 'Mentor',
      'COMPANY': 'Doanh nghiệp',
      'ROLE_ADMIN': 'Quản trị viên',
      'ROLE_TEACHER': 'Giảng viên',
      'ROLE_STUDENT': 'Sinh viên',
      'ROLE_MENTOR': 'Mentor',
      'ROLE_COMPANY': 'Doanh nghiệp'
    };
    
    return roleMap[roleValue?.toUpperCase()] || `Phân quyền: ${roleValue}`;
  };

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: ChartBarIcon },
    { name: 'Quản lý Sinh viên', href: '/admin/students', icon: UserGroupIcon },
    { name: 'Quản lý Giảng viên', href: '/admin/teachers', icon: AcademicCapIcon },
    { name: 'Quản lý Doanh nghiệp', href: '/admin/companies', icon: BuildingOfficeIcon },
    { name: 'Quản lý Mentor', href: '/admin/mentors', icon: UserIcon },
    { name: 'Quản lý Đợt thực tập', href: '/admin/batches', icon: CalendarDaysIcon },
    { name: 'Quản lý Thực tập', href: '/admin/internships', icon: ClipboardDocumentListIcon },
    { name: 'Quản lý Hợp đồng', href: '/admin/contracts', icon: DocumentTextIcon },
  ];

  const isActiveRoute = (href) => {
    return location.pathname === href;
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-20 px-6 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <ChartBarIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Admin Panel</h1>
              <p className="text-blue-100 text-xs font-medium">Quản trị hệ thống</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700'
                  }`}
                >
                  <div className={`p-2 rounded-lg mr-4 transition-colors duration-200 ${
                    isActive 
                      ? 'bg-white/20' 
                      : 'bg-gray-100 group-hover:bg-blue-100'
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      isActive ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'
                    }`} />
                  </div>
                  <span className="text-sm">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
          <div className="flex items-center justify-between h-20 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-all duration-200"
              >
                <Bars3Icon className="h-5 w-5" />
              </button>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Quản trị hệ thống
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Chào mừng trở lại, {user?.fullName || 'Administrator'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-xl px-4 py-2.5 min-w-[300px]">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 flex-1"
                />
              </div>
              
              {/* Notifications */}
              <button className="relative p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-all duration-200">
                <BellIcon className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              {/* User Menu */}
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">
                  {user?.fullName || 'Administrator'}
                </p>
                <p className="text-xs text-gray-500">
                  {getRoleDisplayName(user?.role)}
                </p>
              </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;