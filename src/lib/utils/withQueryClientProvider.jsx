/* eslint-disable react/jsx-key */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/display-name */
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Initialize the Query Client
const queryClient = new QueryClient();

// Define the HOC
const withQueryClientProvider = (WrappedComponent) => {
  // Return a new component that wraps the WrappedComponent with QueryClientProvider
  return function WithQueryClientProvider(props) {
    return (
      <QueryClientProvider client={queryClient}>
        <WrappedComponent {...props} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    );
  };
};

export default withQueryClientProvider;
