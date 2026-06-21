import { createApi } from "@reduxjs/toolkit/query/react"; // 
import { baseQueryWithReauth } from "./baseQueryWithReauth"; // 

export const loanApi = createApi({
    reducerPath: "loanApi",
  baseQuery: baseQueryWithReauth(import.meta.env.VITE_API_URL),
    tagTypes: ["Loans"],
    endpoints: (builder) => ({

        createLoan: builder.mutation({
            query: (data) => ({
                url: "/api/loans",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Loans"],
        }),


        getAllLoans: builder.query({
            query: () => "/api/loans?page=0&size=1000", 
            providesTags: ["Loans"],
        }),


        getLoanByCustomer: builder.query({
            query: (customerId) => `/api/loans/customer/${customerId}?page=0&size=1000`, // ← same
            providesTags: ["Loans"],
        }),

        approveLoan: builder.mutation({
            query: (loanId) => ({
                url: `/api/loans/${loanId}/approve`,
                method: "PUT",
            }),
            invalidatesTags: ["Loans"],
        }),

        rejectLoan: builder.mutation({
            query: (loanId) => ({
                url: `/api/loans/${loanId}/reject`,
                method: "PUT",
            }),
            invalidatesTags: ["Loans"],
        }),

    }),
});

export const {
    useCreateLoanMutation,       
    useGetAllLoansQuery,
    useGetLoanByCustomerQuery,
    useApproveLoanMutation,
    useRejectLoanMutation,
} = loanApi;