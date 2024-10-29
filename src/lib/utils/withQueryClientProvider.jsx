/* eslint-disable react/jsx-key */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/display-name */
import React, { forwardRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

const withQueryClientProvider = (WrappedComponent) => {
  return forwardRef((props, ref) => (
    <QueryClientProvider client={queryClient}>
      <WrappedComponent {...props} ref={ref} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  ));
};

export default withQueryClientProvider;
