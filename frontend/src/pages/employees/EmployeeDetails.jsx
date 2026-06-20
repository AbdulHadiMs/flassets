import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";
import StatusBadge from "../../components/common/StatusBadge";
import api from "../../api/axios";

function EmployeeDetails() {
  const { id } = useParams();

  const [employee, setEmployee] = useState(null);
  const [allocations, setAllocations] = useState([]);

  useEffect(() => {
    fetchEmployee();
    fetchAllocations();
  }, []);

  const fetchEmployee = async () => {
    const response = await api.get(`/employees/${id}`);
    setEmployee(response.data.data);
  };

  const fetchAllocations = async () => {
    const response = await api.get(
      `/employees/${id}/allocations`
    );
    setAllocations(response.data.data);
  };

  if (!employee) {
    return (
      <MainLayout>
        <p>Loading employee details...</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">
        Employee Details
      </h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Detail label="Employee Code" value={employee.employee_code} />
          <Detail label="Full Name" value={employee.full_name} />
          <Detail label="Email" value={employee.email || "-"} />
          <Detail label="Phone" value={employee.phone || "-"} />
          <Detail label="Department" value={employee.department || "-"} />
          <Detail label="Designation" value={employee.designation || "-"} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Allocated Assets
        </h2>

        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Asset Code</th>
              <th className="text-left p-3">Asset Name</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Allocation Date</th>
              <th className="text-left p-3">Actual Return</th>
            </tr>
          </thead>

          <tbody>
            {allocations.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-5 text-gray-500"
                >
                  No allocated assets found
                </td>
              </tr>
            ) : (
              allocations.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-3">{item.asset_code}</td>
                  <td className="p-3">{item.asset_name}</td>
                  <td className="p-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="p-3">{item.allocation_date || "-"}</td>
                  <td className="p-3">{item.actual_return_date || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

export default EmployeeDetails;