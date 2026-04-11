import { all } from "redux-saga/effects";
import authSaga from "./auth/authSaga";
import profileSaga from "./profile/profileSaga";

export default function* rootSaga() {
  yield all([authSaga(), profileSaga()]);
}