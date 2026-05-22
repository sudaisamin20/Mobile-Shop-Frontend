// Products Hooks
// Custom hooks for product operations

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../app/index';
import {
  fetchProducts,
  fetchProductById,
  setPage,
  setPageSize,
  clearError,
} from '../app/slices/productsSlice';
import type { IPaginationParams } from '../interfaces';

export const useProducts = () => {
  const dispatch = useAppDispatch() as any;
  const { products, loading, error, total, page, pageSize } = useAppSelector(
    (state) => state.products
  );

  const getProducts = useCallback(
    (params: IPaginationParams) => {
      return dispatch(fetchProducts(params));
    },
    [dispatch]
  );

  const getProductById = useCallback(
    (id: string) => {
      return dispatch(fetchProductById(id));
    },
    [dispatch]
  );

  const updatePage = useCallback(
    (newPage: number) => {
      dispatch(setPage(newPage));
    },
    [dispatch]
  );

  const updatePageSize = useCallback(
    (newPageSize: number) => {
      dispatch(setPageSize(newPageSize));
    },
    [dispatch]
  );

  const clearErrorMessage = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    products,
    loading,
    error,
    total,
    page,
    pageSize,
    getProducts,
    getProductById,
    updatePage,
    updatePageSize,
    clearErrorMessage,
  };
};

export default useProducts;
