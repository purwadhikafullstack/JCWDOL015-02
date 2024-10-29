import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ReportState {
  data: any[];
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
  },
});

export const { setReportData } = reportSlice.actions;
export default reportSlice.reducer;
