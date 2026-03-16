require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

console.log("=== API Function Loaded ===");
console.log("STRIPE_SECRET_KEY exists:", !!process.env.STRIPE_SECRET_KEY);
console.log("STRIPE_SECRET_KEY length:", process.env.STRIPE_SECRET_KEY?.length || 0);

export default async function handler(req, res) {
  console.log("\n=== Payment Intent Request ===");
  console.log("Method:", req.method);
  console.log("Headers:", JSON.stringify(req.headers, null, 2));

  // Enable CORS for all origins (for development)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log("OPTIONS preflight request - returning 200");
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    console.log("Non-POST request rejected");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("\nParsing request body...");
    const { cart, shipping_fee, total_amount } = req.body;
    console.log("Order details:", { cart, shipping_fee, total_amount });

    // Validate required fields
    if (!cart || !shipping_fee || !total_amount) {
      console.error("Missing required fields:", { cart, shipping_fee, total_amount });
      return res.status(400).json({ 
        error: "Missing required fields",
        received: { cart: !!cart, shipping_fee, total_amount }
      });
    }

    const calculateOrderAmount = () => {
      const total = shipping_fee + total_amount;
      console.log(`Calculated amount: ${shipping_fee} + ${total_amount} = ${total}`);
      return total;
    };

    const amount = calculateOrderAmount();
    console.log("Creating payment intent with amount:", amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid payment amount" });
    }

    console.log("About to call Stripe API...");
    
    // Create a PaymentIntent with the order amount and currency
    // For INR: Add description to comply with Indian regulations for international cards
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "inr",
      description: 'Comfy Sloth - Furniture purchase',
      shipping: {
        name: 'Customer',
        address: {
          line1: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          postal_code: '400001',
          country: 'IN',
        },
      },
      metadata: {
        integration: 'comfy_sloth',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log("✅ Payment Intent created successfully");
    console.log("Client Secret exists:", !!paymentIntent.client_secret);
    console.log("Client Secret preview:", paymentIntent.client_secret?.substring(0, 20) + '...');

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("\n❌ Error in create-payment-intent:");
    console.error("Error type:", error.type);
    console.error("Error message:", error.message);
    console.error("Full error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    res.status(500).json({ 
      error: error.message,
      type: error.type 
    });
  }
}
