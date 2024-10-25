<template>
  <div id="app" class="app-container">
    <!-- Navbar is always shown but displays a login button if user is not logged in -->
    <Navbar v-if="!$route.meta.hideNavbar" 
            :isLoggedIn="isLoggedIn" 
            @toggleSidebar="toggleSidebar" />
    
    <!-- Sidebar is only shown when the user is logged in and it's not the login page -->
    <Sidebar v-if="isLoggedIn && showSidebar && !$route.meta.hideSidebar" @close="toggleSidebar" />

    <div class="content">
      <!-- Router View -->
      <RouterView />
    </div>
    
    <!-- Footer is only shown if not hidden via route meta -->
    <Footer v-if="!$route.meta.hideFooter"></Footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Firebase auth import
import Navbar from '@/components/Navbar.vue';
import Sidebar from '@/views/SideBar.vue';
import Footer from '@/components/Footer.vue';

const auth = getAuth(); // Firebase Auth instance

const isLoggedIn = ref(false); // State for user authentication
const showSidebar = ref(false); // State for sidebar visibility
const route = useRoute();

// Toggle sidebar visibility
const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

// Check for user authentication status on mount
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user; // Set isLoggedIn based on user presence
  });
});
</script>

<style scoped>
body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 0;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
}
</style>
