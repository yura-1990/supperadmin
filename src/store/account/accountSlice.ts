import { createSlice } from "@reduxjs/toolkit";
import { IAccount } from "../../types";

const initialState: IAccount = {
  token: null,
  notifcs: 0,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    updateAccount: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    clearAccount: () => {
      return initialState;
    },
  },
});

export const { clearAccount, updateAccount } = accountSlice.actions;
export default accountSlice.reducer;
