const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async function (event, context) {
  console.log("=== Payment Intent Request ===");
  console.log("STRIPE_SECRET_KEY exists:", !!process.env.STRIPE_SECRET_KEY);
  console.log("Method:", event.httpMethod);
  
  // Validate HTTP method
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { cart, shipping_fee, total_amount } = JSON.parse(event.body);
    console.log("Order details:", { cart, shipping_fee, total_amount });

    const calculateOrderAmount = () => {
      return shipping_fee + total_amount;
    };
    
    console.log("Creating payment intent with amount:", calculateOrderAmount());
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(),
      currency: "inr",
      // Add automatic_payment_methods for better compatibility
      automatic_payment_methods: {
        enabled: true,
      },
    });
    
    console.log("Payment Intent created successfully");
    
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (error) {
    console.error("❌ Error in create-payment-intent:", error);
    console.error("Error type:", error.type);
    console.error("Error message:", error.message);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: JSON.stringify({ 
        error: error.message,
        type: error.type 
      }),
    };
  }
};
