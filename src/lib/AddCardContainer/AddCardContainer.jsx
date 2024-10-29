/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { forwardRef, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import AddCardForm from '../AddCardForm/AddCardForm';
import axios from 'axios';
import withQueryClientProvider from '../utils/withQueryClientProvider';
import { useQuery } from '@tanstack/react-query';

const stripePromise = loadStripe(
  'pk_test_51QDvXdBqyGDzzGN5xWvplr3Jyp4Q432jQwZReoA2R2NOGZIJqtJuhDYJHdZfQ4X6ZhAnoUIucnQnueVjocwL3IaV00bNazUiz9'
); // Replace with your actual publishable key

const API_URL = 'http://localhost:3000';

async function fetchStripeClientSecret() {
  const response = await axios.post(API_URL);
  return response?.data;
}

const AddCardContainer = forwardRef(({ submitHandler }, ref) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ['getClientSecret'],
    queryFn: fetchStripeClientSecret,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    console.log('ref', ref);
  }, [ref]);

  if (isLoading) {
    return (
      <>
        <h1>Loading3...</h1>
        {JSON.stringify(data)}
      </>
    );
  }

  if (error) {
    return <h1>Error: {error?.message}</h1>;
  }

  return (
    <>
      <h1>Form Widget</h1>
      {JSON.stringify(data)}
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret: data?.clientSecret,
          paymentMethodCreation: 'manual',
        }}
      >
        <AddCardForm key='add-card-form' ref={ref} onSubmit={submitHandler} />
      </Elements>
    </>
  );
});

export default withQueryClientProvider(AddCardContainer);
