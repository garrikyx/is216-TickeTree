<template>
  <div class="login-page">
    <div class="register-container">
      <h1>Create an account</h1>
      <div class="input-group">
        <input
          type="text"
          placeholder="Email"
          v-model="email"
          class="form-control"
        />
      </div>
      <div class="input-group">
        <input
          type="password"
          placeholder="Password"
          v-model="password"
          class="form-control"
        />
      </div>
      <button @click="register" class="btn btn-primary">Submit</button>
      <button @click="signInWithGoogle" class="btn btn-secondary">
        Sign In With Google
      </button>
    </div>
  </div>
</template>

<script setup>
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import * as fb from '../../firebase';
import {ref} from "vue";
const email = ref("");
const password = ref("");
const register = () => {
    fb.createUser(fb.auth(),email.value,password.value)
    .then(
        (data) => {
            console.log("Successful registration");
            console.log(email.value);
            console.log(password.value);
            router.push('/homeView')
        }
    )
    .catch(
        (error) => {
            console.log(error.code);
            alert(error.message)
        }
    )
}
</script>

<style scoped>
/* Centered container */
.register-container {
  background-color: #ffffff;
  padding: 30px;
  width: 100%;
  max-width: 400px;
  border-radius: 20px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
  text-align: center;
  transition: transform 0.4s ease, box-shadow 0.4s ease; /* Smooth transition for hover */
  animation: fadeInUp 1s ease-in-out; /* Initial fade-in up animation */
}

/* Input Group */
.input-group {
  margin-bottom: 15px;
}

.form-control {
  padding: 10px;
  width: 100%;
  border-radius: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}

/* Button styles */
.btn {
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  font-size: 16px;
}

.btn-primary {
  background-color: #2575fc;
  color: white;
  border: none;
}

.btn-secondary {
  background-color: #6a11cb;
  color: white;
  border: none;
}

/* Hover effects */
.btn:hover {
  opacity: 0.9;
  cursor: pointer;
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

/* Hover effect for upward movement */
.register-container:hover {
  transform: translateY(-15px); /* Move upwards on hover */
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.5); /* Deeper shadow on hover */
}

/* Initial Fade In Up Animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px); /* Start below the position */
  }
  to {
    opacity: 1;
    transform: translateY(0); /* End at the normal position */
  }
}

/* Optional: Adjust transition timing if needed */
.register-container {
  transition: transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out;
}
</style>