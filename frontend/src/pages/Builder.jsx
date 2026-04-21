import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const Builder = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    section_id: '',
    subject_id: '',
    faculty_id: '',
    room_id: '',
    slot_id: '',
    day_of_week: 'MON',
    academic_year: '2025-26',
    semester: 4
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  const { data: sections } = useQuery({ queryKey: ['sections'], queryFn: () => api.get('/sections') });
  const { data: subjects } = useQuery({ queryKey: ['subjects'], queryFn: () => api.get('/courses/1/subjects?semester=4') }); // Hardcoded for demo
  const { data: faculty } = useQuery({ queryKey: ['faculty'], queryFn: () => api.get('/faculty') });
  const { data: rooms } = useQuery({ queryKey: ['rooms'], queryFn: () => api.get('/rooms') });
  const { data: timeslots } = useQuery({ queryKey: ['timeslots'], queryFn: () => api.get('/timeslots') });

  const mutation = useMutation({
    mutationFn: (newSchedule) => api.post('/schedule', newSchedule),
    onSuccess: () => {
      setMessage({ type: 'success', text: 'Schedule entry created successfully!' });
      queryClient.invalidateQueries({ queryKey: ['timetable'] });
      queryClient.invalidateQueries({ queryKey: ['conflicts'] });
      // Reset some fields but keep context
      setFormData(prev => ({ ...prev, slot_id: '', subject_id: '' }));
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    },
    onError: (error) => {
      setMessage({ type: 'error', text: error.message || 'Failed to create schedule. Conflict detected.' });
    }
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ type: '', text: '' }); // clear message on change
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      ...formData,
      section_id: parseInt(formData.section_id),
      subject_id: parseInt(formData.subject_id),
      faculty_id: parseInt(formData.faculty_id),
      room_id: parseInt(formData.room_id),
      slot_id: parseInt(formData.slot_id),
      semester: parseInt(formData.semester),
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark-900">Schedule Builder</h1>
        <p className="text-slate-500 mt-1">Add new entries to the timetable with real-time conflict detection.</p>
      </div>

      <div className="glass-panel p-8 shadow-xl">
        {message.text && (
          <div className={`p-4 rounded-lg mb-6 flex items-center space-x-3 ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
            {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Context group */}
            <div className="space-y-4 col-span-1 md:col-span-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h3 className="font-semibold text-slate-700">1. Context</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Academic Year</label>
                  <input type="text" name="academic_year" value={formData.academic_year} onChange={handleChange} className="input-field bg-white" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
                  <input type="number" name="semester" value={formData.semester} onChange={handleChange} className="input-field bg-white" required />
                </div>
              </div>
            </div>

            {/* Selection group */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-700">2. Entities</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Section</label>
                <select name="section_id" value={formData.section_id} onChange={handleChange} className="input-field" required>
                  <option value="">-- Select Section --</option>
                  {sections?.data?.map(s => <option key={s.section_id} value={s.section_id}>{s.section_name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <select name="subject_id" value={formData.subject_id} onChange={handleChange} className="input-field" required>
                  <option value="">-- Select Subject --</option>
                  {/* Using mock subject list for now, realistically fetched based on section's course */}
                  <option value="1">Database Management Systems</option>
                  <option value="2">Operating Systems</option>
                  <option value="4">DBMS Lab</option>
                  <option value="7">Web Technologies</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Faculty</label>
                <select name="faculty_id" value={formData.faculty_id} onChange={handleChange} className="input-field" required>
                  <option value="">-- Select Faculty --</option>
                  {faculty?.data?.map(f => <option key={f.faculty_id} value={f.faculty_id}>{f.faculty_name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Room</label>
                <select name="room_id" value={formData.room_id} onChange={handleChange} className="input-field" required>
                  <option value="">-- Select Room --</option>
                  {rooms?.data?.map(r => <option key={r.room_id} value={r.room_id}>{r.room_number} (Cap: {r.capacity})</option>)}
                </select>
              </div>
            </div>

            {/* Time group */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-700">3. Schedule Time</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Day of Week</label>
                <select name="day_of_week" value={formData.day_of_week} onChange={handleChange} className="input-field" required>
                  {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Time Slot</label>
                <select name="slot_id" value={formData.slot_id} onChange={handleChange} className="input-field" required>
                  <option value="">-- Select Slot --</option>
                  {timeslots?.data?.filter(t => !t.is_break).map(t => (
                    <option key={t.slot_id} value={t.slot_id}>{t.slot_name} ({t.start_time.substring(0,5)} - {t.end_time.substring(0,5)})</option>
                  ))}
                </select>
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={mutation.isPending}
                  className="w-full btn-primary h-12 text-lg shadow-lg"
                >
                  {mutation.isPending ? 'Saving...' : 'Book Slot'}
                </button>
              </div>
            </div>
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default Builder;
