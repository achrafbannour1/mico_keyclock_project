import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeycloakService } from '../../../services/keycloak/keycloak.service';
import { ProductService } from '../../../services/ProductService/ProductService';

interface Prize {
  type: 'discount' | 'product' | 'coupon';
  label: string;
  value: number | string;
}

@Component({
  selector: 'app-wheel-roulette',
  templateUrl: './wheel-roulette.component.html',
  styleUrls: ['./wheel-roulette.component.css']
})
export class WheelRouletteComponent implements OnInit {
  prizes: Prize[] = [
    { type: 'discount', label: '10% Off', value: 10 },
    { type: 'discount', label: '20% Off', value: 20 },
    { type: 'discount', label: '50% Off', value: 50 },
    { type: 'product', label: 'Free T-Shirt', value: 1 },
    { type: 'product', label: 'Free Headphones', value: 2 },
    { type: 'coupon', label: 'Free Shipping', value: 'FREESHIP' },
    { type: 'coupon', label: '20% Off Coupon', value: 'SUMMER20' },
    { type: 'coupon', label: 'Nothing', value: 'NONE' }
  ];
  spinning = false;
  result: Prize | null = null;
  rotation = 0;
  hasSpun = false;
  errorMessage: string | null = null;

  constructor(
    private keycloakService: KeycloakService,
    private http: HttpClient,
    private productService: ProductService
  ) {}

  ngOnInit() {
    const userId = this.keycloakService.tokenParsed?.sub;
    if (userId) {
      const storedState = localStorage.getItem(`wheel_state_${userId}`);
      if (storedState) {
        const { hasSpun } = JSON.parse(storedState);
        this.hasSpun = hasSpun;
        console.log('Restored state from localStorage:', { hasSpun });
      }
    }
  }

  spin() {


    if (this.hasSpun) {
      this.errorMessage = 'You have already spun the wheel.';
      console.log('spin: Already spun');
      return;
    }

    if (this.spinning) return;

    console.log('Starting spin');
    this.spinning = true;
    this.result = null;
    this.errorMessage = null;

    const randomSpins = 5 + Math.random() * 5;
    const segmentAngle = 360 / this.prizes.length;
    const randomPrizeIndex = Math.floor(Math.random() * this.prizes.length);
    this.rotation = randomSpins * 360 + randomPrizeIndex * segmentAngle + segmentAngle / 2;

    setTimeout(() => {
      this.spinning = false;
      this.result = this.prizes[randomPrizeIndex];
      this.hasSpun = true;
      this.updateLocalStorage();
      console.log('Spin completed, result:', this.result);

      if (this.result && this.result.value !== 'NONE') {
        this.sendWinEmail(this.result);
      }
    }, 3000);
  }

  private sendWinEmail(prize: Prize) {
    const userEmail = this.keycloakService.tokenParsed?.email;
    if (!userEmail) {
      console.error('No user email found for sending win notification');
      this.errorMessage = 'Failed to send prize notification: No email found.';
      return;
    }

    let prizeDetails = '';
    let prizeCode = '';
    if (prize.type === 'discount') {
      prizeCode = `WHEEL${prize.value}`;
      prizeDetails = `You have won a ${prize.value}% discount on your next purchase! Use the code ${prizeCode} at checkout.`;
    } else if (prize.type === 'product') {
      prizeDetails = `You have won a free product: ${prize.label} (ID: ${prize.value}). Please contact our support team at support@ecommerce.com to claim your prize.`;
      this.productService.getProductById(Number(prize.value)).subscribe({
        next: (product) => {
          prizeDetails = `You have won a free ${product.designation} (ID: ${prize.value}). Please contact our support team at support@ecommerce.com to claim your prize.`;
          this.sendEmail(userEmail, prize.label, prizeDetails);
        },
        error: (err) => {
          console.error('Failed to fetch product details:', err);
          this.sendEmail(userEmail, prize.label, prizeDetails);
        }
      });
      return;
    } else if (prize.type === 'coupon') {
      prizeCode = `${prize.value}`;
      prizeDetails = `You have won a coupon: ${prize.label}. Use the code ${prizeCode} at checkout to redeem your reward.`;
    }

    this.sendEmail(userEmail, prize.label, prizeDetails);
  }

  private sendEmail(to: string, prizeLabel: string, prizeDetails: string) {
    const emailRequest = {
      to,
      subject: 'Congratulations! You Won a Prize on Wheel Roulette!',
      body: `Dear User,\n\nCongratulations! You have won ${prizeLabel} by spinning the Wheel Roulette.\n\n${prizeDetails}\n\nThank you for participating!\nBest regards,\nE-Commerce Team`
    };

    this.http.post('http://localhost:8030/api/email/send', emailRequest).subscribe({
      next: () => {
        console.log('Win email sent successfully to', to);
        this.errorMessage = null;
      },

    });
  }

  reset() {
    this.rotation = 0;
    this.result = null;
    this.spinning = false;
    this.hasSpun = false;
    this.errorMessage = null;
    this.updateLocalStorage();
    console.log('Wheel reset');
  }

  private updateLocalStorage() {
    const userId = this.keycloakService.tokenParsed?.sub;
    if (userId) {
      localStorage.setItem(
        `wheel_state_${userId}`,
        JSON.stringify({ hasSpun: this.hasSpun })
      );
    }
  }

  getSegmentColor(index: number): string {
    const colors = [
      '#ffcc5c',
      '#d4a5a5',
      '#ff6f61',
      '#6b5b95',
      '#feb236',
      '#88d8b0',
      '#a3e4d7',
      '#f5b7b1'
    ];
    return colors[index % colors.length];
  }
}
