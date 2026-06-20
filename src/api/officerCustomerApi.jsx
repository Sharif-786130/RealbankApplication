import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export const officerCustomerApi = createApi({
    reducerPath: "officerCustomerApi",
    // baseQuery: fetchBaseQuery({
    //     baseUrl: "http://localhost:8080",
    //     prepareHeaders: (headers, { getState }) => {
    //         const token = getState().auth.accessToken;
    //         if (token) {
    //             headers.set("Authorization", `Bearer ${token}`);
    //         }
    //         return headers;
    //     },
    // }),

    baseQuery: baseQueryWithReauth("http://localhost:8080"),
    tagTypes: ["OfficerCustomer"],
    endpoints: (builder) => ({
        createOfficerCustomer: builder.mutation({
            query: (data) => ({
                url: "/api/officer/customers",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["OfficerCustomer"],
        }),

        // Officer view — branch customers
        getCustomers: builder.query({
            query: () => "/api/officer/customers",
            providesTags: ["OfficerCustomer"],
        }),

        // Super Admin view — all customers system-wide
        getAllCustomersSuperAdmin: builder.query({
            query: () => "/super-admin/customers",
            providesTags: ["OfficerCustomer"],
        }),

        getCustomerById: builder.query({
            query: (id) => `/api/officer/customers/${id}`,
        }),

        updateOfficerCustomer: builder.mutation({
            query: ({ id, data }) => ({
                url: `/api/officer/customers/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["OfficerCustomer"],
        }),

        getAccountByCustomer: builder.query({
            query: (customerId) =>
                `/api/account/customer/${customerId}`,
        }),

        getTransactionsByAccount: builder.query({
            query: (accountId) =>
                `/api/account/${accountId}/transactions`,
        }),

        getTransactionByCustomer: builder.query({
            query: (customerId) =>
                `/api/account/customer/${customerId}/transactions`,
        }),

    }),
});

export const {
    useCreateOfficerCustomerMutation,
    useGetCustomersQuery,
    useGetAllCustomersSuperAdminQuery,
    useGetCustomerByIdQuery,
    useUpdateOfficerCustomerMutation,
    useGetAccountByCustomerQuery,
    useGetTransactionsByAccountQuery,
    useGetTransactionByCustomerQuery,
} = officerCustomerApi;