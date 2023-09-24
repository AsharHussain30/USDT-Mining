import {createSlice} from '@reduxjs/toolkit';

const FavSlice = createSlice({
  name: 'cart',
  initialState: [],
  reducers: {
    fav: (state, action) => {
      // const itemInCart = state.find(item => item.id == action.payload.id);
      state.push(action.payload);
    },
    removeFav: (state, action) => {
      return state.filter(item => item.id !== action.payload.id);
    },
  },
});

export const {fav, removeFav} = FavSlice.actions;
export default FavSlice.reducer;
