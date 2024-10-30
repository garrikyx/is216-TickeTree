<template>
  <div class="shopping-cart">
    <div class="title">Payment Confirmation</div>
    <div v-if="cartItems.length === 0" class="empty-cart-message">
      <p>No items added in the cart</p>
    </div>
    <div v-else>
      <div v-for="(item, index) in cartItems" :key="index" class="item">
  <div class="buttons">
    <span class="delete-btn" @click="deleteItem(index)"></span>
  </div>
  <div class="image">
    <img :src="item.imageUrl" width="150px" height="100px" alt="Event Image" />
  </div>
  <div class="description">
    <span style="font-weight: bold; font-size: 18px">{{ item.eventName }}</span>
    <span>Seat: {{ item.seatNumber }}</span>
    <span>Date: {{ formatDate(item.eventDate) }}</span>
    <span>Time: no time</span>
  </div>
  <div class="quantity">
    <button class="minus-btn" type="button" @click="item.quantity > 1 ? item.quantity -= 1 : deleteItem(index)">
      <img src="/images/minus.svg" alt="Decrease Quantity" />
    </button>
    <input type="text" v-model="item.quantity" />
    <button class="plus-btn" type="button" @click="item.quantity += 1">
      <img src="/images/plus.svg" alt="Increase Quantity" />
    </button>
  </div>
  <div class="total-price">${{ (item.quantity * item.pricePerItem).toFixed(2) }}</div>
</div>
      <div class="checkout-button-container">
        <button class="checkout-btn" @click="checkout">Proceed to Payment</button>
      </div>
    </div>
  </div>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js';
import { useCartStore } from "@/stores/cartStore";
import { computed } from "vue";

export default {
  setup() {
    const cartStore = useCartStore();
    const cartItems = computed(() => cartStore.cartItems);

    const deleteItem = (index) => {
      cartStore.deleteItem(index);
    };

    return { cartItems, deleteItem };
  },
  async mounted() {
    this.stripe = await loadStripe('pk_test_51QAsReGgLeDXJUjvDrRwiHI6nisUuA7gSQw3AlX2UBqzlc4vPhbGCQCjcNiDel8pBfks9UhZGZXlO0jkvuNx1roP00zHKPl3aR'); // Initialize Stripe
  },
  methods: {
    increaseQuantity(index) {
      if (this.cartItems[index].quantity < 100) {
        this.cartItems[index].quantity += 1;
      }
    },
    decreaseQuantity(index) {
      if (this.cartItems[index].quantity > 1) {
        this.cartItems[index].quantity -= 1;
      }
    },
    deleteItem(index) {
      this.cartItems.splice(index, 1);
      console.log("Item deleted");
    },
    async checkout() {
      try {
        const response = await fetch('http://localhost:5001/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cartItems: this.cartItems,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const session = await response.json();

        // Redirect to checkout using the initialized Stripe instance
        const { error } = await this.stripe.redirectToCheckout({
          sessionId: session.id,
        });

        if (error) {
          console.error("Error redirecting to checkout:", error);
        }
      } catch (error) {
        console.error("Error creating checkout session:", error);
      }
    },
    formatDate(dateStr) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString(undefined, options);
    },
    formatTime(timeStr) {
      const [hour, minute] = timeStr.split(':');
      const date = new Date();
      date.setHours(hour, minute);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
  },
};
</script>
<style scoped>
.empty-cart-message {
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: #5e6977;
}

* {
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;
  padding: 10px;
  margin: 0;
  background-color: #f5f7fa;
  font-family: 'Roboto', sans-serif;
}

.shopping-cart {
  width: 800px;
  margin: 50px auto;
  background: #ffffff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.title {
  height: 60px;
  border-bottom: 1px solid #e1e8ee;
  padding: 10px 10px;
  color: #333;
  font-size: 20px;
  background-color: #f8f9fa;
  text-align: center;
}

.item {
  padding: 20px 30px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e1e8ee;
}

.buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 30px;
}

.delete-btn {
  width: 20px;
  height: 20px;
  cursor: pointer;
  background: url("./images/delete-icn.svg") no-repeat center;
  background-size: contain;
  transition: transform 0.3s;
}

.delete-btn:hover {
  transform: scale(1.2);
}

.is-active {
  animation: animate 0.8s steps(28) forwards;
}

@keyframes animate {
  0% { background-position: left; }
  100% { background-position: right; }
}

.image {
  margin-right: 20px;
  width: 150px;
  height: 100px;
  border-radius: 6px;
  overflow: hidden;
}

.image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.description {
  flex: 2;
  padding-left: 20px;
  font-size: 16px;
  color: #43484d;
}

.description span {
  display: block;
  margin-bottom: 5px;
}

.quantity {
  display: flex;
  align-items: center;
}

.quantity button {
  background-color: #e1e8ee;
  border: none;
  border-radius: 6px;
  padding: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 0 5px;
}

.quantity button img {
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 0 2px;
}

.quantity input {
  width: 40px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
  font-size: 14px;
}

.minus-btn, .plus-btn {
  background-color: #e1e8ee;
}

.minus-btn:hover, .plus-btn:hover {
  background-color: #d1d8db;
}

.total-price {
  width: 90px;
  text-align: right;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.checkout-button-container {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  background-color: #f8f9fa;
}

.checkout-btn {
  width: 220px;
  height: 45px;
  background-color: #007bff;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.checkout-btn:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}
</style>
