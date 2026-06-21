import { useEffect, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";
import Modal from "../../components/common/Modal";
import api from "../../api/axios";
import StatusBadge from "../../components/common/StatusBadge";
import toast from "react-hot-toast";
import Input from "../../components/common/Input";
import PageHeader from "../../components/common/PageHeader";
import Select from "react-select";

function Allocations() {
    const [allocations, setAllocations] = useState([]);
    const [assets, setAssets] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState("");


    const [formData, setFormData] = useState({
        asset_id: "",
        employee_id: "",
        allocation_date: "",
        expected_return_date: "",
        remarks: "",
    });

    useEffect(() => {
        fetchAllocations();
        fetchAssets();
        fetchEmployees();
    }, []);

    const filteredAllocations = allocations.filter(
        (allocation) =>
            allocation.asset_code
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||

            allocation.asset_name
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||

            allocation.employee_name
                ?.toLowerCase()
                .includes(search.toLowerCase())
    );

    const fetchAllocations = async () => {
        const response = await api.get("/allocations");
        setAllocations(response.data.data);
    };

    const fetchAssets = async () => {
        const response = await api.get("/assets");
        setAssets(response.data.data);
    };

    const fetchEmployees = async () => {
        const response = await api.get("/employees");
        setEmployees(response.data.data);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const resetForm = () => {
        setFormData({
            asset_id: "",
            employee_id: "",
            allocation_date: "",
            expected_return_date: "",
            remarks: "",
        });
    };

    const handleAllocateAsset = async (e) => {
        e.preventDefault();

        if (
            !formData.asset_id ||
            !formData.employee_id
        ) {
            toast.error(
                "Please select asset and employee"
            );
            return;
        }

        try {
            await api.post(
                "/allocations",
                formData
            );

            setShowModal(false);
            resetForm();

            fetchAllocations();
            fetchAssets();

            toast.success(
                "Asset allocated successfully"
            );
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed allocate Asset"
            );
        }
    };

    const handleReturnAsset = async (allocationId) => {
        if (
            !window.confirm(
                "Are you sure you want to return this asset?"
            )
        ) {
            return;
        }

        try {
            await api.put(`/allocations/${allocationId}/return`);

            fetchAllocations();
            fetchAssets();

            toast.success("Asset returned successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to return Asset");
        }
    };

    const availableAssets = assets.filter(
        (asset) => asset.status === "Available"
    );

    const assetOptions = availableAssets.map(
        (asset) => ({
            value: asset.id,
            label: `${asset.asset_code} - ${asset.asset_name}`,
        })
    );

    const employeeOptions = employees.map(
        (employee) => ({
            value: employee.id,
            label: `${employee.employee_code} - ${employee.full_name}`,
        })
    );

    return (
        <MainLayout>
            <PageHeader title="Asset Allocations">

                <div className="flex gap-3">

                    <Input
                        type="text"
                        placeholder="Search allocations..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="w-64"
                    />

                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Allocate Asset
                    </button>

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
                                Employee
                            </th>

                            <th className="text-left p-4">
                                Status
                            </th>

                            <th className="text-left p-4">
                                Allocation Date
                            </th>

                            <th className="text-left p-4">
                                Expected Return
                            </th>

                            <th className="text-left p-4">
                                Actual Return
                            </th>

                            <th className="text-left p-4">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredAllocations.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="8"
                                    className="text-center p-6 text-gray-500"
                                >
                                    No allocations found
                                </td>
                            </tr>
                        ) : (
                            filteredAllocations.map((allocation) => (
                                <tr
                                    key={allocation.id}
                                    className="border-t"
                                >
                                    <td className="p-4">
                                        {allocation.asset_code}
                                    </td>

                                    <td className="p-4">
                                        {allocation.asset_name}
                                    </td>

                                    <td className="p-4">
                                        {allocation.employee_name}
                                    </td>

                                    <td className="p-4">
                                        <StatusBadge
                                            status={allocation.status}
                                        />
                                    </td>

                                    <td className="p-4">
                                        {allocation.allocation_date}
                                    </td>

                                    <td className="p-4">
                                        {allocation.expected_return_date || "-"}
                                    </td>

                                    <td className="p-4">
                                        {allocation.actual_return_date || "-"}
                                    </td>

                                    <td className="p-4">
                                        {allocation.status === "Allocated" ? (
                                            <button
                                                onClick={() =>
                                                    handleReturnAsset(
                                                        allocation.id
                                                    )
                                                }
                                                className="text-green-600 hover:underline"
                                            >
                                                Return
                                            </button>
                                        ) : (
                                            <span className="text-gray-400">
                                                Returned
                                            </span>
                                        )}
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
                title="Allocate Asset"
            >
                <form onSubmit={handleAllocateAsset}>
                    <div className="mb-3">
                        <Select
                            options={assetOptions}
                            value={
                                assetOptions.find(
                                    (option) =>
                                        option.value ==
                                        formData.asset_id
                                ) || null
                            }
                            onChange={(selected) =>
                                setFormData({
                                    ...formData,
                                    asset_id: selected
                                        ? selected.value
                                        : "",
                                })
                            }
                            placeholder="Search Asset..."
                            isSearchable
                            isClearable
                        />
                    </div>

                    <div className="mb-3">
                        <Select
                            options={employeeOptions}
                            value={
                                employeeOptions.find(
                                    (option) =>
                                        option.value ==
                                        formData.employee_id
                                ) || null
                            }
                            onChange={(selected) =>
                                setFormData({
                                    ...formData,
                                    employee_id: selected
                                        ? selected.value
                                        : "",
                                })
                            }
                            placeholder="Search Employee..."
                            isSearchable
                            isClearable
                        />
                    </div>

                    <input
                        type="date"
                        name="allocation_date"
                        value={formData.allocation_date}
                        onChange={handleChange}
                        className="border w-full p-2 mb-3"
                        required
                    />

                    <input
                        type="date"
                        name="expected_return_date"
                        value={formData.expected_return_date}
                        onChange={handleChange}
                        className="border w-full p-2 mb-3"
                    />

                    <textarea
                        name="remarks"
                        placeholder="Remarks"
                        value={formData.remarks}
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
                            Allocate
                        </button>
                    </div>
                </form>
            </Modal>
        </MainLayout>
    );
}

export default Allocations;