import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { Users, BookOpen, DoorOpen, AlertTriangle } from 'lucide-react';

const StatCard = ({ title, value, icon, colorClass }) => (
  <div className="glass-panel p-6 flex items-center space-x-4">
    <div className={`p-4 rounded-xl ${colorClass}`}>
      {icon}
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-dark-900">{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  // Using some mock data structure for stats if API doesn't have a direct dashboard endpoint
  // Real app might aggregate this on backend
  const { data: faculty } = useQuery({ queryKey: ['faculty'], queryFn: () => api.get('/faculty') });
  const { data: rooms } = utilizationQuery();
  const { data: sections } = useQuery({ queryKey: ['sections'], queryFn: () => api.get('/sections') });
  const { data: conflicts } = useQuery({ queryKey: ['conflicts'], queryFn: () => api.get('/schedule/conflicts?year=2025-26&sem=4') });

  function utilizationQuery() {
    return useQuery({ queryKey: ['rooms'], queryFn: () => api.get('/rooms') });
  }

  const stats = [
    { title: 'Total Faculty', value: faculty?.data?.length || 0, icon: <Users size={24} className="text-blue-600" />, color: 'bg-blue-100' },
    { title: 'Active Rooms', value: rooms?.data?.length || 0, icon: <DoorOpen size={24} className="text-indigo-600" />, color: 'bg-indigo-100' },
    { title: 'Sections', value: sections?.data?.length || 0, icon: <BookOpen size={24} className="text-emerald-600" />, color: 'bg-emerald-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-dark-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of your institution's scheduling</p>
        </div>
      </div>

      {conflicts?.data?.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start space-x-3 shadow-sm">
          <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-red-800 font-medium">Scheduling Conflicts Detected</h3>
            <p className="text-red-600 text-sm mt-1">
              There are {conflicts.data.length} conflict(s) in the current schedule that require immediate attention.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} title={stat.title} value={stat.value} icon={stat.icon} colorClass={stat.color} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="glass-panel p-6">
          <h2 className="text-lg font-bold mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/builder" className="p-4 border border-slate-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all text-center font-medium text-slate-700">
              Create Schedule
            </a>
            <a href="/timetable" className="p-4 border border-slate-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all text-center font-medium text-slate-700">
              View Timetables
            </a>
            <a href="/faculty" className="p-4 border border-slate-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all text-center font-medium text-slate-700">
              Manage Faculty
            </a>
            <a href="/reports" className="p-4 border border-slate-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all text-center font-medium text-slate-700">
              View Reports
            </a>
          </div>
        </div>
        
        <div className="glass-panel p-6">
          <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
          <div className="text-center text-slate-500 py-10">
            Activity feed will be implemented here.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
