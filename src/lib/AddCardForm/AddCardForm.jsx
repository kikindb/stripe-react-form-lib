/* eslint-disable react/display-name */
/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

// your-library/AddCardForm.js
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Formik, Form } from 'formik';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import * as Yup from 'yup';
import './AddCardForm.css'; // Import the CSS file for styling

// Validation schema
const validationSchema = Yup.object().shape({
  cardDetails: Yup.string().required('Card details are required'),
});

const AddCardForm = forwardRef(({ onSubmit }, ref) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage('');

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }
    elements.submit();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      elements,
      params: {
        billing_details: {
          address: {
            country: 'US',
          },
          name: 'John Doe',
        },
      },
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
    } else {
      onSubmit(paymentMethod);
    }
  };

  // Expose submitForm function to parent via ref
  useImperativeHandle(ref, () => ({
    submitForm: handleSubmit,
  }));

  // Night theme styles for CardElement
  const cardElementOptions = {
    theme: 'stripe',
  };

  return (
    <Formik
      initialValues={{ cardDetails: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form
          className='add-card-form'
          name='add-card-form'
          onSubmit={console.log('Form onSubmit')}
        >
          <h2 className='form-title'>Add Your Payment Method</h2>
          <div className='card-element-container'>
            <PaymentElement options={cardElementOptions} />
            {errorMessage && (
              <div className='error-message'>{errorMessage}</div>
            )}
          </div>
          {/* The button will be handled in the ParentComponent, so it is removed from here */}
        </Form>
      )}
    </Formik>
  );
});

export default AddCardForm;
