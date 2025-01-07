import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    product: {},
    isProductCreated: false,
    isProductDeleted: false,
    isReviewSubmitted: false,
    isProductUpdated: false,
  },
  reducers: {
    productRequest(state, action) {
      return { ...state, loading: true };
    },
    productSuccess(state, action) {
      return { ...state, loading: false, product: action.payload.product };
    },
    productFail(state, action) {
      return { loading: false, error: action.payload };
    },
    adminProductRequest(state, action) {
      return { loading: true };
    },
    adminProductSuccess(state, action) {
      return { loading: false, products: action.payload.products };
    },
    adminProductFail(state, action) {
      return { loading: false, error: action.payload };
    },
    clearError(state, action) {
      return { ...state, error: null };
    },
    newProductRequest(state, action) {
      return { ...state, loading: true };
    },
    newProductSuccess(state, action) {
      return {
        ...state,
        loading: false,
        product: action.payload.product,
        isProductCreated: true,
      };
    },
    newProductFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
        isProductCreated: false,
      };
    },
    clearProductCreated(state, action) {
      return {
        ...state,
        isProductCreated: false,
      };
    },
    deleteProductRequest(state, action) {
      return { ...state, loading: true };
    },
    deleteProductSuccess(state, action) {
      return { ...state, loading: false, isProductDeleted: true };
    },
    deleteProductFail(state, action) {
      return { ...state, loading: false, error: action.payload };
    },
    clearProductDeleted(state, action) {
      return {
        ...state,
        isProductDeleted: false,
      };
    },
    createReviewRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    createReviewSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isReviewSubmitted: true,
      };
    },
    clearReviewSubmitted(state, action) {
      return {
        ...state,
        isReviewSubmitted: false,
      };
    },
    createReviewFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    clearProduct(state, action) {
      return {
        ...state,
        product: {},
      };
    },
    updateProductRequest(state, action) {
      return { ...state, loading: true };
    },
    updateProductSuccess(state, action) {
      return {
        ...state,
        loading: false,
        product: action.payload.product,
        isProductUpdated: true,
      };
    },
    updateProductFail(state, action) {
      return { ...state, loading: false, error: action.payload };
    },
    clearProductUpdated(state, action) {
      return {
        ...state,
        isProductUpdated: false,
      };
    },
  },
});

const { actions, reducer } = productSlice;

export const {
  productFail,
  productRequest,
  productSuccess,
  adminProductFail,
  adminProductRequest,
  adminProductSuccess,
  clearError,
  newProductRequest,
  newProductSuccess,
  newProductFail,
  clearProductCreated,
  deleteProductRequest,
  deleteProductSuccess,
  deleteProductFail,
  clearProductDeleted,
  createReviewRequest,
  createReviewSuccess,
  createReviewFail,
  clearReviewSubmitted,
  clearProduct,
  updateProductRequest,
  updateProductSuccess,
  updateProductFail,
  clearProductUpdated,
} = actions;

export default reducer;
