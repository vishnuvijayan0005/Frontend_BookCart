import {configureStore} from "@reduxjs/toolkit";

import authReducer from "@/store/slice/authSlice/authSlice"
import booksReducer from  "@/store/slice/bookSlice/bookSlice"
export const store =configureStore({
    reducer:{
        auth:authReducer,
        books:booksReducer, 
    },
})
export type RootState=ReturnType<typeof store.getState>
export type AppDispatch=typeof store.dispatch;