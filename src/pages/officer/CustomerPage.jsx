
// import { Link } from "react-router-dom";
// import { useGetCustomersQuery } from "../../api/officerCustomerApi";

// const CustomerPage = () => {
//   const {
//     data: customers = [],
//     isLoading,
//     isError,
//     error,
//   } = useGetCustomersQuery();

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <p className="text-gray-600 text-lg">Loading customers...</p>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="bg-red-100 text-red-700 px-6 py-4 rounded-xl shadow">
//           {error?.data?.message || "Failed to load customers"}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6">

//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-gray-800">
//             Branch Customers
//           </h2>

//           <Link
//             to="/officer/create-customer"
//             className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition"
//           >
//             + Create Customer
//           </Link>
//         </div>

//         {customers.length === 0 ? (
//           <div className="bg-blue-100 text-blue-700 px-4 py-3 rounded-lg">
//             No customers found.
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-sm text-left">
//               <thead className="bg-gray-50 border-b">
//                 <tr className="text-gray-600 uppercase text-xs tracking-wider">
//                   <th className="px-4 py-3">#</th>
//                   <th className="px-4 py-3">Customer No</th>
//                   <th className="px-4 py-3">Name</th>
//                   <th className="px-4 py-3">Email</th>
//                   <th className="px-4 py-3">Mobile</th>
//                   <th className="px-4 py-3">KYC</th>
//                   <th className="px-4 py-3">Status</th>
//                   <th className="px-4 py-3">Actions</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y">
//                 {customers.map((customer, index) => (
//                   <tr
//                     // key={customer.id}
//                     key={customer.customerId}
//                     className="hover:bg-gray-50 transition"
//                   >
//                     <td className="px-4 py-3">{index + 1}</td>
//                     <td className="px-4 py-3 font-medium text-gray-700">
//                       {customer.customerNumber}
//                     </td>
//                     <td className="px-4 py-3">
//                       {customer.firstName} {customer.lastName}
//                     </td>
//                     <td className="px-4 py-3">{customer.email}</td>
//                     <td className="px-4 py-3">{customer.mobileNumber}</td>

//                     {/* KYC Badge */}
//                     <td className="px-4 py-3">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-medium ${
//                           customer.kycStatus === "PENDING"
//                             ? "bg-yellow-100 text-yellow-700"
//                             : "bg-green-100 text-green-700"
//                         }`}
//                       >
//                         {customer.kycStatus?.toString()}
//                       </span>
//                     </td>

//                     {/* Active Badge */}
//                     <td className="px-4 py-3">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-medium ${
//                           customer.active
//                             ? "bg-green-100 text-green-700"
//                             : "bg-red-100 text-red-700"
//                         }`}
//                       >
//                         {customer.active ? "Active" : "Inactive"}
//                       </span>
//                     </td>

//                     {/* Actions */}
//                     <td className="px-4 py-3 flex gap-2">
//                       <Link
//                         to={`${customer.customerId}`}
//                         className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-600 transition"
//                       >
//                         View
//                       </Link>

//                       <Link
//                         to={`edit/${customer.customerId}`}
//                         className="bg-amber-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-amber-600 transition"
//                       >
//                         Edit
//                       </Link>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>

//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CustomerPage;

import { Link } from "react-router-dom";
import { useGetCustomersQuery } from "../../api/officerCustomerApi";

const CustomerPage = () => {
  const {
    data: customers = [],
    isLoading,
    isError,
    error,
  } = useGetCustomersQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading customers...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded-xl shadow">
          {error?.data?.message || "Failed to load customers"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Branch Customers
          </h2>

          <Link
            to="/officer/create-customer"
            className="inline-flex items-center justify-center bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition text-sm"
          >
            + Create Customer
          </Link>
        </div>

        {customers.length === 0 ? (
          <div className="bg-blue-100 text-blue-700 px-4 py-3 rounded-lg">
            No customers found.
          </div>
        ) : (
          <>
            {/* Mobile card list */}
            <div className="flex flex-col gap-3 md:hidden">
              {customers.map((customer, index) => (
                <div key={customer.customerId} className="border border-gray-100 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">#{index + 1} · {customer.customerNumber}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        customer.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {customer.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div>
                    <p className="font-medium text-gray-800">{customer.firstName} {customer.lastName}</p>
                    <p className="text-xs text-gray-500">{customer.email}</p>
                    <p className="text-xs text-gray-500">{customer.mobileNumber}</p>
                  </div>

                  <div className="flex justify-between items-center pt-1 border-t border-gray-50">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        customer.kycStatus === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      KYC: {customer.kycStatus?.toString()}
                    </span>
                    <div className="flex gap-2">
                      <Link
                        to={`${customer.customerId}`}
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-600 transition"
                      >
                        View
                      </Link>
                      <Link
                        to={`edit/${customer.customerId}`}
                        className="bg-amber-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-amber-600 transition"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-50 border-b">
                  <tr className="text-gray-600 uppercase text-xs tracking-wider">
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Customer No</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Mobile</th>
                    <th className="px-4 py-3">KYC</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {customers.map((customer, index) => (
                    <tr
                      key={customer.customerId}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-700">
                        {customer.customerNumber}
                      </td>
                      <td className="px-4 py-3">
                        {customer.firstName} {customer.lastName}
                      </td>
                      <td className="px-4 py-3">{customer.email}</td>
                      <td className="px-4 py-3">{customer.mobileNumber}</td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            customer.kycStatus === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {customer.kycStatus?.toString()}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            customer.active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {customer.active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-4 py-3 flex gap-2">
                        <Link
                          to={`${customer.customerId}`}
                          className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-600 transition"
                        >
                          View
                        </Link>

                        <Link
                          to={`edit/${customer.customerId}`}
                          className="bg-amber-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-amber-600 transition"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerPage;