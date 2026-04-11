import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import authReducer from "./auth/authSlice";
import profileReducer from "./profile/profileSlice";
import rootSaga from "./rootSaga";

const saga = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
  },
  middleware: (getDefault) => getDefault({ thunk: false }).concat(saga),
});

saga.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;