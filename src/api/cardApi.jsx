import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export const cardApi = createApi({
    reducerPath: "cardApi",
    baseQuery: baseQueryWithReauth("http://localhost:8080"),
    tagTypes: ["Cards"],
    endpoints: (builder) => ({

        issueCard: builder.mutation({
            query: (data) => ({
                url: "/api/cards/issue",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Cards"],
        }),

        getCardsByCustomer: builder.query({
            query: (customerId) => `/api/cards/customer/${customerId}`,
            providesTags: ["Cards"],
        }),

        getAllCards: builder.query({
            query: () => "/api/cards/all",
            providesTags: ["Cards"],
        }),

        blockCard: builder.mutation({
            query: (cardId) => ({
                url: `/api/cards/${cardId}/block`,
                method: "PATCH",
            }),
            invalidatesTags: ["Cards"],
        }),

        activateCard: builder.mutation({
            query: (cardId) => ({
                url: `/api/cards/${cardId}/activate`,
                method: "PATCH",
            }),
            invalidatesTags: ["Cards"],
        }),
    }),
});

export const {
    useIssueCardMutation,
    useGetCardsByCustomerQuery,
    useGetAllCardsQuery,
    useBlockCardMutation,
    useActivateCardMutation,
} = cardApi;