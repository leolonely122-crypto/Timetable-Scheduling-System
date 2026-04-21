import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  PlusSquare, 
  Users, 
  DoorOpen, 
  Building2, 
  BookOpen, 
  BarChart3, 
  LogOut 
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Timetable', path: '/timetable', icon: <Calendar size={20} /> },
    ...(user?.role === 'admin' ? [{ name: 'Builder', path: '/builder', icon: <PlusSquare size={20} /> }] : []),
    { name: 'Faculty', path: '/faculty', icon: <Users size={20} /> },
    { name: 'Rooms', path: '/rooms', icon: <DoorOpen size={20} /> },
    { name: 'Departments', path: '/departments', icon: <Building2 size={20} /> },
    { name: 'Courses', path: '/courses', icon: <BookOpen size={20} /> },
    { name: 'Reports', path: '/reports', icon: <BarChart3 size={20} /> },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-900 text-white flex flex-col shadow-2xl z-10">
        <div className="h-16 flex items-center justify-center border-b border-white/10 font-bold text-xl tracking-wider">
          <span className="text-primary-400">Time</span>Sync
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center space-x-3 px-4 py-3 bg-white/5 rounded-xl mb-4">
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center font-bold">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.email}</p>
              <p className="text-xs text-primary-400 capitalize">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex w-full items-center justify-center space-x-2 px-4 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Dynamic Background subtle elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="flex-1 overflow-auto p-8 z-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
