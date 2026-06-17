import { useEffect, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";
import Modal from "../../components/common/Modal";
import api from "../../api/axios";
import toast from "react-hot-toast";
import Input from "../../components/common/Input";
import PageHeader from "../../components/common/PageHeader";

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await api.get("/vendors");
      setVendors(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      contact_person: "",
      email: "",
      phone: "",
      address: "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddClick = () => {
    setIsEditMode(false);
    setSelectedVendorId(null);
    resetForm();
    setShowModal(true);
  };

  const handleEditClick = (vendor) => {
    setIsEditMode(true);
    setSelectedVendorId(vendor.id);

    setFormData({
      name: vendor.name || "",
      contact_person: vendor.contact_person || "",
      email: vendor.email || "",
      phone: vendor.phone || "",
      address: vendor.address || "",
    });

    setShowModal(true);
  };

  const handleCreateVendor = async (e) => {
    e.preventDefault();

    try {
      await api.post("/vendors", formData);

      setShowModal(false);
      resetForm();
      fetchVendors();

      toast.success("Vendor created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create Vendor");
    }
  };

  const handleUpdateVendor = async (e) => {
    e.preventDefault();

    try {
      await api.put(
        `/vendors/${selectedVendorId}`,
        formData
      );

      setShowModal(false);
      setIsEditMode(false);
      setSelectedVendorId(null);
      resetForm();
      fetchVendors();

      toast.success("Vendor updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    }
  };

  const handleDeleteVendor = async (vendorId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this vendor?"
      )
    ) {
      return;
    }

    try {
      await api.delete(`/vendors/${vendorId}`);

      fetchVendors();

      toast.success("Vendor deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    }
  };

  const filteredVendors = vendors.filter((vendor) =>
    vendor.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <PageHeader title="Vendors">
        {/* <div className="flex gap-3"> */}
          <Input
            type="text"
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />

          <button
            onClick={handleAddClick}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Vendor
          </button>
        {/* </div> */}
      </PageHeader>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">
                Contact Person
              </th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Phone</th>
              <th className="text-left p-4">Address</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredVendors.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-6 text-gray-500"
                >
                  No vendors found
                </td>
              </tr>
            ) : (
              filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="border-t">
                  <td className="p-4">{vendor.name}</td>
                  <td className="p-4">
                    {vendor.contact_person || "-"}
                  </td>
                  <td className="p-4">
                    {vendor.email || "-"}
                  </td>
                  <td className="p-4">
                    {vendor.phone || "-"}
                  </td>
                  <td className="p-4">
                    {vendor.address || "-"}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => handleEditClick(vendor)}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteVendor(vendor.id)
                      }
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          isEditMode ? "Edit Vendor" : "Add Vendor"
        }
      >
        <form
          onSubmit={
            isEditMode
              ? handleUpdateVendor
              : handleCreateVendor
          }
        >
          <input
            type="text"
            name="name"
            placeholder="Vendor Name"
            value={formData.name}
            onChange={handleChange}
            className="border w-full p-2 mb-3"
            required
          />

          <input
            type="text"
            name="contact_person"
            placeholder="Contact Person"
            value={formData.contact_person}
            onChange={handleChange}
            className="border w-full p-2 mb-3"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border w-full p-2 mb-3"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="border w-full p-2 mb-3"
          />

          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="border w-full p-2 mb-4"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {isEditMode ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}

export default Vendors;