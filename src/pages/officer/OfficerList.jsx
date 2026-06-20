import { useDeleteOfficerMutation, useGetOfficerQuery } from "../../api/officerApi";

export default function OfficerList({ setSelectedOfficer }) {

    const { data: officers = [], isLoading, isError } = useGetOfficerQuery();
    const [deleteOfficer, { isLoading: isDeleting }] = useDeleteOfficerMutation();


    const handleDelete = async (id) => {

        if (!window.confirm("Are you sure you want to delete this officer?")) {
            return;
        }

        try {
            await deleteOfficer(id).unwrap();
        } catch (err) {
            console.error(err);
            alert("Failed to delete officer");
        }
    };


    if (isLoading) {
        return (
            <div className="p-6 text-center text-gray-600">
                Loading Officers...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 text-center text-red-600">
                Error loading officers
            </div>
        );
    }


    return (
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    Officers List
                </h2>
            </div>

            {officers.length === 0 ? (
                <p className="text-center py-6 text-gray-500">No officers found</p>
            ) : (
                <>
                    {/* Mobile card list */}
                    <div className="flex flex-col gap-3 md:hidden">
                        {officers.map((officer) => (
                            <div key={officer.id} className="border border-gray-100 rounded-xl p-4 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400">{officer.employeeId}</span>
                                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">
                                        {officer.role}
                                    </span>
                                </div>

                                <div>
                                    <p className="font-medium text-gray-800">{officer.name}</p>
                                    <p className="text-xs text-gray-500 break-all">{officer.email}</p>
                                    <p className="text-xs text-gray-500">{officer.phone}</p>
                                </div>

                                <div className="flex justify-end gap-2 pt-2 border-t border-gray-50">
                                    <button
                                        onClick={() => setSelectedOfficer(officer)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(officer.id)}
                                        disabled={isDeleting}
                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
                                    <th className="px-4 py-3">Officer ID</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Phone</th>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {officers.map((officer) => (
                                    <tr
                                        key={officer.id}
                                        className="hover:bg-gray-50 transition"
                                    >
                                        <td className="px-4 py-3 font-medium text-gray-700">
                                            {officer.employeeId}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-gray-700">
                                            {officer.email}
                                        </td>
                                        <td className="px-4 py-3">
                                            {officer.name}
                                        </td>
                                        <td className="px-4 py-3">
                                            {officer.phone}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">
                                                {officer.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => setSelectedOfficer(officer)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(officer.id)}
                                                    disabled={isDeleting}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-50"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}