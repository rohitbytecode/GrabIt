# Razorpay Integration Guide

This document provides a complete guide for the Razorpay payment integration in the Grocery Store application.

## Overview

The application now supports two payment methods:
1. **Cash on Delivery (COD)** - Traditional payment method
2. **Online Payment via Razorpay** - Digital payment gateway

## Architecture

### Backend (Node.js/Express)
- **Payment Service**: Handles Razorpay order creation
- **Payment Controller**: Manages payment endpoints and signature verification
- **Order Model**: Extended to store payment method and Razorpay transaction details
- **Order Controller**: Updated to handle both COD and online payments

### Frontend (Angular)
- **Payment Service**: Integrates with Razorpay SDK and backend API
- **Checkout Component**: Provides UI for payment method selection and order processing
- **Razorpay Script**: Loaded from CDN in `index.html`

## Setup Instructions

### 1. Backend Setup

#### Environment Variables
Add the following to your `.env` file:

```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

**How to get these credentials:**
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Login with your account
3. Navigate to **Settings** → **API Keys**
4. Copy your **Key ID** (public key) and **Key Secret** (private key)
5. Add them to your `.env` file

#### Verify Dependencies
Make sure you have the `crypto` module (built-in Node.js module). The payment controller uses it for signature verification.

### 2. Frontend Setup

The frontend is already configured with:
- Razorpay script loaded in `index.html`
- Payment service for API communication
- Updated checkout component with payment method selection

**No additional setup needed** - the application will automatically fetch the Razorpay key from the backend.

## How It Works

### Payment Flow

#### Cash on Delivery (COD)
```
User selects "Cash on Delivery"
    ↓
Enters delivery address
    ↓
Clicks "Place Order"
    ↓
Order created with status='pending'
    ↓
Success message shown
```

#### Online Payment (Razorpay)
```
User selects "Online Payment (Razorpay)"
    ↓
Enters name, email, and delivery address
    ↓
Clicks "Proceed to Payment"
    ↓
POST /api/payment/create-payment (amount)
    ↓
Backend creates Razorpay order (amount converted to paise)
    ↓
Backend returns order details + Razorpay key
    ↓
Razorpay payment modal opens
    ↓
User completes payment
    ↓
Razorpay returns: payment_id, order_id, signature
    ↓
POST /api/orders (with payment details)
    ↓
Backend creates order with status='processing'
    ↓
Success message shown
```

### Key Components

#### Backend Files Modified/Created:

1. **`src/config/razorpay.js`** - Razorpay instance configuration
2. **`src/controllers/payment.controller.js`** - Payment endpoints
   - `createPaymentOrder()` - Creates order and returns key
   - `verifyPayment()` - Verifies payment signature
3. **`src/routes/payment.routes.js`** - Payment API routes
4. **`src/services/payment.service.js`** - Razorpay order creation logic
5. **`src/models/Order.js`** - Extended with payment fields
6. **`src/controllers/orderController.js`** - Updated to handle online payments

#### Frontend Files Modified/Created:

1. **`src/index.html`** - Added Razorpay script tag
2. **`src/app/core/services/payment.service.ts`** - Payment service
3. **`src/app/client/pages/checkout/checkout.component.ts`** - Updated component logic
4. **`src/app/client/pages/checkout/checkout.component.html`** - Updated UI
5. **`src/app/client/pages/checkout/checkout.component.scss`** - Added styles
6. **`src/app/shared/shared.module.ts`** - Added MatRadioModule

## API Endpoints

### Create Payment Order
**POST** `/api/payment/create-payment`

**Request:**
```json
{
  "amount": 500
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "order_123abc",
    "entity": "order",
    "amount": 50000,
    "currency": "INR",
    "status": "created",
    "receipt": "receipt_1234567890"
  },
  "keyId": "razorpay_key_id"
}
```

### Verify Payment
**POST** `/api/payment/verify-payment`

**Request:**
```json
{
  "razorpay_order_id": "order_123abc",
  "razorpay_payment_id": "pay_123xyz",
  "razorpay_signature": "signature_hash"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "verified": true
}
```

### Create Order
**POST** `/api/orders`

**For COD:**
```json
{
  "items": [...],
  "total": 500,
  "deliveryAddress": "123 Main St, City, State 12345",
  "paymentMethod": "cod"
}
```

**For Online Payment:**
```json
{
  "items": [...],
  "total": 500,
  "deliveryAddress": "123 Main St, City, State 12345",
  "paymentMethod": "online",
  "razorpayOrderId": "order_123abc",
  "razorpayPaymentId": "pay_123xyz",
  "razorpaySignature": "signature_hash"
}
```

## Testing

### Test Cards
Use these test card numbers provided by Razorpay:

**Successful Payment:**
- Card Number: `4111111111111111`
- Expiry: Any future date
- CVV: Any 3 digits
- OTP: Any 6 digits

**Failed Payment:**
- Card Number: `4444444444444002`
- Expiry: Any future date
- CVV: Any 3 digits

### Test Mode
Your Razorpay account is in test mode by default. Switch to Live mode in the dashboard when you're ready for production.

## Error Handling

The application handles the following scenarios:

1. **Empty Cart**: User cannot proceed without items
2. **Incomplete Address**: Address fields are required
3. **Online Payment - Missing Info**: Email and name are required
4. **Payment Creation Failed**: Shows error and allows retry
5. **Payment Modal Closed**: User-friendly error message
6. **Order Creation Failed**: Informs user despite successful payment
7. **Network Errors**: Displayed via snack bar notifications

## Security Considerations

1. **Signature Verification**: Backend verifies Razorpay signature using the secret key
2. **Public Key Only**: Razorpay public key is sent from backend (not hardcoded in frontend)
3. **HTTPS Only**: Always use HTTPS in production
4. **Never Expose Secret**: Keep `RAZORPAY_KEY_SECRET` only on the backend
5. **Amount Validation**: Backend validates amount before creating order

## Troubleshooting

### Issue: "Razorpay script not loaded"
- Ensure internet connection
- Check browser console for network errors
- Verify CDN script URL in `index.html` is correct

### Issue: "Razorpay key not available"
- Verify `RAZORPAY_KEY_ID` is set in `.env`
- Check if payment service is returning the key
- Ensure backend is running

### Issue: "Payment verification failed"
- Verify `RAZORPAY_KEY_SECRET` is correct in `.env`
- Check that signature matches (case-sensitive)
- Ensure order ID is correct

### Issue: "Order creation failed after payment"
- Verify all required fields in request body
- Check order validation in backend
- Review error logs in backend console

## Testing the Integration

1. Start the backend server
2. Start the frontend development server
3. Navigate to the checkout page
4. Add items to cart
5. Test COD flow:
   - Select "Cash on Delivery"
   - Enter delivery address
   - Click "Place Order"
6. Test Online Payment flow:
   - Select "Online Payment (Razorpay)"
   - Enter name, email, and delivery address
   - Click "Proceed to Payment"
   - Use test card from Razorpay
   - Complete payment
   - Verify order is created

## Production Notes

1. Switch Razorpay account from Test to Live mode
2. Update API endpoint from test to live
3. Use valid SSL certificate (HTTPS)
4. Add proper error logging and monitoring
5. Implement webhook handling for failed payments (optional)
6. Implement refund functionality (optional)
7. Add payment receipt email functionality (optional)

## Future Enhancements

1. **Webhook Support**: Handle payment failures and cancellations
2. **Refund Management**: Allow admin to process refunds
3. **Payment History**: Show detailed payment information
4. **Multiple Payment Methods**: Add more payment gateways
5. **Payment Analytics**: Track payment success rates and metrics
6. **Email Receipts**: Send payment confirmation emails
7. **Invoice Generation**: Create PDF invoices for orders

## Support

For Razorpay documentation and support:
- Official Docs: https://razorpay.com/docs/
- Integration Guides: https://razorpay.com/docs/payments/
- Support: support@razorpay.com
