import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { authApi } from "../api/authApi";
import { adminApi } from "../api/adminApi";
import { officerApi } from "../api/officerApi";
import { officerCustomerApi } from "../api/officerCustomerApi";
import { loanApi } from "../api/loanApi";
import { accountApi } from "../api/accountApi";
import { transactionApi } from "../api/transactionApi";
import { cardApi } from "../api/cardApi";
import { ticketApi } from "../api/ticketApi";

export const store = configureStore({
    reducer : {
        auth:authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [adminApi.reducerPath]: adminApi.reducer,
        [officerApi.reducerPath]: officerApi.reducer,
        [officerCustomerApi.reducerPath]: officerCustomerApi.reducer,
        [loanApi.reducerPath]: loanApi.reducer,
        [accountApi.reducerPath]: accountApi.reducer,
        [transactionApi.reducerPath]: transactionApi.reducer,
        [cardApi.reducerPath]:   cardApi.reducer,
        [ticketApi.reducerPath]: ticketApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(adminApi.middleware)
            .concat(officerApi.middleware)
            .concat(officerCustomerApi.middleware)
            .concat(loanApi.middleware)
            .concat(accountApi.middleware)
            .concat(transactionApi.middleware)
            .concat(cardApi.middleware)
            .concat(ticketApi.middleware),

});