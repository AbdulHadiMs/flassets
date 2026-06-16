import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import api from "../../api/axios";
import StatusBadge from "../../components/common/StatusBadge";
import Modal from "../../components/common/Modal";

function Assets() {
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await api.get("/assets");

      setAssets(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredAssets = assets.filter(
    (asset) =>
      asset.asset_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      asset.asset_code
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <MainLayout>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Assets
        </h1>

        <div className="flex gap-3">

          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border rounded px-3 py-2"
          />

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Asset
          </button>

        </div>

      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">


        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="text-left p-4">
                Asset Code
              </th>

              <th className="text-left p-4">
                Asset Name
              </th>

              <th className="text-left p-4">
                Category
              </th>

              <th className="text-left p-4">
                Status
              </th>

              <th className="text-left p-4">
                Employee
              </th>

              <th className="text-left p-4">
                Actions
              </th>
            </tr>

          </thead>

          <tbody>

            {filteredAssets.map((asset) => (
              <tr
                key={asset.id}
                className="border-t"
              >
                <td className="p-4">
                  {asset.asset_code}
                </td>

                <td className="p-4">
                  {asset.asset_name}
                </td>

                <td className="p-4">
                  {asset.category}
                </td>

                <td className="p-4">
                  <StatusBadge status={asset.status} />
                </td>

                <td className="p-4">
                  {asset.employee || "-"}
                </td>

                <td className="p-4">
                  <button
                    className="text-blue-600 hover:underline mr-3"
                  >
                    Edit
                  </button>

                  <button
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>

                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Asset"
      >
        <p>Modal Working 🚀</p>
      </Modal>

    </MainLayout>
  );
}

export default Assets;