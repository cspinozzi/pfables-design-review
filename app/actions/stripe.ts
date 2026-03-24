'use server'

import { getStripe } from '@/lib/stripe'

interface CheckoutItem {
  name: string
  description?: string
  priceInCents: number
}

export async function startCheckoutSession(item: CheckoutItem) {
  if (!item.name || item.priceInCents <= 0) {
    throw new Error('Invalid checkout item')
  }

  const stripe = getStripe()

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    redirect_on_completion: 'never',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: item.description,
          },
          unit_amount: item.priceInCents,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
  })

  return session.client_secret
}
