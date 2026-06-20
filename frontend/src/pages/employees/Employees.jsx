import { useEffect, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";
import Modal from "../../components/common/Modal";
import api from "../../api/axios";
import toast from "react-hot-toast";
import Input from "../../components/common/Input";
import PageHeader from "../../components/common/PageHeader";
import { useNavigate } from "react-router-dom";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    employee_code: "",
    full_name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/employees");
      setEmployees(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      employee_code: "",
      full_name: "",
      email: "",
      phone: "",
      department: "",
      designation: "",
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
    setSelectedEmployeeId(null);
    resetForm();
    setShowModal(true);
  };

  const handleEditClick = (employee) => {
    setIsEditMode(true);
    setSelectedEmployeeId(employee.id);

    setFormData({
      employee_code: employee.employee_code || "",
      full_name: employee.full_name || "",
      email: employee.email || "",
      phone: employee.phone || "",
      department: employee.department || "",
      designation: employee.designation || "",
    });

    setShowModal(true);
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();

    try {
      await api.post("/employees", formData);

      setShowModal(false);
      resetForm();
      fetchEmployees();

      toast.success("Employee created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    }
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();

    try {
      await api.put(
        `/employees/${selectedEmployeeId}`,
        formData
      );

      setShowModal(false);
      setIsEditMode(false);
      setSelectedEmployeeId(null);
      resetForm();
      fetchEmployees();

      toast.success("Employee updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this employee?"
      )
    ) {
      return;
    }

    try {
      await api.delete(`/employees/${employeeId}`);

      fetchEmployees();

      toast.success("Employee deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    }
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.full_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      employee.employee_code
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      employee.department
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <PageHeader title="Employees">
        <div className="flex gap-3">
          <Input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />

          <button
            onClick={handleAddClick}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Employee
          </button>
        </div>
      </PageHeader>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Code</th>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Phone</th>
              <th className="text-left p-4">Department</th>
              <th className="text-left p-4">Designation</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center p-6 text-gray-500"
                >
                  No employees found
                </td>
              </tr>
            ) : (
              filteredEmployees.map((employee) => (
                <tr key={employee.id} className="border-t">
                  <td className="p-4">{employee.employee_code}</td>
                  <td className="p-4">{employee.full_name}</td>
                  <td className="p-4">{employee.email || "-"}</td>
                  <td className="p-4">{employee.phone || "-"}</td>
                  <td className="p-4">{employee.department || "-"}</td>
                  <td className="p-4">{employee.designation || "-"}</td>

                  <td className="p-4">

                    <button
                      onClick={() => navigate(`/employees/${employee.id}`)}
                      className="text-gray-600 hover:underline mr-3"
                    >
                      View
                    </button>
                    
                    <button
                      onClick={() => handleEditClick(employee)}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteEmployee(employee.id)
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
        title={isEditMode ? "Edit Employee" : "Add Employee"}
      >
        <form
          onSubmit={
            isEditMode
              ? handleUpdateEmployee
              : handleCreateEmployee
          }
        >
          <input
            type="text"
            name="employee_code"
            placeholder="Employee Code"
            value={formData.employee_code}
            onChange={handleChange}
            className="border w-full p-2 mb-3"
            required
          />

          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            className="border w-full p-2 mb-3"
            required
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

          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            className="border w-full p-2 mb-3"
          />

          <input
            type="text"
            name="designation"
            placeholder="Designation"
            value={formData.designation}
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

export default Employees;