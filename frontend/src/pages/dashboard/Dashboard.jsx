import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import api from "../../api/axios";

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
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