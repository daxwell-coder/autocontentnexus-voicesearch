#!/bin/bash

# PayPal Live API Connectivity Test Script
# This script tests the PayPal Live API integration

echo "🔄 PayPal Live API Connectivity Test"
echo "=================================="
echo ""

# Test the PayPal Live API test endpoint
echo "📡 Testing PayPal Live API connectivity..."
echo ""

response=$(curl -s -X POST \
  https://uqrmmnzwfvqpnzobwgly.supabase.co/functions/v1/test-paypal-live-api \
  -H "Content-Type: application/json" \
  -d "{}")

# Check if curl was successful
if [ $? -eq 0 ]; then
  echo "✅ API call successful"
  echo ""
  
  # Parse the response (basic check)
  if echo "$response" | grep -q '"success":true'; then
    echo "🎉 PayPal Live API Test: PASSED"
    echo "📊 Test Results:"
    echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
  else
    echo "❌ PayPal Live API Test: FAILED"
    echo "📋 Response:"
    echo "$response"
  fi
else
  echo "❌ Failed to connect to test endpoint"
  echo "🔍 Please check your internet connection and try again"
fi

echo ""
echo "=================================="
echo "Test completed at $(date)"
