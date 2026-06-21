import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export const ticketApi = createApi({
    reducerPath: "ticketApi",
  baseQuery: baseQueryWithReauth(import.meta.env.VITE_API_URL),
    tagTypes: ["Tickets"],
    endpoints: (builder) => ({

        raiseTicket: builder.mutation({
            query: (data) => ({
                url: "/api/tickets/raise",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Tickets"],
        }),

        getMyTickets: builder.query({
            query: (customerId) => `/api/tickets/customer/${customerId}`,
            providesTags: ["Tickets"],
        }),

        getOpenTickets: builder.query({
            query: () => "/api/tickets/open",
            providesTags: ["Tickets"],
        }),

        getAllTickets: builder.query({
            query: () => "/api/tickets/all",
            providesTags: ["Tickets"],
        }),

        resolveTicket: builder.mutation({
            query: ({ ticketId, resolution }) => ({
                url: `/api/tickets/${ticketId}/resolve`,
                method: "PATCH",
                body: { resolution },
            }),
            invalidatesTags: ["Tickets"],
        }),
    }),
});

export const {
    useRaiseTicketMutation,
    useGetMyTicketsQuery,
    useGetOpenTicketsQuery,
    useGetAllTicketsQuery,
    useResolveTicketMutation,
} = ticketApi;