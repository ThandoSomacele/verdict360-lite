# Stripe Testing Guide for Verdict 360

## 🧪 Test Environment Setup

Your Verdict 360 system is now configured with Stripe's test environment for South African Rand (ZAR) payments.

### Test API Keys (Already Configured)
```
Secret Key: sk_test_[use_stripe_test_secret_key]
Publishable Key: pk_test_[use_stripe_test_publishable_key]
Webhook Secret: whsec_[use_stripe_webhook_secret]
```

## 💳 Test Card Numbers

### Successful Payments
- **Visa:** `4242 4242 4242 4242`
- **Visa (debit):** `4000 0566 5566 5556`
- **Mastercard:** `5555 5555 5555 4444`
- **American Express:** `3782 822463 10005`

### Failed Payments
- **Generic decline:** `4000 0000 0000 0002`
- **Insufficient funds:** `4000 0000 0000 9995`
- **Lost card:** `4000 0000 0000 9987`
- **Stolen card:** `4000 0000 0000 9979`

### Special Scenarios
- **3D Secure authentication:** `4000 0027 6000 3184`
- **Requires 3D Secure:** `4000 0000 0000 3220`

### Card Details for Testing
- **Expiry:** Any valid future date (e.g., 12/34)
- **CVC:** Any 3 digits (e.g., 123)
- **ZIP/Postal Code:** Any valid code

## 🇿🇦 South African Pricing Plans

Your system supports these ZAR amounts:
- **Basic Plan:** R299.00 per month
- **Pro Plan:** R599.00 per month  
- **Enterprise Plan:** R1,299.00 per month

## 🚀 Testing Your Integration

### 1. Test Pricing Plans
```bash
curl http://localhost:3000/api/billing/plans
```

### 2. Test Checkout Flow
1. Register a tenant account
2. Login to dashboard
3. Navigate to billing section
4. Select a plan
5. Use test card: `4242 4242 4242 4242`

### 3. Test Webhooks
Stripe will send test webhooks to your local endpoint:
```
POST http://localhost:3000/api/billing/webhook
```

## 📋 Test Scenarios to Verify

### Subscription Lifecycle
- ✅ Create subscription with 14-day trial
- ✅ Successful payment after trial
- ✅ Failed payment handling
- ✅ Plan upgrades/downgrades
- ✅ Subscription cancellation

### User Experience
- ✅ Checkout flow in ZAR currency
- ✅ Billing portal access
- ✅ Invoice generation
- ✅ Email notifications

### Error Handling
- ✅ Declined payments
- ✅ Invalid card details
- ✅ Network timeouts
- ✅ Webhook failures

## 🔧 Troubleshooting

### Common Issues
1. **Webhook not received:** Check endpoint URL and signature
2. **Payment fails:** Verify test card numbers
3. **Currency issues:** Ensure ZAR is properly configured

### Debug Commands
```bash
# Check Stripe service status
curl http://localhost:3000/health

# View application logs
docker-compose logs -f app-dev

# Test email service
# (Your Gmail integration will send test emails)
```

## 🎯 Next Steps

1. **Start development server:** `npm run dev`
2. **Test basic flow:** Register → Login → Billing → Checkout
3. **Monitor webhooks:** Check logs for webhook events
4. **Verify emails:** Check Gmail for notifications

## ⚠️ Important Notes

- **Test Mode Only:** These credentials only work in test mode
- **No Real Charges:** No actual money will be processed
- **ZAR Support:** Currency conversion happens automatically
- **South Africa:** This setup works for ZAR payments despite SA not being directly supported

## 🚀 Going Live Later

When ready for production:
1. Get real Stripe account (UK company route)
2. Replace test keys with live keys
3. Configure production webhook endpoints
4. Test with small real transactions

---

**Ready to test your South African legal chatbot billing system!** 🇿🇦⚖️