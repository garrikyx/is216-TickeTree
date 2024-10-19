<template>
  <div class="success-container">
    <div class="success-header">
      <div class="success-icon-text">
        <span class="success-icon">✔</span>
        <h1>Payment Confirmed</h1>
      </div>
      <p class="success-message">
        Thank you, your payment has been successful, and your purchase is now confirmed. A confirmation email has been sent to JoeAllenPro.com.
      </p>
    </div>

    <div class="order-summary">
      <h2>Order Summary</h2>
      <div class="order-info">
        <div class="order-detail">
          <p class="order-label">Event:</p>
          <p class="order-value">Tate McRae: THINK LATER TOUR</p>
        </div>
        <div class="order-detail">
          <p class="order-label">Quantity:</p>
          <p class="order-value">1</p>
        </div>
        <div class="order-detail">
          <p class="order-label">Email:</p>
          <p class="order-value">JoeAllenPro.com</p>
        </div>
        <div class="order-detail">
          <p class="order-label">Total Price:</p>
          <p class="order-value">SGD 3</p>
        </div>
      </div>
    </div>

    <div class="order-summary-card">
      <button class="return-btn" @click="redirectToHomepage">Return to Homepage</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Success',
  data() {
    return {
      sessionId: null,
    };
  },
  created() {
    this.sessionId = this.$route.query.session_id;
  },
  methods: {
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
  margin: 30px auto; /* Set equal top and bottom margin */
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Add this to ensure full vertical centering */
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
