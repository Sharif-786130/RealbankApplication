import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export const officerApi = createApi({
    reducerPath: "officerApi",
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
  baseQuery: baseQueryWithReauth(import.meta.env.VITE_API_URL),
    tagTypes: ["Officer"],

    endpoints: (builder) => ({
        // Admin view — branch officers
        getOfficer: builder.query({
            query: () => "/admin/getallofficers",
            providesTags: ["Officer"]
        }),

        // Super Admin view — all officers system-wide
        getAllOfficersSuperAdmin: builder.query({
            query: () => "/super-admin/officers",
            providesTags: ["Officer"]
        }),

        createOfficer: builder.mutation({
            query: (data) => ({
                url: "/admin/officers",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Officer"]
        }),
        updateOfficer: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/admin/officers/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Officer"],
        }),

        deleteOfficer: builder.mutation({
            query: (id) => ({
                url: `/admin/officers/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Officer"]
        }),
    }),
});

export const {
    useGetOfficerQuery,
    useGetAllOfficersSuperAdminQuery,
    useCreateOfficerMutation,
    useUpdateOfficerMutation,
    useDeleteOfficerMutation,
} = officerApi;