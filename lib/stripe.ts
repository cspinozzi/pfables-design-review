import 'server-only'

import Stripe from 'stripe'

// Only initialize Stripe if the API key is available
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null

export function getStripe() {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables.')
  }
  return stripe
}
