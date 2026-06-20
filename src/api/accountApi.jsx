import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export const accountApi = createApi({
  reducerPath: "accountApi",

  // baseQuery: fetchBaseQuery({
  //   baseUrl: "http://localhost:8080/api/account",

  //   prepareHeaders: (headers, { getState }) => {
  //     const token = getState().auth.accessToken;

  //     if (token) {
  //       headers.set("Authorization", `Bearer ${token}`);
  //     }

  //     return headers;
  //   },
  // }),
  baseQuery: baseQueryWithReauth("http://localhost:8080/api/account"),
  tagTypes: ["Accounts"],
  endpoints: (builder) => ({

    //Create Account
    createAccount: builder.mutation({
      query: (data) => ({
        // url: "/api/account/create",
        url: "/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Account"],
    }),

    //Get All Accounts
    getAllAccounts: builder.query({
      query: () => "",
      providesTags: ["Account"],
    }),


    getAccountByCustomer: builder.query({
      // query: (customerId) => `/api/account/customer/${customerId}`,
      query: (customerId) => `/customer/${customerId}`,
    }),

    getAccountById: builder.query({
      // query: (id) => `/api/account/${id}`,
      query: (id) => `/${id}`,
    }),
    // add inside endpoints
    deposit: builder.mutation({
      query: ({ accountId, amount, description }) => ({
           url: `/${accountId}/deposit`,
        method: "POST",
        body: { amount, description },
      }),
      invalidatesTags: ["Accounts"],
    }),

    withdraw: builder.mutation({
      query: ({ accountId, amount, description }) => ({
        url: `/${accountId}/withdraw`,
        method: "POST",
        body: { amount, description },
      }),
      invalidatesTags: ["Accounts"],
    }),
  }),
});

export const {
  useCreateAccountMutation,
  useGetAllAccountsQuery,
  useGetAccountByCustomerQuery,
  useGetAccountByIdQuery,
  useDepositMutation,
  useWithdrawMutation,
} = accountApi;