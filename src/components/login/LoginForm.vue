<template>
  <div class="centered">
    <h2 class="text-center mb-4">Sign In</h2>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3 input-group">
        <span class="input-group-text">
          <i class="bi bi-envelope-fill"></i>
        </span>
        <input
          type="email"
          class="form-control"
          id="email"
          v-model="email"
          placeholder="Email address"
          required
        />
      </div>
      <div class="mb-3 input-group">
        <span class="input-group-text">
          <i class="bi bi-lock-fill"></i>
        </span>
        <input
          type="password"
          class="form-control"
          id="password"
          v-model="password"
          placeholder="Password"
          required
        />
      </div>
      <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
      <button
        type="submit"
        class="btn btn-primary w-100"
        @click="signin"
      >Sign In</button>
    </form>

    <p class="mt-3 text-center">
      Don't have an account?
      <router-link to="/signup">Sign Up</router-link>
    </p>
  </div>
</template>
  
<script setup>
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import * as fb from '../../../firebase'
import { ref } from "vue";
const email = ref("");
const password = ref("");
const errorMessage = ref("");  // Added for error handling

const signin = () => {
  fb.signin(fb.auth(), email.value, password.value) // Correct function usage
    .then((data) => {
      console.log("Successful sign in");
      console.log(email.value);
      console.log(password.value);
      router.push("/homeView"); // Navigate to home view after successful sign-in
    })
    .catch((error) => {
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage.value = "Invalid email";
          break;
        case "auth/user-not-found":
          errorMessage.value = "No account with that email was found";
          break;
        case "auth/wrong-password":
          errorMessage.value = "Incorrect password";
          break;
        default:
          errorMessage.value = "Email or password was incorrect";
      }
    });
};
</script>
  
  <style scoped>
/* Centered Div Styling */
.centered {
  background-color: #ffffff;
  padding: 30px;
  width: 100%;
  max-width: 400px;
  border-radius: 20px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
  text-align: center;
  position: relative;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.centered:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.5);
}

/* Heading Styling */
.centered h2 {
  font-size: 26px;
  color: #333;
  margin-bottom: 25px;
  letter-spacing: 1px;
}

/* Input Group Styling */
.input-group-text {
  background-color: #6a11cb;
  color: white;
  border-radius: 50%;
  border: none;
}

.input-group .form-control {
  border-radius: 0 30px 30px 0;
  border-left: none;
  padding: 15px;
  box-shadow: none;
}

/* Focus Effect on Input */
.form-control:focus {
  border-color: #2575fc;
  box-shadow: 0 0 10px rgba(37, 117, 252, 0.5);
}

/* Button Styling */
.btn-primary {
  background-color: #2575fc;
  border: none;
  border-radius: 30px;
  padding: 12px;
  font-size: 18px;
  font-weight: bold;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.btn-primary:hover {
  background-color: #1a5bb8;
  box-shadow: 0 6px 15px rgba(37, 117, 252, 0.6);
}

/* Progress Bar */
.progress-bar {
  background-color: #6a11cb;
}

/* Text Links */
p a {
  color: #2575fc;
  font-weight: bold;
  text-decoration: none;
}

p a:hover {
  color: #1a5bb8;
  text-decoration: underline;
}
</style>