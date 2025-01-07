import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orderDetail: {},
    userOders: [],
    loading: false,
    adminOrders: [],
    isOrderDeleted: false,
    isOrderUpdated: false,
  },
  reducers: {
    createOrderRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    createOrderSuccess(state, action) {
      return {
        ...state,
        loading: false,
        orderDetail: action.payload.order,
      };
    },
    createOrderFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    clearOrderError(state, action) {
      return {
        ...state,
        error: null,
      };
    },
    clearError(state, action) {
      return {
        ...state,
        error: null,
      };
    },
    userOrdersRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    userOrdersSuccess(state, action) {
      return {
        ...state,
        loading: false,
        userOrders: action.payload.orders,
      };
    },
    userOrdersFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    orderDetailRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    orderDetailSuccess(state, action) {
      return {
        ...state,
        loading: false,
        orderDetail: action.payload.order,
      };
    },
    orderDetailFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    adminOrdersRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    adminOrdersSuccess(state, action) {
      return {
        ...state,
        loading: false,
        adminOrders: action.payload.orders,
      };
    },
    adminOrdersFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    updateOrdersRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    updateOrdersSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isOrderUpdated: true,
      };
    },
    updateOrdersFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    deleteOrdersRequest(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    deleteOrdersSuccess(state, action) {
      return {
        ...state,
        loading: false,
        isOrderDeleted: true,
      };
    },
    deleteOrdersFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    clearOrderDeleted(state, action) {
      return {
        ...state,
        isOrderDeleted: false,
      };
    },
    clearOrderUpdated(state, action) {
      return {
        ...state,
        isOrderUpdated: false,
      };
    },
  },
});

const { actions, reducer } = orderSlice;

export const {
  clearOrderError,
  createOrderRequest,
  createOrderSuccess,
  createOrderFail,
  userOrdersRequest,
  userOrdersSuccess,
  userOrdersFail,
  orderDetailRequest,
  orderDetailSuccess,
  orderDetailFail,
  adminOrdersRequest,
  adminOrdersSuccess,
  adminOrdersFail,
  updateOrdersRequest,
  updateOrdersSuccess,
  updateOrdersFail,
  deleteOrdersRequest,
  deleteOrdersSuccess,
  deleteOrdersFail,
  clearOrderDeleted,
  clearOrderUpdated,
  clearError,
} = actions;

export default reducer;
