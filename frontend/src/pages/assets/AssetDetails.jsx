import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";
import StatusBadge from "../../components/common/StatusBadge";
import api from "../../api/axios";
import Modal from "../../components/common/Modal";
import toast from "react-hot-toast";

function AssetDetails() {
    const { id } = useParams();

    const [asset, setAsset] = useState(null);
    const [history, setHistory] = useState([]);
    const [damages, setDamages] = useState([]);
    const [showDamageModal, setShowDamageModal] = useState(false);

    const [damageData, setDamageData] =
        useState({
            damage_date: "",
            damage_description: "",
            repair_cost: "",
            remarks: ""
        });

    useEffect(() => {
        fetchAssetDetails();
        fetchAssetHistory();
        fetchDamageHistory();
    }, []);

    const fetchAssetDetails = async () => {
        try {
            const response = await api.get(`/assets/${id}`);
            setAsset(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAssetHistory = async () => {
        try {
            const response = await api.get(
                `/assets/${id}/history`
            );

            setHistory(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDamageHistory = async () => {
        try {
            const response = await api.get(
                `/assets/${id}/damages`
            );

            setDamages(
                response.data.data
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleDamageChange = (e) => {
        setDamageData({
            ...damageData,
            [e.target.name]:
                e.target.value
        });
    };

    const handleReportDamage =
        async (e) => {
            e.preventDefault();

            try {
                await api.post(
                    "/damages",
                    {
                        asset_id: id,
                        employee_id:
                            asset.employee_id,
                        damage_date:
                            damageData.damage_date,
                        damage_description:
                            damageData.damage_description,
                        repair_cost:
                            damageData.repair_cost,
                        remarks:
                            damageData.remarks
                    }
                );

                setShowDamageModal(false);

                setDamageData({
                    damage_date: "",
                    damage_description: "",
                    repair_cost: "",
                    remarks: ""
                });

                fetchAssetDetails();
                fetchDamageHistory();

                toast.success(
                    "Damage reported successfully"
                );

            } catch (error) {
                toast.error(
                    error.response?.data
                        ?.message || "Failed"
                );
            }
        };

    const handleMarkRepaired = async (damageId) => {
        if (!window.confirm("Mark this damage as repaired?")) {
            return;
        }

        try {
            await api.put(`/damages/${damageId}/repair`);

            fetchAssetDetails();
            fetchDamageHistory();

            toast.success("Asset marked as repaired");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to mark repaired"
            );
        }
    };

    if (!asset) {
        return (
            <MainLayout>
                <p>Loading asset details...</p>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">
                    Asset Details
                </h1>

                <button
                    onClick={() =>
                        setShowDamageModal(true)
                    }
                    disabled={
                        asset.status === "Damaged"
                    }
                    className={`px-4 py-2 rounded text-white ${asset.status === "Damaged"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                >
                    Report Damage
                </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Detail label="Asset Code" value={asset.asset_code} />
                    <Detail label="Asset Name" value={asset.asset_name} />
                    <Detail label="Serial Number" value={asset.serial_number || "-"} />
                    <Detail label="Category" value={asset.category || "-"} />
                    <Detail label="Vendor" value={asset.vendor || "-"} />
                    <Detail label="Location" value={asset.location || "-"} />
                    <Detail label="Employee" value={asset.employee || "-"} />
                    <Detail
                        label="Purchase Date"
                        value={asset.purchase_date || "-"}
                    />

                    <Detail
                        label="Purchase Condition"
                        value={asset.purchase_condition || "-"}
                    />

                    <Detail label="Purchase Cost" value={asset.purchase_cost || "-"} />
                    <Detail label="Invoice Number" value={asset.invoice_number || "-"} />


                    <Detail
                        label="Warranty Expiry"
                        value={asset.warranty_expiry || "-"}
                    />
                    <Detail label="Status" value={<StatusBadge status={asset.status} />} />
                </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">
                    Allocation History
                </h2>

                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-3">Employee</th>
                            <th className="text-left p-3">Status</th>
                            <th className="text-left p-3">Allocation Date</th>
                            <th className="text-left p-3">Expected Return</th>
                            <th className="text-left p-3">Actual Return</th>
                        </tr>
                    </thead>

                    <tbody>
                        {history.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="text-center p-5 text-gray-500"
                                >
                                    No allocation history found
                                </td>
                            </tr>
                        ) : (
                            history.map((item) => (
                                <tr key={item.id} className="border-t">
                                    <td className="p-3">{item.employee_name || "-"}</td>
                                    <td className="p-3">{item.status}</td>
                                    <td className="p-3">{item.allocation_date || "-"}</td>
                                    <td className="p-3">{item.expected_return_date || "-"}</td>
                                    <td className="p-3">{item.actual_return_date || "-"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mt-6">

                <h2 className="text-xl font-semibold mb-4">
                    Damage History
                </h2>

                <table className="w-full">

                    <thead className="bg-gray-100">

                        <tr>
                            <th className="text-left p-3">
                                Date
                            </th>

                            <th className="text-left p-3">
                                Employee
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
                            <th className="text-left p-3">
                                Actions
                            </th>
                        </tr>

                    </thead>

                    <tbody>

                        {damages.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="text-center p-5 text-gray-500"
                                >
                                    No damage history found
                                </td>
                            </tr>
                        ) : (
                            damages.map((damage) => (
                                <tr
                                    key={damage.id}
                                    className="border-t"
                                >
                                    <td className="p-3">
                                        {damage.damage_date}
                                    </td>

                                    <td className="p-3">
                                        {damage.employee_name || "-"}
                                    </td>

                                    <td className="p-3">
                                        {damage.damage_description}
                                    </td>

                                    <td className="p-3">
                                        ₹
                                        {damage.repair_cost || 0}
                                    </td>

                                    <td className="p-3">

                                        <span
                                            className={
                                                damage.status === "Open"
                                                    ? "text-red-600 font-semibold"
                                                    : "text-green-600 font-semibold"
                                            }
                                        >
                                            {damage.status}
                                        </span>

                                    </td>
                                    <td className="p-3">
                                        {damage.status === "Open" ? (
                                            <button
                                                onClick={() => handleMarkRepaired(damage.id)}
                                                className="text-green-600 hover:underline"
                                            >
                                                Mark Repaired
                                            </button>
                                        ) : (
                                            <span className="text-gray-400">
                                                Repaired
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
                isOpen={showDamageModal}
                onClose={() =>
                    setShowDamageModal(false)
                }
                title="Report Damage"
            >
                <form
                    onSubmit={
                        handleReportDamage
                    }
                >
                    <input
                        type="date"
                        name="damage_date"
                        value={
                            damageData.damage_date
                        }
                        onChange={
                            handleDamageChange
                        }
                        className="border w-full p-2 mb-3"
                        required
                    />

                    <textarea
                        name="damage_description"
                        placeholder="Damage Description"
                        value={
                            damageData.damage_description
                        }
                        onChange={
                            handleDamageChange
                        }
                        className="border w-full p-2 mb-3"
                        required
                    />

                    <input
                        type="number"
                        name="repair_cost"
                        placeholder="Repair Cost"
                        value={
                            damageData.repair_cost
                        }
                        onChange={
                            handleDamageChange
                        }
                        className="border w-full p-2 mb-3"
                    />

                    <textarea
                        name="remarks"
                        placeholder="Remarks"
                        value={
                            damageData.remarks
                        }
                        onChange={
                            handleDamageChange
                        }
                        className="border w-full p-2 mb-4"
                    />

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() =>
                                setShowDamageModal(false)
                            }
                            className="border px-4 py-2 rounded"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="bg-red-600 text-white px-4 py-2 rounded"
                        >
                            Report
                        </button>
                    </div>
                </form>
            </Modal>
        </MainLayout>
    );
}

function Detail({ label, value }) {
    return (
        <div>
            <p className="text-sm text-gray-500">
                {label}
            </p>
            <div className="font-semibold">
                {value}
            </div>
        </div>
    );
}

export default AssetDetails;