import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import TimetableGrid from '../components/TimetableGrid';

const Timetable = () => {
  const [viewType, setViewType] = useState('section'); // section, faculty, room
  const [selectedId, setSelectedId] = useState('');
  
  // Year and Sem hardcoded for demo, normally would be from state/context
  const year = '2025-26';
  const sem = 4;

  const { data: sections } = useQuery({ queryKey: ['sections'], queryFn: () => api.get('/sections') });
  const { data: faculty } = useQuery({ queryKey: ['faculty'], queryFn: () => api.get('/faculty') });
  const { data: rooms } = useQuery({ queryKey: ['rooms'], queryFn: () => api.get('/rooms') });

  const { data: scheduleData, isLoading } = useQuery({
    queryKey: ['timetable', viewType, selectedId],
    queryFn: () => {
      if (!selectedId) return null;
      let endpoint = '';
      if (viewType === 'section') endpoint = `/sections/${selectedId}/timetable`;
      if (viewType === 'faculty') endpoint = `/faculty/${selectedId}/timetable`;
      if (viewType === 'room') endpoint = `/rooms/${selectedId}/timetable`;
      return api.get(`${endpoint}?year=${year}&sem=${sem}`);
    },
    enabled: !!selectedId
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-dark-900">Timetable Viewer</h1>
        <p className="text-slate-500 mt-1">View schedules by Section, Faculty, or Room</p>
      </div>

      <div className="glass-panel p-4 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">View Type</label>
          <select 
            className="input-field min-w-[200px]"
            value={viewType}
            onChange={(e) => { setViewType(e.target.value); setSelectedId(''); }}
          >
            <option value="section">Section Timetable</option>
            <option value="faculty">Faculty Timetable</option>
            <option value="room">Room Timetable</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Select {viewType.charAt(0).toUpperCase() + viewType.slice(1)}</label>
          <select 
            className="input-field min-w-[250px]"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">-- Select --</option>
            {viewType === 'section' && sections?.data?.map(s => <option key={s.section_id} value={s.section_id}>{s.section_name}</option>)}
            {viewType === 'faculty' && faculty?.data?.map(f => <option key={f.faculty_id} value={f.faculty_id}>{f.faculty_name} ({f.employee_code})</option>)}
            {viewType === 'room' && rooms?.data?.map(r => <option key={r.room_id} value={r.room_id}>{r.room_number}</option>)}
          </select>
        </div>
      </div>

      {selectedId ? (
        isLoading ? (
          <div className="h-64 flex items-center justify-center text-slate-500">Loading timetable...</div>
        ) : scheduleData?.data ? (
          <TimetableGrid schedules={scheduleData.data} type={viewType} />
        ) : (
          <div className="h-64 flex items-center justify-center text-slate-500">No schedule found.</div>
        )
      ) : (
        <div className="h-64 glass-panel flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-300">
          <Calendar size={48} className="mb-4 opacity-50" />
          <p>Select a {viewType} to view their timetable.</p>
        </div>
      )}
    </div>
  );
};

// Lucide icon import for placeholder
import { Calendar } from 'lucide-react';

export default Timetable;
