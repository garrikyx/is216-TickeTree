<template>
  <nav class="navbar navbar-expand-md custom-navbar">
    <div class="container-fluid">
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

      <!-- Left section with logo -->
      <div class="navbar-left">
        <RouterLink class="navbar-brand d-flex align-items-center" to="/">
          <div class="shape">
            <img src="../assets/logo.png" style="width: 50px" />
            <span class="brand-text">TickeTree</span>
          </div>
        </RouterLink>
      </div>

      <!-- Center section with navigation -->
      <div
        class="collapse navbar-collapse justify-content-center"
        id="navbarNav"
      >
        <ul
          class="navbar-nav d-flex justify-content-center align-items-center"
          ref="navContainer"
        >
          <div class="nav-background" :style="backgroundStyle"></div>
          <li
            v-for="(item, index) in navItems"
            :key="item.path"
            class="nav-item"
            @mouseover="handleHover(index)"
          >
            <RouterLink
              :to="item.path"
              class="nav-link"
              :class="{ active: route.path === item.path }"
              @click="handleClick(index)"
            >
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>
      </div>

      <!-- Right Side Items with Fixed Width to Prevent Shifting -->
      <div class="navbar-right" v-if="!loading">
        <!-- Dark Mode Toggle Icon -->
        <div
          :class="['dark-mode-icon', { dark: isDarkMode }]"
          @click="$emit('toggleDarkMode')"
        >
          <i :class="isDarkMode ? 'fas fa-moon' : 'fas fa-sun'"></i>
        </div>

        <!-- User Info Icon or Login Button -->
        <div
          v-if="isLoggedIn"
          class="user-info-wrapper align-items-center"
          @click="$emit('toggleSidebar')"
        >
          <div class="user-avatar">
            <i class="fas fa-user"></i>
          </div>
        </div>
        <button v-else @click="goToLogin" class="btn login-btn">Login</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getAuth } from "firebase/auth";
import { useRouter, RouterLink, useRoute } from "vue-router";

const auth = getAuth();
const router = useRouter();
const route = useRoute();
const isLoggedIn = ref(false);
const loading = ref(true); // Add loading state
const navContainer = ref(null);
const activeIndex = ref(0);
const hoverIndex = ref(null);

const props = defineProps({
  isDarkMode: {
    type: Boolean,
    required: true
  }
});

const navItems = ref([
  { path: "/", label: "Home" },
  { path: "/marketplace", label: "Marketplace" },
  { path: "/faqs", label: "FAQs" },
]);

// Calculate the background position based on active/hover state
const backgroundStyle = computed(() => {
  const index = hoverIndex.value !== null ? hoverIndex.value : activeIndex.value;
  const navItem = navContainer.value?.children[index];
  const width = navItem ? navItem.offsetWidth : 0;
  const left = navItem ? navItem.offsetLeft : 0;

  return {
    transform: `translateX(${left}px)`,
    width: `${width}px`,
    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)", // Smooth transition for background movement
    zIndex: 1, // Ensure the background is on top of the nav items
  };
});

onMounted(() => {
  auth.onAuthStateChanged((user) => {
    isLoggedIn.value = !!user;
    loading.value = false; // Auth check is complete
  });

  // Set initial active index based on the current route path exactly
  const currentIndex = navItems.value.findIndex(
    (item) => item.path === route.path
  );
  if (currentIndex !== -1) {
    activeIndex.value = currentIndex;
  } else {
    activeIndex.value = 0; // Default to "Home" if no match is found
  }
});

const handleClick = (index) => {
  activeIndex.value = index; // Update active index on click
};

const handleHover = (index) => {
  hoverIndex.value = index; // Set hover index
};

const goToLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
.shape {
  border-radius: 12px;
  padding: 0.5rem;
}

.custom-navbar {
  background: #6d161d;
  height: 60px;
}

.navbar-collapse {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-left,
.navbar-right,
.fixed-placeholder {
  flex: 1;
}

.navbar-right,
.fixed-placeholder {
  display: flex;
  justify-content: flex-end;
}

.fixed-placeholder {
  visibility: hidden;
  min-width: 120px; /* Adjust to match actual width of user icon or login button */
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
  position: relative;
  display: flex;
  gap: 0;
  align-items: center; 
}

.nav-background {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 0;
  height: 100%;
  border-radius: 8px;
  pointer-events: none;
  z-index: 0;
}


.nav-link {
  font-size: 16px;
  color: #e0e0e0 !important;
  font-weight: 600;
  padding: 20px;
  width: 150px;
  display: flex;
  justify-content: center;
  border-radius: 8px;
  position: relative;
}

.nav-link:hover {
  color: #ffffff !important;
  background-color: rgba(255, 255, 255, 0.2);
}

.nav-link.active {
  color: #917a7a !important;
  background-color: transparent;
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
  color: #b87333;
  font-weight: 500;
  padding: 0.5rem 1.5rem;
  border: none;
  transition: all 0.2s ease;
}

.login-btn:hover {
  background-color: #ffffff;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .custom-navbar {
    height: auto;
    padding: 10px 0;
  }

  .navbar-collapse {
    background: #b87333;
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    flex-direction: column;
    padding: 1rem;
    z-index: 1000;
  }

  .navbar-nav {
    flex-direction: column;
    width: 100%;
    padding: 0;
  }

  .nav-background {
    display: none;
  }

  .nav-link {
    width: 100%;
    padding: 15px;
    margin: 2px 0;
  }

  .nav-link:hover,
  .nav-link.active {
    background-color: rgba(255, 255, 255, 0.15);
  }

  .navbar-brand {
    margin-right: 0;
  }
}
.dark-mode-icon {
  margin-top: 4px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 1rem;
}

.dark-mode-icon i {
  font-size: 20px;
  color: wheat;
}

.dark-mode-icon.dark i {
  font-size: 20px;
  color: white;
}
</style>
