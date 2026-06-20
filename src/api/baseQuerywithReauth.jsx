// import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { setCredentials, logout } from "../app/authSlice";

// // Step 1: The raw base query — just adds the auth token to every request
// const rawBaseQuery = (baseUrl) =>
//     fetchBaseQuery({
//         baseUrl,
//         credentials: "include", // ← sends the HttpOnly refresh cookie automatically
//         prepareHeaders: (headers, { getState }) => {
//             const token = getState().auth.accessToken;
//             if (token) {
//                 headers.set("Authorization", `Bearer ${token}`);
//             }
//             return headers;
//         },
//     });

// // Step 2: The wrapper that handles 401 by calling /auth/refresh
// export const baseQueryWithReauth = (baseUrl) => async (args, api, extraOptions) => {
    
//     // First attempt — run the original request
//     let result = await rawBaseQuery(baseUrl)(args, api, extraOptions);

//     // If we got a 401 (Unauthorized / token expired)
//     if (result?.error?.status === 401) {
//         console.log("Access token expired — attempting refresh...");

//         // Call /auth/refresh — the HttpOnly cookie is sent automatically
//         // because we have credentials:"include" in rawBaseQuery
//         const refreshResult = await rawBaseQuery("http://localhost:8080")(
//             { url: "/auth/refresh", method: "POST" },
//             api,
//             extraOptions
//         );

//         if (refreshResult?.data) {
//             // Refresh succeeded — save the new access token in Redux + localStorage
//             const { accessToken, role, customerId, passwordResetRequired } =
//                 refreshResult.data;

//             api.dispatch(
//                 setCredentials({
//                     accessToken,
//                     role,
//                     customerId,
//                     passwordResetRequired,
//                 })
//             );

//             // Retry the original request with the new token
//             result = await rawBaseQuery(baseUrl)(args, api, extraOptions);
//         } else {
//             // Refresh also failed — session is dead, force logout
//             console.log("Refresh token also expired — logging out");
//             api.dispatch(logout());
//         }
//     }

//     return result;
// };

import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setAccessToken, logout } from "../app/authSlice";

// Step 1: The raw base query — just adds the auth token to every request
const rawBaseQuery = (baseUrl) =>
    fetchBaseQuery({
        baseUrl,
        credentials: "include", // ← sends the HttpOnly refresh cookie automatically
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.accessToken;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    });

// Step 2: The wrapper that handles 401 by calling /auth/refresh
export const baseQueryWithReauth = (baseUrl) => async (args, api, extraOptions) => {

    // First attempt — run the original request
    let result = await rawBaseQuery(baseUrl)(args, api, extraOptions);

    // If we got a 401 (Unauthorized / token expired)
    if (result?.error?.status === 401) {
        console.log("Access token expired — attempting refresh...");

        // Call /auth/refresh — the HttpOnly cookie is sent automatically
        // because we have credentials:"include" in rawBaseQuery
        const refreshResult = await rawBaseQuery("http://localhost:8080")(
            { url: "/auth/refresh", method: "POST" },
            api,
            extraOptions
        );

        if (refreshResult?.data) {
            // Refresh succeeded — save ONLY the new access token.
            // Do NOT touch role/customerId/passwordResetRequired here —
            // /auth/refresh typically doesn't return them, and overwriting
            // them with undefined was what caused the forced logout.
            const { accessToken } = refreshResult.data;

            api.dispatch(setAccessToken({ accessToken }));

            // Retry the original request with the new token
            result = await rawBaseQuery(baseUrl)(args, api, extraOptions);
        } else {
            // Refresh also failed — session is dead, force logout
            console.log("Refresh token also expired — logging out");
            api.dispatch(logout());
        }
    }

    return result;
};