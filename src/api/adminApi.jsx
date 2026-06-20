import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export const adminApi = createApi({
    reducerPath: "adminApi",
    // baseQuery: fetchBaseQuery({
    //     baseUrl: "http://localhost:8080",
    //     prepareHeaders: (headers, { getState }) => {
    //         const token = getState().auth.accessToken;

    //         console.log("TOKEN FROM STORE:",token);

    //         if(token) {
    //             headers.set("Authorization", `Bearer ${token}`);
    //         }
    //         return headers;
    //     },
    // }),
    baseQuery: baseQueryWithReauth("http://localhost:8080"),
    tagTypes: ["Admin", "AdminAccounts", "AdminCustomers"],
    endpoints: (builder) => ({
        getAdmins: builder.query({
            query: () => "/super-admin/admins",
            providesTags: ["Admin"],
        }),

        createAdmin: builder.mutation({
            query: (data) => ({
                url: "/super-admin",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Admin"],
        }),
        // updateAdmin:builder.mutation({
        //     query: ({ id, ...data }) => ({
        //         url: `/super-admin/`
        //     })
        // }),
        // add inside endpoints in adminApi.jsx
        getAllAccountsAdmin: builder.query({
            query: () => "/admin/accounts",
            providesTags: ["AdminAccounts"],
        }),

        updateAccountStatus: builder.mutation({
            query: ({ accountId, status }) => ({
                url: `/admin/accounts/${accountId}/status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["AdminAccounts"],
        }),
        deleteAdmin: builder.mutation({
            query: (id) => ({
                url: `/super-admin/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Admin"],
        }),

        // add inside endpoints
        verifyKyc: builder.mutation({
            query: ({ customerId, status }) => ({
                url: `/admin/customers/${customerId}/kyc?status=${status}`,
                method: "PUT",
            }),
            invalidatesTags: ["AdminCustomers"],
        }),

        getAllCustomersAdmin: builder.query({
            query: () => "/admin/customers",
            providesTags: ["AdminCustomers"],
        }),
    }),
});

export const {
    useCreateAdminMutation,
    useGetAdminsQuery,
    useDeleteAdminMutation,
    useGetAllAccountsAdminQuery,
    useUpdateAccountStatusMutation,
    useVerifyKycMutation,
    useGetAllCustomersAdminQuery,
} = adminApi;