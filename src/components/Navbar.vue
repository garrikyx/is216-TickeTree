<template>
  <nav class="navbar navbar-expand-lg custom-navbar">
    <div class="container-fluid">
      
      <!-- Navigation Items -->
      <div class="collapse navbar-collapse justify-content-between align-items-center" id="navbarNav">
        <!-- Left section with logo -->
        <div class="navbar-left">
          <RouterLink class="navbar-brand d-flex align-items-center" to="/">
            <div class="shape">
              <img src="../assets/logo.png" style="width:50px">
              <span class="brand-text">TickeTree</span>
            </div>
          </RouterLink>
        </div>

        <!-- Center section with navigation -->
        <ul class="navbar-nav mx-auto">
          <li v-for="item in navItems" :key="item.path" class="nav-item">
            <RouterLink
              :to="item.path"
              class="nav-link"
              :class="{ active: route.path === item.path }"
            >
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>

        <!-- Right Side Items -->
        <div class="navbar-right">
          <div 
            v-if="isLoggedIn" 
            class="user-info-wrapper d-none d-lg-flex align-items-center"
            @click="$emit('toggleSidebar')"
          >
            <div class="user-avatar">
              <i class="fas fa-user"></i>
            </div>
          </div>

          <button 
            v-else 
            @click="goToLogin" 
            class="btn login-btn"
          >
            Login
          </button>
        </div>
      </div>

      <!-- Mobile Toggle Button - Outside the collapse div -->
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
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAuth } from 'firebase/auth';
import { useRouter, RouterLink, useRoute } from 'vue-router';

const auth = getAuth();
const router = useRouter();
const route = useRoute();
const isLoggedIn = ref(false);
const navItems = ref([
  { path: "/", label: "Home" },
  { path: "/marketplace", label: "Marketplace" },
  { path: "/myevents", label: "My Events" },
]);

onMounted(() => {
  auth.onAuthStateChanged((user) => {
    isLoggedIn.value = !!user;
  });
});

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.shape{
  border-radius: 12px;
  padding: 0.5rem;
}

.custom-navbar {
  background: #B87333;
  padding: 0.8rem 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-collapse {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-left, .navbar-right {
  flex: 1;
}

.navbar-right {
  display: flex;
  justify-content: flex-end;
}

.navbar-brand {
  margin-right: 2rem;
}

.navbar-brand:hover {
  transform: translateY(-1px);
}

.brand-text {
  color: wheat;
  font-weight: 600;
  font-size: 1.3rem;
  margin-left: 1rem;
}

.navbar-nav {
  flex-grow: 0;
}

.nav-link {
  color: #e0e0e0 !important;
  font-weight: 500;
  padding: 0.5rem 1rem;
  margin: 0 0.2rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: #ffffff !important;
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  color: #ffffff !important;
  background-color: rgba(255, 255, 255, 0.15);
}

.user-info-wrapper {
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
}

.user-info-wrapper:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.user-avatar {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

.user-avatar i {
  font-size: 1.2rem;
}

.login-btn {
  background-color: #fadcb8;
  color: #B87333;
  font-weight: 500;
  padding: 0.5rem 1.5rem;
  border: none;
  transition: all 0.2s ease;
}

.login-btn:hover {
  background-color: #ffffff;
  transform: translateY(-1px);
}

@media (max-width: 991.98px) {
  .navbar-collapse {
    flex-direction: column;
    align-items: stretch;
  }

  .navbar-nav {
    margin: 1rem 0;
  }

  .nav-link {
    padding: 0.7rem 1rem;
    margin: 0.2rem 0;
  }
  
  .login-btn {
    width: 100%;
    margin-top: 0.5rem;
  }

  .navbar-right {
    justify-content: center;
  }
}
</style>