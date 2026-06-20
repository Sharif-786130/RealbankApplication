import { useState } from "react";
import OfficerForm from "../../components/forms/OfficerForm";
import OfficerList from "../officer/OfficerList";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";


// Creation of Officer Role
export default function OfficerPage() {

    const [selectedOfficer, setSelectedOfficer] = useState(null);
    const navigate = useNavigate();

    return (
        <div className="space-y-6">

            <div className="w-full flex justify-end">
                <button onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition">
                    <ArrowLeft size={15} /> Back
                </button>
            </div>
            <h1 className="text-2xl font-bold">Manages Officers</h1>

            <OfficerForm
                selectedOfficer={selectedOfficer}
                setSelectedOfficer={setSelectedOfficer}
            />

            <OfficerList
                setSelectedOfficer={setSelectedOfficer}
            />

        </div>
    )
}