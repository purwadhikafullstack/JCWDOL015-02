import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ReportState {
  data: any[]; // Ganti dengan tipe data yang sesuai
}

const initialState: ReportState = {
  data: [],
};

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    setReportData(state, action: PayloadAction<any[]>) {
      state.data = action.payload;
    },
    // Tambahkan reducer lain jika diperlukan
  },
});

export const { setReportData } = reportSlice.actions;
export default reportSlice.reducer;
