<template>
  <div class="success-container">
    <div v-if="isLoading">
      <p>Loading your order summary...</p>
    </div>
    <div v-else-if="orderSummary">
      <div class="success-header">
        <div class="success-icon-text">
          <span class="success-icon">✔</span>
          <h1>Payment Confirmed</h1>
        </div>
        <p class="success-message">
          Thank you, your payment has been successful, and your purchase is now confirmed.
          A confirmation email has been sent to {{ orderSummary.customerEmail }}.
        </p>
      </div>
      <div class="order-summary">
        <h2>Order Summary</h2>
        <div class="order-info">
          <div class="order-detail">
            <p class="order-label">Event:</p>
            <p class="order-value">{{ orderSummary.eventName }}</p>
          </div>
          <div class="order-detail">
            <p class="order-label">Date:</p>
            <p class="order-value">{{ orderSummary.eventDate }}</p>
          </div>
          <div class="order-detail" v-if="orderSummary.seatNumbers && orderSummary.seatNumbers.length">
            <p class="order-label">Seats:</p>
            <p class="order-value">
              <span v-for="(seat, index) in orderSummary.seatNumbers" :key="index">
                {{ seat }}<span v-if="index < orderSummary.seatNumbers.length - 1">, </span>
              </span>
            </p>
          </div>
          <div class="order-detail">
            <p class="order-label">Quantity:</p>
            <p class="order-value">{{ orderSummary.quantity }}</p>
          </div>
          <div class="order-detail">
            <p class="order-label">Total Price:</p>
            <p class="order-value">SGD {{ (orderSummary.totalPrice / 100).toFixed(2) }}</p>
          </div>
        </div>
      </div>
      <div class="order-summary-card">
        <button class="return-btn" @click="redirectToHomepage">Return to Homepage</button>
      </div>
    </div>
    <div v-else>
      <p>Failed to load order details. Please try again later.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { db } from '../../../firebase';
import { collection, addDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useCartStore } from '@/stores/cartStore'; // Import the cart store

export default {
  data() {
    return {
      sessionId: '',
      orderSummary: {},
      isLoading: true,
    };
  },
  async created() {
    this.sessionId = this.$route.query.session_id;

    console.log("Session ID from URL:", this.sessionId);

    if (this.sessionId) {
      try {
        const response = await axios.get(`http://localhost:5001/checkout-session`, {
          params: { session_id: this.sessionId },
        });

        const session = response.data;
        console.log("Fetched session details:", session);

        if (session.line_items && session.line_items.data.length > 0) {
          const item = session.line_items.data[0];

          this.orderSummary = {
            eventName: item.price.product.name,
            eventDate: item.price.product.metadata.eventDate || 'N/A',
            seatNumbers: item.price.product.metadata.seatNumbers ? JSON.parse(item.price.product.metadata.seatNumbers) : ['N/A'],
            quantity: item.quantity,
            customerEmail: session.customer_email || 'N/A',
            totalPrice: session.amount_total,
            imageUrl: item.price.product.metadata.imageUrl || '/images/noimage.png',
          };

          if (this.isValidEmail(this.orderSummary.customerEmail)) {
            await this.sendConfirmationEmail(this.orderSummary.customerEmail, this.orderSummary);
          } else {
            console.error("Invalid email format:", this.orderSummary.customerEmail);
          }

          await this.savePaymentDetails();
          this.removePurchasedItems(); // Remove purchased items from the cart after successful payment
        } else {
          console.error("No line items found in the session data.");
        }
      } catch (error) {
        console.error("Failed to fetch session details:", error);
      } finally {
        this.isLoading = false;
      }
    }
  },
  methods: {
    isValidEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    },

    async sendConfirmationEmail(email, orderSummary) {
      try {
        const response = await axios.post('http://localhost:5001/send-confirmation-email', {
          email,
          orderSummary,
        });
        console.log('Email sent successfully:', response.data);
      } catch (error) {
        console.error('Failed to send email:', error);
      }
    },

    async savePaymentDetails() {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        const userId = currentUser ? currentUser.uid : null;

        const paymentData = {
          customerEmail: this.orderSummary.customerEmail,
          eventName: this.orderSummary.eventName,
          seatNumbers: this.orderSummary.seatNumbers,
          quantity: this.orderSummary.quantity,
          eventDate: this.orderSummary.eventDate,
          totalPrice: Math.round(this.orderSummary.totalPrice / 100),
          imageUrl: this.orderSummary.imageUrl,
          userId: userId,
        };
        
        const docRef = await addDoc(collection(db, 'payment'), paymentData);
        await updateDoc(docRef, { orderId: docRef.id });
        console.log("Payment document written with ID: ", docRef.id);
      } catch (error) {
        console.error("Error adding payment document: ", error);
      }
    },

    // Remove purchased items from the cart
    removePurchasedItems() {
      const cartStore = useCartStore(); // Access the cart store
      cartStore.cartItems.forEach((item) => {
        // Mark items as purchased after successful payment
        item.purchased = true;
      });
      cartStore.removePurchasedItems(); // Remove items that are marked as purchased
    },

    redirectToHomepage() {
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
.success-container {
  padding: 30px;
  max-width: 600px;
  margin: 30px auto;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
  text-align: center;
}

body, html {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-header {
  text-align: center;
}

.success-icon-text {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}

.success-icon {
  font-size: 40px;
  color: #4caf50;
  margin-right: 10px;
}

h1 {
  font-size: 24px;
  color: #4caf50;
  margin: 0;
  font-weight: bold;
}

.success-message {
  font-size: 16px;
  color: #333;
  margin-top: 10px;
  line-height: 1.5;
}

.order-summary {
  margin-top: 20px;
}

h2 {
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
  font-weight: bold;
}

.order-info {
  font-size: 16px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.order-detail {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #ccc;
}

.order-detail:last-child {
  border-bottom: none;
}

.order-label {
  font-weight: bold;
  color: #666;
}

.order-value {
  color: #333;
}

.event-image {
  max-width: 100%;
  height: auto;
  margin-top: 10px;
}

.order-summary-card {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.return-btn {
  display: inline-block;
  background-color: #4caf50;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.return-btn:hover {
  background-color: #388e3c;
}
</style>
