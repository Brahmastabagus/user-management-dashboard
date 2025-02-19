import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getUser = createAsyncThunk("user/getUser", async () => {
  const response = await axios.get(`https://jsonplaceholder.typicode.com/users`)

  return response
})

const userSlice = createSlice({
  name: "user",
  initialState: {
    defaultData: [],
    searchTerm: '',
    status: 'idle',
    error: null
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    addUser: (state, action) => {
      state.defaultData = [...state.defaultData, action.payload];
    },
    deleteUser: (state, action) => {
      state.defaultData = state.defaultData.filter(user => user.id !== action.payload);
    },
    updateUser: (state, action) => {
      const index = state.defaultData.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.defaultData[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.status = 'succes';
        state.defaultData = [
          ...state.defaultData,
          ...action.payload.data.map(rowData => ({
            ...rowData,
            company: `${rowData?.company?.name}, ${rowData?.company?.catchPhrase}, ${rowData?.company?.bs}`
          }))
        ];
      })
      .addCase(getUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
})

// export const userSelector = userEntity.getSelectors(state => state.userSlice)

export const { setSearchTerm, addUser, deleteUser, updateUser } = userSlice.actions
export default userSlice.reducer

