import { useQuery } from '@tanstack/react-query';
import api from '../api';
import TimetableGrid from '../components/TimetableGrid';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const StudentPortal = () => {
  const { user, logout } = useAuth();
  
  // Assuming reference_id maps to student_id, and we can fetch student details to get section_id
  const { data: student } = useQuery({ 
    queryKey: ['studentMe'], 
    queryFn: () => api.get('/auth/me') // In real app, you'd fetch student specific details
  });

  // Mocking section_id for demo (CSE-A is section 1)
  const sectionId = 1; 

  const { data: scheduleData, isLoading } = useQuery({
    queryKey: ['timetable', 'section', sectionId],
    queryFn: () => api.get(`/sections/${sectionId}/timetable?year=2025-26&sem=4`),
    enabled: !!sectionId
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-dark-900 text-white h-16 flex items-center justify-between px-8 shadow-md">
        <div className="font-bold text-xl tracking-wider">
          <span className="text-primary-400">Time</span>Sync <span className="text-slate-400 text-sm ml-2 font-normal">| Student Portal</span>
        </div>
        <div className="flex items-center space-x-6">
          <span className="text-sm font-medium">{user?.email}</span>
          <button onClick={logout} className="text-slate-400 hover:text-white flex items-center space-x-2 transition-colors">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6 relative z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none -z-10"></div>

        <div>
          <h1 className="text-3xl font-bold text-dark-900">My Timetable</h1>
          <p className="text-slate-500 mt-1">Class schedule for CSE-A (Semester 4)</p>
        </div>

        {isLoading ? (
          <div className="h-64 flex items-center justify-center text-slate-500">Loading timetable...</div>
        ) : scheduleData?.data ? (
          <TimetableGrid schedules={scheduleData.data} type="section" />
        ) : (
          <div className="h-64 flex items-center justify-center text-slate-500">No schedule available.</div>
        )}
      </main>
    </div>
  );
};

export default StudentPortal;
