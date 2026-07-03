import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";
import StatusBadge from "../../components/common/StatusBadge";
import api from "../../api/axios";

function CategoryAssets() {
    const { id } = useParams();

    const [assets, setAssets] =
        useState([]);

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets =
        async () => {
            const response =
                await api.get(
                    `/categories/${id}/assets`
                );

            setAssets(
                response.data.data
            );
        };

    return (
        <MainLayout>

            <h1 className="text-3xl font-bold mb-6">
                Category Assets
            </h1>

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
                                Serial Number
                            </th>

                            <th className="text-left p-4">
                                Status
                            </th>
                        </tr>
                    </thead>

                    <tbody>

                        {assets.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="text-center p-6"
                                >
                                    No assets found
                                </td>
                            </tr>
                        ) : (
                            assets.map(
                                (asset) => (
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
                                            {asset.employee_name}
                                        </td>
                                        <td className="p-4">
                                            {asset.serial_number}
                                        </td>

                                        <td className="p-4">
                                            <StatusBadge
                                                status={
                                                    asset.status
                                                }
                                            />
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

export default CategoryAssets;