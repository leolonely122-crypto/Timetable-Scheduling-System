import { useQuery } from '@tanstack/react-query';
import api from '../api';

const Departments = () => {
  const { data: departments, isLoading } = useQuery({ queryKey: ['departments'], queryFn: () => api.get('/departments') });

  if (isLoading) return <div>Loading departments...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-dark-900">Departments</h1>
          <p className="text-slate-500 mt-1">Manage academic departments</p>
        </div>
        <button className="btn-primary">Add Department</button>
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Code</th>
              <th className="p-4 font-semibold">Est. Year</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments?.data?.map((d) => (
              <tr key={d.dept_id} className="border-b border-slate-100 hover:bg-slate-50/50">
                <td className="p-4 font-medium text-dark-900">{d.dept_name}</td>
                <td className="p-4 text-slate-500">{d.dept_code}</td>
                <td className="p-4 text-slate-500">{d.established_year}</td>
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

export default Departments;
