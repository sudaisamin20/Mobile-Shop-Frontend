// Redux Products Slice
// Handles products state management

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { IProductsState, IProduct, IPaginatedResponse, IPaginationParams } from '../../interfaces';
import { axiosInstance } from '../../config';

// Async Thunks
export const fetchProducts = createAsyncThunk<
  { products: IProduct[]; total: number },
  IPaginationParams,
  { rejectValue: string }
>('products/fetchProducts', async (params, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<{ data: IPaginatedResponse<IProduct> }>('/products', {
      params,
    });

    return {
      products: response.data.data.data,
      total: response.data.data.total,
    };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to fetch products'
    );
  }
});

export const fetchProductById = createAsyncThunk<
  IProduct,
  string,
  { rejectValue: string }
>('products/fetchProductById', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<{ data: IProduct }>(
      `/products/${id}`
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to fetch product'
    );
  }
});

const initialState: IProductsState = {
  products: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  pageSize: 10,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<{ products: IProduct[]; total: number }>) => {
          state.loading = false;
          state.products = action.payload.products;
          state.total = action.payload.total;
          state.error = null;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products';
      });

    // Fetch Product by ID
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<IProduct>) => {
        state.loading = false;
        const index = state.products.findIndex((p: IProduct) => p.id === action.payload.id);
        if (index === -1) {
          state.products.push(action.payload);
        } else {
          state.products[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch product';
      });
  },
});

export const { setPage, setPageSize, clearError } = productsSlice.actions;
export default productsSlice.reducer;
