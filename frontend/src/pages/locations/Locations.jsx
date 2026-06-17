import { useEffect, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";
import Modal from "../../components/common/Modal";
import api from "../../api/axios";
import toast from "react-hot-toast";
import Input from "../../components/common/Input";
import PageHeader from "../../components/common/PageHeader";

function Locations() {
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [isEditMode, setIsEditMode] =
    useState(false);

  const [
    selectedLocationId,
    setSelectedLocationId,
  ] = useState(null);

  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
    });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await api.get(
        "/locations"
      );

      setLocations(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleAddClick = () => {
    setIsEditMode(false);

    setSelectedLocationId(null);

    resetForm();

    setShowModal(true);
  };

  const handleEditClick = (
    location
  ) => {
    setIsEditMode(true);

    setSelectedLocationId(
      location.id
    );

    setFormData({
      name: location.name || "",
      description:
        location.description || "",
    });

    setShowModal(true);
  };

  const handleCreateLocation =
    async (e) => {
      e.preventDefault();

      try {
        await api.post(
          "/locations",
          formData
        );

        setShowModal(false);

        resetForm();

        fetchLocations();

        toast.success("Location created successfully");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed");
      }
    };

  const handleUpdateLocation =
    async (e) => {
      e.preventDefault();

      try {
        await api.put(
          `/locations/${selectedLocationId}`,
          formData
        );

        setShowModal(false);

        setIsEditMode(false);

        setSelectedLocationId(null);

        resetForm();

        fetchLocations();

        toast.success("Location updated successfully");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed");
      }
    };

  const handleDeleteLocation =
    async (locationId) => {
      if (
        !window.confirm(
          "Are you sure you want to delete this location?"
        )
      ) {
        return;
      }

      try {
        await api.delete(
          `/locations/${locationId}`
        );

        fetchLocations();

        toast.success("Location deleted successfully");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed");
      }
    };

  const filteredLocations =
    locations.filter((location) =>
      location.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <MainLayout>
      <PageHeader title="Locations">
        <div className="flex gap-3">
          <Input
            type="text"
            placeholder="Search locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />

          <button
            onClick={handleAddClick}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Location
          </button>
        </div>
      </PageHeader>

      <div className="bg-white rounded-lg shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-4">
                Name
              </th>

              <th className="text-left p-4">
                Description
              </th>

              <th className="text-left p-4">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredLocations.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="text-center p-6 text-gray-500"
                >
                  No locations found
                </td>
              </tr>
            ) : (
              filteredLocations.map((location) => (
                (location) => (
                  <tr
                    key={location.id}
                    className="border-t"
                  >
                    <td className="p-4">
                      {location.name}
                    </td>

                    <td className="p-4">
                      {location.description ||
                        "-"}
                    </td>

                    <td className="p-4">

                      <button
                        onClick={() =>
                          handleEditClick(
                            location
                          )
                        }
                        className="text-blue-600 hover:underline mr-3"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteLocation(
                            location.id
                          )
                        }
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                )
              ))
            )}

          </tbody>

        </table>

      </div>

      <Modal
        isOpen={showModal}
        onClose={() =>
          setShowModal(false)
        }
        title={
          isEditMode
            ? "Edit Location"
            : "Add Location"
        }
      >
        <form
          onSubmit={
            isEditMode
              ? handleUpdateLocation
              : handleCreateLocation
          }
        >

          <input
            type="text"
            name="name"
            placeholder="Location Name"
            value={formData.name}
            onChange={
              handleChange
            }
            className="border w-full p-2 mb-3"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={
              formData.description
            }
            onChange={
              handleChange
            }
            className="border w-full p-2 mb-4"
          />

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={() =>
                setShowModal(false)
              }
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {isEditMode
                ? "Update"
                : "Save"}
            </button>

          </div>

        </form>
      </Modal>

    </MainLayout>
  );
}

export default Locations;