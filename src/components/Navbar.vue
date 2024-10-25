<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-0">
    <div class="container-fluid">
      <RouterLink class="navbar-brand text-warning" to="/">
        <span class="me-1">🎟️</span>
        LOGO/NAME
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
          <li v-for="item in navItems" :key="item.path" class="nav-item">
            <RouterLink
              :to="item.path"
              class="nav-link"
              active-class="active"
            >
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>
      </div>

      <div>
      <!-- This button toggles the sidebar -->
<div 
  v-if="isLoggedIn" 
  class="user-info btn btn-secondary d-none d-lg-block mx-2" 
  @click="$emit('toggleSidebar')"
>
  <i class="fas fa-bars me-2"></i> 
</div>


        <button v-else @click="goToLogin" class="btn btn-primary">
          Login
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAuth } from 'firebase/auth';
import { useRouter, RouterLink } from 'vue-router';
import { db } from '../../firebase'; // Import Firestore database instance
import { doc, getDoc } from 'firebase/firestore';

const auth = getAuth();
const router = useRouter();
const isLoggedIn = ref(false);
const navItems = ref([ // Define your nav items
  { path: "/", label: "Home" },
  { path: "/marketplace", label: "Marketplace" },
  { path: "/myevents", label: "My Events" },
]);

onMounted(() => {
      // Check if a user is logged in and update state
      auth.onAuthStateChanged((user) => {
        if (user) {
          isLoggedIn.value = true;
        } else {
          isLoggedIn.value = false;
        }
      });
    });

const goToLogin = () => {
  // Navigate to the login page
  window.location.href = '/login';
};

// No explicit return needed here in <script setup>
</script>

<style scoped>
.user-info {
  display: flex;
  align-items: center;
  color: #fff;
  cursor: pointer; /* Indicate it's clickable */
  padding: 10px 15px; /* Adjust padding as needed */
}

.user-info i {
  font-size: 18px;
}

.user-info span {
  font-size: 16px;
}
</style>
