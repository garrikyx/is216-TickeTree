<template>
  <div class="login-page">
    <!--  <div class="auth-container"> -->
      <!-- <AuthNavbar /> -->
      <LoginForm @login="handleLogin" />
     <!-- </div> -->
  </div>
</template>

<script>
// import AuthNavbar from '@/components/login/AuthNavbar.vue';
import LoginForm from '@/components/login/LoginForm.vue';

export default {
  components: {
    // AuthNavbar,
    LoginForm,
  },
  methods: {
    handleLogin(credentials) {
      // Handle login logic here
      console.log('Login attempted with:', credentials)
      // authentication logic here
    }
  }
}
</script>

<style scoped>
/* Full Page Styling */
body {
    background: linear-gradient(135deg, #a35feb 0%, #002d7a 100%);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    overflow: hidden;
    transition: background-color 0.4s ease;
}

/* Dark Mode Hover Effect on Body */
body:hover {
    background-color: #1b2a49; /* Adds a subtle dark effect on hover */
}

/* Smooth Entrance Animation */
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    animation: fadeInUp 1s ease-in-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.login-page {
    min-height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #a35feb 0%, #002d7a 100%);
    transition: background-color 0.4s ease;
}

.login-page:hover {
    background-color: #1b2a49;
}

/* Container for both components */
.auth-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem; 
    width: 100%;
    max-width: 400px;
    animation: fadeInUp 1s ease-in-out;
    margin-top: 50px; /* Adjust this margin to fit your design */
}

/* Optional: Add some space between the navbar and login form if needed */
.auth-container > AuthNavbar {
    margin-bottom: 20px; /* Space between AuthNavbar and LoginForm */
}
</style>
