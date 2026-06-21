import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export const transactionApi = createApi({
    reducerPath: "transactionApi",
 
    baseQuery: baseQueryWithReauth(`${import.meta.env.VITE_API_URL}/api/transactions`),
    endpoints: (builder) => ({
        getTransactionsByCustomer: builder.query({
            query: (customerId) => `/customer/${customerId}`,
        }),
        getTransactionsByAccount: builder.query({
            query: (accountId) => `/account/${accountId}`,
        }),
        transfer: builder.mutation({
            query: (data) => ({
                url: "/transfer",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const {
    useGetTransactionsByCustomerQuery,
    useGetTransactionsByAccountQuery,
    useTransferMutation,
} = transactionApi;