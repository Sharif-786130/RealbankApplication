import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export const transactionApi = createApi({
    reducerPath: "transactionApi",
    // baseQuery: fetchBaseQuery({
    //     baseUrl: "http://localhost:8080/api/transactions",
    //     prepareHeaders: (headers, { getState }) => {
    //         const token = getState().auth.accessToken;
    //         if (token) {
    //             headers.set("Authorization", `Bearer ${token}`);
    //         }
    //         return headers;
    //     },
    // }),
      baseQuery: baseQueryWithReauth("http://localhost:8080/api/transactions"),
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