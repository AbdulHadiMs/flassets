import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import api from "../../api/axios";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentAssets, setRecentAssets] =
    useState([]);

  const [recentAllocations,
    setRecentAllocations
  ] = useState([]);

  useEffect(() => {
    fetchDashboardStats();
    fetchRecentAssets();
    fetchRecentAllocations();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get(
        "/dashboard/stats"
      );

      setStats(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRecentAssets = async () => {
    try {
      const response = await api.get(
        "/dashboard/recent-assets"
      );

      setRecentAssets(
        response.data.data
      );
    } catch (error) {
      console.error(error);
    }
  };


  const fetchRecentAllocations =
    async () => {
      try {
        const response =
          await api.get(
            "/dashboard/recent-allocations"
          );

        setRecentAllocations(
          response.data.data
        );
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <MainLayout>
      <div>

        <h1 className="text-3xl font-bold mb-6">
          Dashboard
        </h1>

        {!stats ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

            <StatCard
              title="Total Assets"
              value={stats.total_assets}
            />

            <StatCard
              title="Available Assets"
              value={stats.available_assets}
            />

            <StatCard
              title="Allocated Assets"
              value={stats.allocated_assets}
            />

            <StatCard
              title="Active Allocations"
              value={stats.active_allocations}
            />

            <StatCard
              title="Employees"
              value={stats.total_employees}
            />

            <StatCard
              title="Categories"
              value={stats.total_categories}
            />

            <StatCard
              title="Vendors"
              value={stats.total_vendors}
            />

            <StatCard
              title="Locations"
              value={stats.total_locations}
            />

          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

          {/* Recent Assets */}
          <div className="bg-white rounded-lg shadow p-5">

            <h2 className="text-xl font-semibold mb-4">
              Recent Assets
            </h2>

            <table className="w-full">

              <thead>
                <tr>
                  <th className="text-left">
                    Code
                  </th>

                  <th className="text-left">
                    Name
                  </th>

                  <th className="text-left">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentAssets.map(
                  (asset) => (
                    <tr key={asset.id}>
                      <td>
                        {asset.asset_code}
                      </td>

                      <td>
                        {asset.asset_name}
                      </td>

                      <td>
                        {asset.status}
                      </td>
                    </tr>
                  )
                )}
              </tbody>

            </table>

          </div>

          {/* Recent Allocations */}
          <div className="bg-white rounded-lg shadow p-5">

            <h2 className="text-xl font-semibold mb-4">
              Recent Allocations
            </h2>

            <table className="w-full">

              <thead>
                <tr>
                  <th className="text-left">
                    Asset
                  </th>

                  <th className="text-left">
                    Employee
                  </th>

                  <th className="text-left">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>

                {recentAllocations.map(
                  (allocation) => (
                    <tr key={allocation.id}>

                      <td>
                        {allocation.asset_code}
                      </td>

                      <td>
                        {allocation.employee_name}
                      </td>

                      <td>
                        {allocation.status}
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

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-lg shadow p-5">

      <h3 className="text-gray-500 text-sm">
        {title}
      </h3>

      <p className="text-3xl font-bold mt-2">
        {value}
      </p>

    </div>
  );
}

export default Dashboard;