import { createApi } from "@reduxjs/toolkit/query/react"; // ✅ remove fetchBaseQuery
import { baseQueryWithReauth } from "./baseQueryWithReauth"; // ✅ add this

export const loanApi = createApi({
    reducerPath: "loanApi",
    baseQuery: baseQueryWithReauth("http://localhost:8080"), // ✅ replace fetchBaseQuery
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

        // getAllLoans: builder.query({
        //     query: () => "/api/loans",
        //     providesTags: ["Loans"],
        // }),

        getAllLoans: builder.query({
            query: () => "/api/loans?page=0&size=1000", // ← fetch all, no pagination UI needed
            providesTags: ["Loans"],
        }),

        // getLoanByCustomer: builder.query({
        //     query: (customerId) => `/api/loans/customer/${customerId}`,
        //     providesTags: ["Loans"],
        // }),

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
    useCreateLoanMutation,       // ✅ officer creates + customer applies
    useGetAllLoansQuery,
    useGetLoanByCustomerQuery,
    useApproveLoanMutation,
    useRejectLoanMutation,
} = loanApi;