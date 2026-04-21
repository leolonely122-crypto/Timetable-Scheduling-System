import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Reports = () => {
  const { data: facultyWorkload } = useQuery({ 
    queryKey: ['report-workload'], 
    queryFn: () => api.get('/reports/faculty-workload?year=2025-26&sem=4') 
  });
  
  const { data: roomUtilization } = useQuery({ 
    queryKey: ['report-utilization'], 
    queryFn: () => api.get('/reports/room-utilization?year=2025-26&sem=4') 
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark-900">Reports & Analytics</h1>
        <p className="text-slate-500 mt-1">Data-driven insights for scheduling efficiency</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faculty Workload Chart */}
        <div className="glass-panel p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Faculty Workload (Hours/Week)</h2>
            <button className="text-sm text-primary-600 hover:text-primary-800 font-medium">Export CSV</button>
          </div>
          <div className="h-80">
            {facultyWorkload?.data ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={facultyWorkload.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="faculty_name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                  <Bar dataKey="scheduled_hours" name="Scheduled" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="max_hours_per_week" name="Maximum Allowed" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">Loading chart...</div>
            )}
          </div>
        </div>

        {/* Room Utilization Chart */}
        <div className="glass-panel p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Room Utilization (%)</h2>
            <button className="text-sm text-primary-600 hover:text-primary-800 font-medium">Export CSV</button>
          </div>
          <div className="h-80">
            {roomUtilization?.data ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roomUtilization.data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis dataKey="room_number" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} width={60} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="utilization_percentage" name="Utilization %" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">Loading chart...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
