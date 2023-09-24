import {createSlice} from '@reduxjs/toolkit';

const CartSlice = createSlice({
  name: 'cart',
  initialState: [],
  reducers: {
    add: (state, action) => {
      state.push({...action.payload, quantity: 1});
    },
    remove: (state, action) => {
      const updatedCart = state.filter(item => item.id !== action.payload.id);
      return {
        ...state,
        updatedCart,
      };
    },
    increment: (state, action) => {
      const itemInCart = state.find(item => item.id == action.payload.id);
      if (itemInCart) {
        itemInCart.quantity++;
      } else {
        state.push({...action.payload, quantity: 1});
      }
    },
    decrement: (state, action) => {
      const itemInCart = state.find(item => item.id == action.payload.id);
      if (itemInCart) {
        if (itemInCart.quantity == 1) {
          return state.filter(item => item.id != action.payload.id);
        } else {
          itemInCart.quantity--;
        }
      }
    },
  },
});

export const {add, remove, increment, decrement, quantity} = CartSlice.actions;
export default CartSlice.reducer;
