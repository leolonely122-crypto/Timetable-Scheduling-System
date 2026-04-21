import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api';

const TimetableGrid = ({ schedules, type }) => {
  // A generic timetable grid component
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  const { data: timeslots } = useQuery({ 
    queryKey: ['timeslots'], 
    queryFn: () => api.get('/timeslots') 
  });

  if (!timeslots?.data) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading timetable skeleton...</div>;

  const slots = timeslots.data;

  // Helper to find schedule for a cell
  const getSchedule = (day, slotId) => {
    return schedules?.find(s => s.day_of_week === day && s.slot_id === slotId);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 font-semibold w-24 border-r border-slate-200">Time / Day</th>
            {days.map(day => (
              <th key={day} className="px-4 py-3 font-semibold text-center border-r border-slate-200 min-w-[150px]">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slots.map((slot) => (
            <tr key={slot.slot_id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
              <td className="px-4 py-3 border-r border-slate-200 bg-slate-50 whitespace-nowrap">
                <div className="font-medium text-dark-900">{slot.slot_name}</div>
                <div className="text-xs text-slate-500">{slot.start_time.substring(0,5)} - {slot.end_time.substring(0,5)}</div>
              </td>
              
              {slot.is_break ? (
                <td colSpan={6} className="px-4 py-2 bg-slate-100 text-center text-slate-500 font-medium tracking-widest uppercase text-xs">
                  {slot.slot_name}
                </td>
              ) : (
                days.map(day => {
                  const item = getSchedule(day, slot.slot_id);
                  return (
                    <td key={`${day}-${slot.slot_id}`} className="p-2 border-r border-slate-100 align-top h-24">
                      {item ? (
                        <div className="h-full bg-primary-50 border border-primary-200 rounded-lg p-2 text-xs flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer">
                          <div className="font-bold text-primary-700">{item.subject_code}</div>
                          <div className="text-slate-600 truncate">{type === 'section' ? item.faculty_name : item.section_name}</div>
                          <div className="text-slate-500 mt-1 flex items-center justify-between">
                            <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">{item.room_number}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-300 text-xs border border-dashed border-slate-200 rounded-lg">
                          Free
                        </div>
                      )}
                    </td>
                  );
                })
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimetableGrid;
