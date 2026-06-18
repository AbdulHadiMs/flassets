import { useEffect, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";
import api from "../../api/axios";

function Reports() {

  const [statusReport, setStatusReport] = useState([]);
  const [categoryReport, setCategoryReport] = useState([]);
  const [employeeReport, setEmployeeReport] = useState([]);
  const [allocationReport, setAllocationReport] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {

      const statusResponse =
        await api.get(
          "/reports/assets/status"
        );

      const categoryResponse =
        await api.get(
          "/reports/assets/category"
        );

      const employeeResponse =
        await api.get(
          "/reports/employees/assets"
        );

      const allocationResponse =
        await api.get(
          "/reports/allocations"
        );
        

      setStatusReport(
        statusResponse.data.data
      );

      setCategoryReport(
        categoryResponse.data.data
      );

      setEmployeeReport(
        employeeResponse.data.data
      );

      setAllocationReport(
        allocationResponse.data.data
      );

    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <MainLayout>

      <h1 className="text-3xl font-bold mb-6">
        Reports
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Status Report */}

        <div className="bg-white rounded-lg shadow p-6">

          <h2 className="text-xl font-semibold mb-4">
            Asset Status Report
          </h2>

          <table className="w-full">

            <thead>
              <tr className="border-b">
                <th className="text-left p-2">
                  Status
                </th>

                <th className="text-left p-2">
                  Count
                </th>
              </tr>
            </thead>

            <tbody>

              {statusReport.map(
                (item) => (
                  <tr
                    key={item.status}
                    className="border-b"
                  >
                    <td className="p-2">
                      {item.status}
                    </td>

                    <td className="p-2">
                      {item.count}
                    </td>
                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

        {/* Category Report */}

        <div className="bg-white rounded-lg shadow p-6">

          <h2 className="text-xl font-semibold mb-4">
            Asset Category Report
          </h2>

          <table className="w-full">

            <thead>
              <tr className="border-b">
                <th className="text-left p-2">
                  Category
                </th>

                <th className="text-left p-2">
                  Count
                </th>
              </tr>
            </thead>

            <tbody>

              {categoryReport.map(
                (item) => (
                  <tr
                    key={item.category}
                    className="border-b"
                  >
                    <td className="p-2">
                      {item.category}
                    </td>

                    <td className="p-2">
                      {item.count}
                    </td>
                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

        {/* Employee Report */}
        <div className="bg-white rounded-lg shadow p-6">

          <h2 className="text-xl font-semibold mb-4">
            Employee Asset Report
          </h2>

          <table className="w-full">

            <thead>
              <tr className="border-b">

                <th className="text-left p-2">
                  Employee Code
                </th>

                <th className="text-left p-2">
                  Employee Name
                </th>

                <th className="text-left p-2">
                  Asset Count
                </th>

              </tr>
            </thead>

            <tbody>

              {employeeReport.map(
                (item) => (
                  <tr
                    key={item.employee_code}
                    className="border-b"
                  >
                    <td className="p-2">
                      {item.employee_code}
                    </td>

                    <td className="p-2">
                      {item.employee}
                    </td>

                    <td className="p-2">
                      {item.asset_count}
                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

        {/* Allocation History Card */}
        <div className="bg-white rounded-lg shadow p-6">

          <h2 className="text-xl font-semibold mb-4">
            Allocation History Report
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="border-b">

                  <th className="text-left p-2">
                    Asset Code
                  </th>

                  <th className="text-left p-2">
                    Asset Name
                  </th>

                  <th className="text-left p-2">
                    Employee
                  </th>

                  <th className="text-left p-2">
                    Status
                  </th>

                  <th className="text-left p-2">
                    Allocation Date
                  </th>

                  <th className="text-left p-2">
                    Return Date
                  </th>

                </tr>
              </thead>

              <tbody>

                {allocationReport.map(
                  (item) => (
                    <tr
                      key={item.id}
                      className="border-b"
                    >
                      <td className="p-2">
                        {item.asset_code}
                      </td>

                      <td className="p-2">
                        {item.asset_name}
                      </td>

                      <td className="p-2">
                        {item.employee_name}
                      </td>

                      <td className="p-2">
                        {item.status}
                      </td>

                      <td className="p-2">
                        {item.allocation_date}
                      </td>

                      <td className="p-2">
                        {item.actual_return_date || "-"}
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </MainLayout>
  );
}

export default Reports;