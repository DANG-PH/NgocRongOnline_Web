import { call, put, takeLatest } from "redux-saga/effects";
import {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFail,
} from "./profileSlice";

const refreshAccessToken = async (refreshToken: string) => {
  const res = await fetch("/api/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  const data = await res.json();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  currentUser.access_token = data.access_token;
  currentUser.refresh_token = data.refresh_token;
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  return data.access_token;
};

const fetchProfileApi = async (authId: string, accessToken: string) => {
  const res = await fetch(`/api/profile/${authId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res;
};

function* handleFetchProfile(action: any): any {
  try {
    const stored = localStorage.getItem("currentUser");
    if (!stored) {
      yield put(fetchProfileFail("Chưa đăng nhập"));
      return;
    }

    const userData = JSON.parse(stored);
    const authId = userData.auth_id;
    let accessToken = userData.access_token;
    const refreshToken = userData.refresh_token;
    const username = userData.username;

    let res = yield call(fetchProfileApi, authId, accessToken);

    if (res.status === 401 && refreshToken) {
      accessToken = yield call(refreshAccessToken, refreshToken);
      res = yield call(fetchProfileApi, authId, accessToken);
    }

    if (!res.ok) {
      const data = yield call([res, res.json]);
      yield put(fetchProfileFail("Lấy thông tin thất bại"));
      return;
    }

    const data = yield call([res, res.json]);
    if (data.user) {
      // Bổ sung username từ localstorage nếu api không trả về
      const profileData = { ...data.user, username: username || data.user.username };
      yield put(fetchProfileSuccess(profileData));
    } else {
      yield put(fetchProfileFail("Không tìm thấy thông tin user"));
    }
  } catch (err: any) {
    yield put(fetchProfileFail(err.message));
  }
}

export default function* profileSaga() {
  yield takeLatest(fetchProfileStart.type, handleFetchProfile);
}
