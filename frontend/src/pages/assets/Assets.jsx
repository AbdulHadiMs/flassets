import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import api from "../../api/axios";
import StatusBadge from "../../components/common/StatusBadge";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import PageHeader from "../../components/common/PageHeader";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Assets() {
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] =
    useState({
      asset_code: "",
      asset_name: "",
      category_id: "",
      serial_number: "",
      purchase_cost: "",
      purchase_condition: "New",
      status: "Available",
    });
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [locations, setLocations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    fetchAssets();
    fetchCategories();
    fetchVendors();
    fetchLocations();
    fetchEmployees();
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      category_id: categoryId,
    }));

    if (!categoryId) {
      setFormData((prev) => ({
        ...prev,
        category_id: "",
        asset_code: "",
      }));
      return;
    }

    try {
      const response = await api.get(
        `/assets/generate-code/${categoryId}`
      );

      setFormData((prev) => ({
        ...prev,
        category_id: categoryId,
        asset_code: response.data.asset_code,
      }));
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to generate asset code"
      );
    }
  };


  const buildAssetPayload = () => {
    return {
      ...formData,
      category_id: Number(formData.category_id),

      vendor_id: formData.vendor_id
        ? Number(formData.vendor_id)
        : null,

      location_id: formData.location_id
        ? Number(formData.location_id)
        : null,

      employee_id: formData.employee_id
        ? Number(formData.employee_id)
        : null,

      purchase_cost: formData.purchase_cost
        ? Number(formData.purchase_cost)
        : null,

      serial_number: formData.serial_number || null,

      purchase_date: formData.purchase_date || null,

      warranty_expiry: formData.warranty_expiry || null,

      purchase_condition: formData.purchase_condition,

    };
  };

  const handleCreateAsset = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {

      const payload =
        buildAssetPayload();

      await api.post(
        "/assets",
        payload
      );

      setShowModal(false);

      fetchAssets();

      toast.success(
        "Asset created successfully"
      );

    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to create asset"
      );

    } finally {

      setLoading(false);

    }
  };

  const handleUpdateAsset = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {

      const payload =
        buildAssetPayload();

      await api.put(
        `/assets/${selectedAssetId}`,
        payload
      );

      setShowModal(false);

      setIsEditMode(false);

      setSelectedAssetId(null);

      fetchAssets();

      toast.success(
        "Asset updated successfully"
      );

    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to update asset"
      );

    } finally {

      setLoading(false);

    }
  };

  const handleEditClick = (asset) => {

    setIsEditMode(true);

    setSelectedAssetId(asset.id);

    setFormData({
      asset_code: asset.asset_code,
      asset_name: asset.asset_name,
      category_id: asset.category_id || "",
      vendor_id: asset.vendor_id || "",
      location_id: asset.location_id || "",
      employee_id: asset.employee_id || "",
      serial_number: asset.serial_number || "",
      purchase_date: asset.purchase_date || "",
      warranty_expiry: asset.warranty_expiry || "",
      purchase_cost: asset.purchase_cost || "",
      status: asset.status,

    });

    setShowModal(true);
  };

  const handleDeleteAsset = async (assetId) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this asset?"
    );

    if (!confirmDelete) return;

    setLoading(true);

    try {

      await api.delete(
        `/assets/${assetId}`
      );

      fetchAssets();

      toast.success(
        "Asset deleted successfully"
      );

    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to delete asset"
      );

    } finally {

      setLoading(false);

    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchVendors = async () => {
    const response = await api.get("/vendors");
    setVendors(response.data.data);
  };

  const fetchLocations = async () => {
    const response = await api.get("/locations");
    setLocations(response.data.data);
  };

  const fetchEmployees = async () => {
    const response = await api.get("/employees");
    setEmployees(response.data.data);
  };

  const handleAddClick = () => {

    setIsEditMode(false);

    setSelectedAssetId(null);

    setFormData({
      asset_code: "",
      asset_name: "",
      category_id: "",
      vendor_id: "",
      location_id: "",
      employee_id: "",
      serial_number: "",
      purchase_date: "",
      warranty_expiry: "",
      purchase_cost: "",
      status: "Available",
    });

    setShowModal(true);
  };

  return (
    <MainLayout>

      <PageHeader title="Assets">

        <div className="flex justify-between items-center mb-6 gap-3">

          <Input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <Button
            onClick={handleAddClick}
            className="bg-blue-600 text-white"
          >
            Add Asset
          </Button>

        </div>

      </PageHeader>

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
                Serial Number
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
                  {asset.serial_number || "-"}
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
                    onClick={() =>
                      navigate(`/assets/${asset.id}`)
                    }
                    className="text-gray-600 hover:underline mr-3"
                  >
                    View
                  </button>

                  <button
                    onClick={() =>
                      handleEditClick(asset)
                    }
                    className="text-blue-600 hover:underline mr-3"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteAsset(asset.id)
                    }
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
        title={isEditMode ? "Edit Asset" : "Add Asset"}
      >
        <form onSubmit={isEditMode ? handleUpdateAsset : handleCreateAsset}>

          <Input
            type="text"
            name="asset_code"
            placeholder="Asset Code"
            value={formData.asset_code}
            readOnly
            className="mb-3 bg-gray-100"
          />

          <Input
            type="text"
            name="asset_name"
            placeholder="Asset Name"
            value={formData.asset_name}
            onChange={handleChange}
            className="mb-3"
            required
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <Select
            name="category_id"
            value={formData.category_id}
            onChange={
              isEditMode
                ? handleChange
                : handleCategoryChange
            }
            className="mb-3"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vendor
          </label>
          <Select
            name="vendor_id"
            value={formData.vendor_id}
            onChange={handleChange}
            className="mb-3"
          >
            <option value="">Select Vendor</option>
            {vendors.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.name}
              </option>
            ))}
          </Select>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <Select
            name="location_id"
            value={formData.location_id}
            onChange={handleChange}
            className="mb-3"
          >
            <option value="">Select Location</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </Select>

          {/* <Select
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            className="mb-3"
          >
            <option value="">Select Employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.employee_code} - {employee.full_name}
              </option>
            ))}
          </Select> */}

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Serial Number
          </label>
          <Input
            type="text"
            name="serial_number"
            placeholder="Serial Number"
            value={formData.serial_number}
            onChange={handleChange}
            className="mb-3"
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </label>
          <Input
            type="number"
            name="purchase_cost"
            placeholder="Purchase Cost"
            value={formData.purchase_cost}
            onChange={handleChange}
            className="mb-3"
          />
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purchase Date
          </label>
          <Input
            type="date"
            name="purchase_date"
            value={formData.purchase_date}
            onChange={handleChange}
            className="mb-3"
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Warranty Expiry
          </label>
          <Input
            type="date"
            name="warranty_expiry"
            value={formData.warranty_expiry}
            onChange={handleChange}
            className="mb-3"
          />

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purchase Condition
          </label>

          <select
            name="purchase_condition"
            value={formData.purchase_condition}
            onChange={handleChange}
            className="border w-full p-2 mb-3 rounded"
          >
            <option value="New">New</option>
            <option value="Used">Used</option>
            <option value="Refurbished">
              Refurbished
            </option>
          </select>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Asset Status
          </label>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mb-4"
          >
            <option value="Available">Available</option>
            {/* <option value="Allocated">Allocated</option> */}
            <option value="Maintenance">Maintenance</option>
            <option value="Damaged">Damaged</option>
          </Select>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              onClick={() => setShowModal(false)}
              className="border"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white"
            >
              {loading
                ? "Saving..."
                : isEditMode
                  ? "Update"
                  : "Save"}
            </Button>
          </div>

        </form>
      </Modal>

    </MainLayout>
  );
}

export default Assets;