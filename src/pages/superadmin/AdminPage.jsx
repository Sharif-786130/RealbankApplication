import { useState } from "react";
import AdminForm from "../../components/forms/AdminForm"
import AdminList from "../admin/AdminList";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";


// Creation of the ADMIN Role
export default function AdminPage() {

    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">
                Manager Admins
            </h1>

            <div className="w-full flex justify-end">
                <button onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition">
                    <ArrowLeft size={15} /> Back
                </button>
            </div>

            <AdminForm
                selectedAdmin={selectedAdmin}
                setSelectedAdmin={setSelectedAdmin}
            />

            <AdminList
                setSelectedAdmin={setSelectedAdmin}
            />

        </div>
    )
}