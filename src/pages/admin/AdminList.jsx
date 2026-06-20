import { useDeleteAdminMutation, useGetAdminsQuery } from "../../api/adminApi";

export default function AdminList() {

    const { data: admins = [], isLoading, isError } = useGetAdminsQuery();
    const [deleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation();


    const handleDelete = async (id) => {

        if (!window.confirm("Are you sure you want to delete this admin?")) {
            return;
        }

        try {
            await deleteAdmin(id).unwrap();
        } catch (err) {
            console.error(err);
            alert("Failed to delete admin");
        }
    };


    if (isLoading) {
        return (
            <div className="p-6 text-center text-gray-600">
                Loading admins...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 text-center text-red-600">
                Error loading admins
            </div>
        );
    }


    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Admins List
                </h2>
            </div>


            {/* Table */}
            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead>
                        <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 text-gray-600 text-sm">

                            <th className="px-5 py-3 text-left">Email</th>
                            <th className="px-5 py-3 text-left">Name</th>
                            <th className="px-5 py-3 text-left">Phone</th>
                            <th className="px-5 py-3 text-center">Actions</th>

                        </tr>
                    </thead>

                    <tbody className="divide-y">

                        {admins.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-6 text-gray-500">
                                    No admins found
                                </td>
                            </tr>
                        ) : (
                            admins.map((admin) => (

                                <tr
                                    key={admin.id}
                                    className="hover:bg-gray-50 transition"
                                >

                                    <td className="px-5 py-3 font-medium text-gray-700">
                                        {admin.email}
                                    </td>

                                    <td className="px-5 py-3">
                                        {admin.name}
                                    </td>

                                    <td className="px-5 py-3">
                                        {admin.phone}
                                    </td>

                                    <td className="px-5 py-3">

                                        <div className="flex justify-center gap-2">

                                            <button
                                                disabled={isDeleting}
                                                onClick={() => handleDelete(admin.id)}
                                                className="bg-red-600 hover:bg-red-700 text-white 
                                                           px-3 py-1.5 rounded-lg text-xs font-medium 
                                                           transition disabled:opacity-50"
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </td>

                                </tr>
                            ))
                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}