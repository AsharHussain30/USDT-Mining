import {createSlice} from '@reduxjs/toolkit';

const Data = createSlice({
  name: 'Data',
  initialState: [],
  reducers: {
    Disable: (state, action) => {
      const itemInCart = state.find(item => item.id == action.payload.id);
      if (itemInCart) {
        state.push(action.payload);
      }
    },
  },
});

export const {Disable} = Data.actions;
export default Data.reducer;
