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

  const downloadAssetStatusReport = async () => {
    try {
      const response = await api.get(
        "/reports/export/assets/status",
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;
      link.setAttribute(
        "download",
        "asset_status_report.xlsx"
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

    } catch (error) {
      console.error(error);
    }
  };

  const downloadAssetCategoryReport = async () => {
    try {

      const response = await api.get(
        "/reports/export/assets/category",
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        "asset_category_report.xlsx"
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

    } catch (error) {
      console.error(error);
    }
  };

  const downloadEmployeeAssetReport = async () => {
    try {

      const response = await api.get(
        "/reports/export/employees/assets",
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        "employee_asset_report.xlsx"
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

    } catch (error) {
      console.error(error);
    }
  };

  const downloadAllAssetsReport = async () => {
    try {
      const response = await api.get(
        "/reports/export/assets/all",
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        "all_assets_report.xlsx"
      );

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <MainLayout>

      <div className="flex gap-3">

        <button
          onClick={downloadAssetStatusReport}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Export Asset Status
        </button>

        <button
          onClick={downloadAssetCategoryReport}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Export Category Report
        </button>

        <button
          onClick={downloadEmployeeAssetReport}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Export Employee Report
        </button>
        <button
          onClick={downloadAllAssetsReport}
          className="bg-green-700 text-white px-4 py-2 rounded"
        >
          Export All Assets
        </button>

      </div>

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