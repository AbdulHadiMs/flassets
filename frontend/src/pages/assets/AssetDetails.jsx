import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";
import StatusBadge from "../../components/common/StatusBadge";
import api from "../../api/axios";

function AssetDetails() {
    const { id } = useParams();

    const [asset, setAsset] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchAssetDetails();
        fetchAssetHistory();
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

    if (!asset) {
        return (
            <MainLayout>
                <p>Loading asset details...</p>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <h1 className="text-3xl font-bold mb-6">
                Asset Details
            </h1>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Detail label="Asset Code" value={asset.asset_code} />
                    <Detail label="Asset Name" value={asset.asset_name} />
                    <Detail label="Serial Number" value={asset.serial_number || "-"} />
                    <Detail label="Status" value={<StatusBadge status={asset.status} />} />

                    <Detail label="Category" value={asset.category || "-"} />
                    <Detail label="Vendor" value={asset.vendor || "-"} />
                    <Detail label="Location" value={asset.location || "-"} />
                    <Detail label="Employee" value={asset.employee || "-"} />

                    <Detail label="Purchase Cost" value={asset.purchase_cost || "-"} />
                    <Detail label="Invoice Number" value={asset.invoice_number || "-"} />
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