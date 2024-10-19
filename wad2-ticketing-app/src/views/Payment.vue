<template>
  <div class="shopping-cart">
    <div class="title">Checkout</div>
    <div class="item">
      <div class="buttons">
        <span class="delete-btn" @click="deleteItem"></span>
        <span class="like-btn" :class="{ 'is-active': isLiked }" @click="toggleLike"></span>
      </div>
      <div class="image">
        <img :src="imageUrl" width="150px" height="100px" alt="Tate McRae" />
      </div>
      <div class="description">
        <span style="font-weight: bold; font-size: 18px">Tate McRae</span>
        <span>THINK LATER TOUR</span>
        <span>Seat: 38</span>
      </div>
      <div class="quantity">
        <button class="plus-btn" type="button" @click="increaseQuantity">
          <img src="/images/plus.svg" alt="" />
        </button>
        <input type="text" v-model="quantity" />
        <button class="minus-btn" type="button" @click="decreaseQuantity">
          <img src="/images/minus.svg" alt="" />
        </button>
      </div>
      <div class="total-price">${{ totalPrice }}</div>
    </div>
    <div class="checkout-button-container">
      <button class="checkout-btn" @click="checkout">Proceed to Payment</button>
    </div>
  </div>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js';

export default {
  data() {
    return {
      quantity: 1,
      isLiked: false,
      pricePerItem: 3,
      stripe: null,
      imageUrl: 'http://localhost:5173/images/tatemcrae.jpg', // Define the image URL here
    };
  },
  computed: {
    totalPrice() {
      return this.quantity * this.pricePerItem;
    },
  },
  async mounted() {
    this.stripe = await loadStripe('pk_test_51QAsReGgLeDXJUjvDrRwiHI6nisUuA7gSQw3AlX2UBqzlc4vPhbGCQCjcNiDel8pBfks9UhZGZXlO0jkvuNx1roP00zHKPl3aR'); // Initialize Stripe
  },
  methods: {
    increaseQuantity() {
      if (this.quantity < 100) {
        this.quantity += 1;
      }
    },
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity -= 1;
      }
    },
    toggleLike() {
      this.isLiked = !this.isLiked;
    },
    deleteItem() {
      console.log("Item deleted");
    },
    async checkout() {
      try {
        const response = await fetch('http://localhost:3000/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            quantity: this.quantity,
            price: this.pricePerItem,
            imageUrl: this.imageUrl, 
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
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}
html,
body {
  width: 100%;
  height: 100%;
  padding: 10px;
  margin: 0;
  background-color: #4d758c;
  font-family: 'Roboto', sans-serif;
}
.shopping-cart {
  width: 750px;
  height: 423px;
  margin: 80px auto;
  background: #ffffff;
  box-shadow: 1px 2px 3px 0px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
}
.title {
  height: 60px;
  border-bottom: 1px solid #e1e8ee;
  padding: 20px 30px;
  color: #5e6977;
  font-size: 18px;
  font-weight: 400;
}
.item {
  padding: 20px 30px;
  height: 120px;
  display: flex;
}
.item:nth-child(3) {
  border-top: 1px solid #e1e8ee;
  border-bottom: 1px solid #e1e8ee;
}
.buttons {
  position: relative;
  padding-top: 30px;
  margin-right: 60px;
}
.delete-btn {
  display: inline-block;
  cursor: pointer;
  width: 18px;
  height: 17px;
  background: url("./images/delete-icn.svg") no-repeat center;
  margin-right: 20px;
}
.like-btn {
  position: absolute;
  top: 9px;
  left: 15px;
  display: inline-block;
  background: url('./images/twitter-heart.png');
  width: 60px;
  height: 60px;
  background-size: 2900%;
  background-repeat: no-repeat;
  cursor: pointer;
}
.is-active {
  animation-name: animate;
  animation-duration: 0.8s;
  animation-iteration-count: 1;
  animation-timing-function: steps(28);
  animation-fill-mode: forwards;
}
@keyframes animate {
  0% {
    background-position: left;
  }
  50% {
    background-position: right;
  }
  100% {
    background-position: right;
  }
}
.image {
  margin-right: 30px;
}
.description {
  padding-top: 10px;
  margin-right: 60px;
  width: 115px;
}
.description span {
  display: block;
  color: #43484d;
  font-weight: 400;
}
.description span:first-child {
  margin-bottom: 5px;
}
.description span:last-child {
  font-weight: 300;
  margin-top: 8px;
  color: #86939e;
}
.quantity {
  padding-top: 30px;
  margin-right: 60px;
}
.quantity input {
  border: none;
  text-align: center;
  width: 32px;
  font-size: 16px;
  color: #43484d;
  font-weight: 300;
}
.minus-btn,
.plus-btn {
  background-color: #e1e8ee;
  border: none; 
  border-radius: 6px; 
  padding: 5px; 
  cursor: pointer; 
  display: inline-flex; 
  align-items: center; 
  justify-content: center; 
  transition: background-color 0.3s ease; 
  margin: 0 2px; 
}

.minus-btn:hover,
.plus-btn:hover {
  background-color: #d1d8db; /* Darker background on hover */
}

.minus-btn img,
.plus-btn img {
  width: 10px; 
  height: 10px; 
}

/* Remove individual margins from the images */
.minus-btn img,
.plus-btn img {
  margin: 0; 
}

button:focus,
input:focus {
  outline: 0;
}
.total-price {
  width: 83px;
  padding-top: 35px;
  text-align: center;
  font-size: 16px;
  color: #43484d;
  font-weight: bold;
}
.checkout-button-container {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  position: relative;
}
.checkout-btn {
  width: 200px;
  height: 40px;
  background-color: #5e6977;
  color: #ffffff;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s;
}
.checkout-btn:hover {
  background-color: #43484d;
}
.shopping-cart {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
</style>
