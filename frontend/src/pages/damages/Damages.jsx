import { useEffect, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";
import api from "../../api/axios";

function Damages() {
  const [damages, setDamages] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchDamages();
  }, []);

  const fetchDamages = async () => {
    try {
      const response = await api.get(
        "/damages"
      );

      setDamages(
        response.data.data
      );
    } catch (error) {
      console.error(error);
    }
  };

  const filteredDamages =
    damages.filter((damage) => {
      if (filter === "All")
        return true;

      return (
        damage.status === filter
      );
    });

  return (
    <MainLayout>

      <h1 className="text-3xl font-bold mb-6">
        Damage Management
      </h1>

      <div className="flex gap-3 mb-6">

        <button
          onClick={() =>
            setFilter("All")
          }
          className={`px-4 py-2 rounded ${
            filter === "All"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          All
        </button>

        <button
          onClick={() =>
            setFilter("Open")
          }
          className={`px-4 py-2 rounded ${
            filter === "Open"
              ? "bg-red-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Open
        </button>

        <button
          onClick={() =>
            setFilter("Repaired")
          }
          className={`px-4 py-2 rounded ${
            filter === "Repaired"
              ? "bg-green-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Repaired
        </button>

      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">
                Asset Code
              </th>

              <th className="text-left p-3">
                Asset Name
              </th>

              <th className="text-left p-3">
                Employee
              </th>

              <th className="text-left p-3">
                Damage Date
              </th>

              <th className="text-left p-3">
                Description
              </th>

              <th className="text-left p-3">
                Repair Cost
              </th>

              <th className="text-left p-3">
                Status
              </th>
            </tr>
          </thead>

          <tbody>

            {filteredDamages.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center p-5"
                >
                  No records found
                </td>
              </tr>
            ) : (
              filteredDamages.map(
                (damage) => (
                  <tr
                    key={damage.id}
                    className="border-t"
                  >
                    <td className="p-3">
                      {damage.asset_code}
                    </td>

                    <td className="p-3">
                      {damage.asset_name}
                    </td>

                    <td className="p-3">
                      {damage.employee_name ||
                        "-"}
                    </td>

                    <td className="p-3">
                      {damage.damage_date}
                    </td>

                    <td className="p-3">
                      {
                        damage.damage_description
                      }
                    </td>

                    <td className="p-3">
                      ₹
                      {damage.repair_cost ||
                        0}
                    </td>

                    <td className="p-3">
                      <span
                        className={
                          damage.status ===
                          "Open"
                            ? "text-red-600 font-semibold"
                            : "text-green-600 font-semibold"
                        }
                      >
                        {damage.status}
                      </span>
                    </td>
                  </tr>
                )
              )
            )}

          </tbody>

        </table>

      </div>

    </MainLayout>
  );
}

export default Damages;