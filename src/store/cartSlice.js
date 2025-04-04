import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  totalAmount: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload
      const existingItemIndex = state.items.findIndex(item => item.id === product.id)
      
      if (existingItemIndex !== -1) {
        // Item already exists, update quantity
        state.items[existingItemIndex].quantity += quantity
      } else {
        // Add new item
        state.items.push({
          id: product.id,
          name: product.name,
          price: product.salerate,
          image: product.featuredimage,
          quantity,
        })
      }
      
      // Recalculate total amount
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity, 
        0
      )
    },
    
    removeFromCart: (state, action) => {
      const id = action.payload
      state.items = state.items.filter(item => item.id !== id)
      
      // Recalculate total amount
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity, 
        0
      )
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const itemIndex = state.items.findIndex(item => item.id === id)
      
      if (itemIndex !== -1) {
        state.items[itemIndex].quantity = quantity
      }
      
      // Recalculate total amount
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity, 
        0
      )
    },
    
    clearCart: (state) => {
      state.items = []
      state.totalAmount = 0
    }
  }
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer