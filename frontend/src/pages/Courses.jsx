import { useQuery } from '@tanstack/react-query';
import api from '../api';

const Courses = () => {
  const { data: courses, isLoading } = useQuery({ queryKey: ['courses'], queryFn: () => api.get('/courses') });

  if (isLoading) return <div>Loading courses...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-dark-900">Courses</h1>
          <p className="text-slate-500 mt-1">Manage courses and subjects</p>
        </div>
        <button className="btn-primary">Add Course</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.data?.map((c) => (
          <div key={c.course_id} className="glass-panel p-5">
            <h3 className="text-xl font-bold text-dark-900 mb-1">{c.course_name}</h3>
            <p className="text-slate-500 font-medium mb-4">{c.course_code}</p>
            <div className="space-y-2 text-sm text-slate-600 mb-4">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span>Duration:</span>
                <span className="font-medium text-dark-900">{c.duration_years} Years</span>
              </div>
              <div className="flex justify-between">
                <span>Total Semesters:</span>
                <span className="font-medium text-dark-900">{c.total_semesters}</span>
              </div>
            </div>
            <button className="w-full btn-secondary">View Subjects</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
