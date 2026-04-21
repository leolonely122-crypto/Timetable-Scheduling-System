import { useQuery } from '@tanstack/react-query';
import api from '../api';

const Faculty = () => {
  const { data: faculty, isLoading } = useQuery({ queryKey: ['faculty'], queryFn: () => api.get('/faculty') });

  if (isLoading) return <div>Loading faculty...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-dark-900">Faculty Management</h1>
          <p className="text-slate-500 mt-1">Manage teaching staff and their details</p>
        </div>
        <button className="btn-primary">Add Faculty</button>
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Code</th>
              <th className="p-4 font-semibold">Designation</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Max Hours</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {faculty?.data?.map((f) => (
              <tr key={f.faculty_id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-medium text-dark-900">{f.faculty_name}</td>
                <td className="p-4 text-slate-500">{f.employee_code}</td>
                <td className="p-4 text-slate-500">{f.designation}</td>
                <td className="p-4 text-slate-500">{f.email}</td>
                <td className="p-4 text-slate-500">{f.max_hours_per_week} hrs</td>
                <td className="p-4 text-right">
                  <button className="text-primary-600 hover:text-primary-800 font-medium text-sm mr-3">Edit</button>
                  <button className="text-red-500 hover:text-red-700 font-medium text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Faculty;
