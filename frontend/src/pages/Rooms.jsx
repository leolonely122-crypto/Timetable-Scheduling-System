import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { DoorOpen } from 'lucide-react';

const Rooms = () => {
  const { data: rooms, isLoading } = useQuery({ queryKey: ['rooms'], queryFn: () => api.get('/rooms') });

  if (isLoading) return <div>Loading rooms...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-dark-900">Room Management</h1>
          <p className="text-slate-500 mt-1">Manage classrooms, labs, and halls</p>
        </div>
        <button className="btn-primary">Add Room</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {rooms?.data?.map((r) => (
          <div key={r.room_id} className="glass-panel p-5 hover:shadow-lg transition-shadow cursor-pointer border border-transparent hover:border-primary-200 group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <DoorOpen size={24} />
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded uppercase tracking-wider">
                {r.room_type}
              </span>
            </div>
            <h3 className="text-xl font-bold text-dark-900 mb-1">{r.room_number}</h3>
            <p className="text-slate-500 text-sm mb-4">Capacity: {r.capacity} students</p>
            
            <div className="flex space-x-2">
              {r.has_projector && <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded border border-primary-100">Projector</span>}
              {r.has_AC && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">AC</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
