// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     accessToken: localStorage.getItem("token") || null,
//     customerId: localStorage.getItem("customerId") || null,
//     role: localStorage.getItem("role") || null,
//     passwordResetRequired: false,
// };

// const authSlice = createSlice({
//     name: "auth",
//     initialState,
//     reducers: {
//         setCredentials: (state, action) => {
//             // const role = action.payload.role.replace("ROLE_", "");

//             const role = action.payload.role;

//             state.accessToken = action.payload.accessToken;
//             state.role = action.payload.role;
//             state.customerId = action.payload.customerId || null;
//             state.passwordResetRequired = action.payload.passwordResetRequired;

//             // ✅ persist
//             localStorage.setItem("token", action.payload.accessToken);
//             localStorage.setItem("role", action.payload.role);
//             localStorage.setItem("customerId", action.payload.customerId || "");
//         },

//         logout: (state) => {
//             state.accessToken = null;
//             state.role = null;
//             state.customerId = null;
//             state.passwordResetRequired = false;

//             // ✅ remove
//             localStorage.removeItem("token");
//             localStorage.removeItem("role");
//             localStorage.removeItem("customerId");
//         },
//     },
// });

// export const { setCredentials, logout } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    accessToken: localStorage.getItem("token") || null,
    customerId: localStorage.getItem("customerId") || null,
    role: localStorage.getItem("role") || null,
    passwordResetRequired: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            // const role = action.payload.role.replace("ROLE_", "");

            const role = action.payload.role;

            state.accessToken = action.payload.accessToken;
            state.role = action.payload.role;
            state.customerId = action.payload.customerId || null;
            state.passwordResetRequired = action.payload.passwordResetRequired;

            // ✅ persist
            localStorage.setItem("token", action.payload.accessToken);
            localStorage.setItem("role", action.payload.role);
            localStorage.setItem("customerId", action.payload.customerId || "");
        },

        // ✅ NEW — used only for silent token refresh.
        // Only touches the access token — role/customerId/passwordResetRequired
        // are left exactly as they were from the original login.
        setAccessToken: (state, action) => {
            state.accessToken = action.payload.accessToken;
            localStorage.setItem("token", action.payload.accessToken);
        },

        logout: (state) => {
            state.accessToken = null;
            state.role = null;
            state.customerId = null;
            state.passwordResetRequired = false;

            // ✅ remove
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("customerId");
        },
    },
});

export const { setCredentials, setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;