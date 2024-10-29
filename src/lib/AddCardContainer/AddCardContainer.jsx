/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { forwardRef, useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import AddCardForm from '../AddCardForm/AddCardForm';
import axios from 'axios';

const stripePromise = loadStripe(
  'pk_test_51QDvXdBqyGDzzGN5xWvplr3Jyp4Q432jQwZReoA2R2NOGZIJqtJuhDYJHdZfQ4X6ZhAnoUIucnQnueVjocwL3IaV00bNazUiz9'
); // Replace with your actual publishable key

const AddCardContainer = forwardRef(({ submitHandler }, ref) => {
  const [secret, setSecret] = useState(null);

  useEffect(() => {
    axios
      .post('http://localhost:3000')
      .then((response) => {
        console.log(response);
        setSecret(response.data.clientSecret);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    console.log('ref', ref);
  }, [ref]);

  if (!secret) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <h1>Form Widget</h1>
      <Elements
        stripe={stripePromise}
        options={{ clientSecret: secret, paymentMethodCreation: 'manual' }}
      >
        <AddCardForm key='add-card-form' ref={ref} onSubmit={submitHandler} />
      </Elements>
    </>
  );
});

export default AddCardContainer;
