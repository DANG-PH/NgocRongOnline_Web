import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserData {
  danhSachVatPhamWeb: any[];
  id: number;
  vang: { low: number; high: number; unsigned: boolean };
  ngoc: { low: number; high: number; unsigned: boolean };
  sucManh: { low: number; high: number; unsigned: boolean };
  vangNapTuWeb: { low: number; high: number; unsigned: boolean };
  ngocNapTuWeb: { low: number; high: number; unsigned: boolean };
  x: number;
  y: number;
  mapHienTai: string;
  daVaoTaiKhoanLanDau: boolean;
  coDeTu: boolean;
  auth_id: number;
  username?: string;
}

interface ProfileState {
  data: UserData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  data: null,
  loading: true,
  error: null,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    fetchProfileStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProfileSuccess: (state, action: PayloadAction<UserData>) => {
      state.loading = false;
      state.data = action.payload;
    },
    fetchProfileFail: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearProfile: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    }
  },
});

export const {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFail,
  clearProfile
} = profileSlice.actions;

export default profileSlice.reducer;
