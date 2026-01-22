import axios from '../../../utils/axios';
import { filter, map } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';

const API_URL = '/users/allmetersfrmcustomer';

const initialState = {
  products: [],
  productSearch: '',
  sortBy: 'newest',
  cart: [],
  total: 0,
  filters: {
    category: 'All',
    color: 'All',
    gender: 'All',
    price: 'All',
    rating: '',
  },
  error: ''
};

export const MeterSlice = createSlice({
  name: 'ecommerce',
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.error = action.payload;
    },
    // GET PRODUCTS
    getProducts: (state, action) => {
      state.products = action.payload;
    },
    SearchProduct: (state, action) => {
      state.productSearch = action.payload;
    },
    setVisibilityFilter: (state, action) => {
      state.currentFilter = action.payload;
    },
    //  SORT  PRODUCTS
    sortByProducts(state, action) {
      state.sortBy = action.payload;
    },
    //  SORT  PRODUCTS
    sortByGender(state, action) {
      state.filters.gender = action.payload.gender;
    },
    //  SORT  By Color
    sortByColor(state, action) {
      state.filters.color = action.payload.color;
    },
    //  SORT  By Color
    sortByPrice(state, action) {
      state.filters.price = action.payload.price;
    },
    //  FILTER PRODUCTS
    filterProducts(state, action) {
      state.filters.category = action.payload.category;
    },
    //  FILTER Reset
    filterReset(state) {
      state.filters.category = 'All';
      state.filters.color = 'All';
      state.filters.gender = 'All';
      state.filters.price = 'All';
      state.sortBy = 'newest';
    },
    // ADD TO CART
    addToCart(state, action) {
      const product = action.payload;
      state.cart = [...state.cart, product];
    },
    // qty increment
    increment(state, action) {
      const productId = action.payload;
      const updateCart = map(state.cart, (product) => {
        if (product.id === productId) {
          return {
            ...product,
            qty: product.qty + 1,
          };
        }
        return product;
      });

      state.cart = updateCart;
    },
    // qty decrement
    decrement(state, action) {
      const productId = action.payload;
      const updateCart = map(state.cart, (product) => {
        if (product.id === productId) {
          return {
            ...product,
            qty: product.qty - 1,
          };
        }
        return product;
      });

      state.cart = updateCart;
    },
    // delete Cart
    deleteCart(state, action) {
      const updateCart = filter(state.cart, (item) => item.id !== action.payload);
      state.cart = updateCart;
    },
  },
});
export const {
  hasError,
  getProducts,
  SearchProduct,
  setVisibilityFilter,
  sortByProducts,
  filterProducts,
  sortByGender,
  increment,
  deleteCart,
  decrement,
  addToCart,
  sortByPrice,
  filterReset,
  sortByColor,
} = MeterSlice.actions;


export const fetchMeter = () => async (dispatch) => {
  const controller = new AbortController();

  try {
    // Build formData from localStorage safely inside the thunk
    const rawAuthorityId = localStorage.getItem('datauserauthid');
    const rawGroupId = localStorage.getItem('datauserauthlevel');

    const formData = {
      AuthorityID: rawAuthorityId !== null ? (isNaN(Number(rawAuthorityId)) ? rawAuthorityId : Number(rawAuthorityId)) : null,
      GroupID: rawGroupId !== null ? (isNaN(Number(rawGroupId)) ? rawGroupId : Number(rawGroupId)) : null
    };

    // If your backend expects POST, use post:
    const response = await axios.post(API_URL, formData, { signal: controller.signal });

    // If backend expects GET with params instead, use:
    // const response = await axios.get(API_URL, { params: formData, signal: controller.signal });

    dispatch(getProducts(response?.data?.message || []));
  } catch (error) {
    // Distinguish abort vs real error
    if (error?.name === 'CanceledError' || error?.message === 'canceled') {
      // request was aborted — do nothing (or dispatch a specific action if you want)
      return;
    }
    dispatch(hasError(error?.message || 'Unknown error'));
  }

  // Note: returning the controller allows the caller to cancel if desired:
  return () => controller.abort();
};

export default MeterSlice.reducer;
