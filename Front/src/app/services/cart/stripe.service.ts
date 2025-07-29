import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  stripePromise = loadStripe('pk_test_51M7hARHJtiyIQHNyJQj9GCl3jfEppW00oxSArhlHyYR32JkWQHeS3bmHpGGPXH7DTaujZtIzwHrVRDNdyBnCtj8d00KV6LcEMD'); // clé publique

  constructor(private http: HttpClient) {}

  async checkout(orderId: number, amount: number, quantity: number) {
    // Appel au backend pour créer une session Stripe
    const session = await this.http.post<{ sessionId: string }>(
      'http://localhost:8030/payment/api/payment/create-checkout-session',
      { orderId, amount, quantity }
    ).toPromise();

    const stripe = await this.stripePromise;
    if (stripe && session?.sessionId) {
      await stripe.redirectToCheckout({ sessionId: session.sessionId });
    }
  }
}
