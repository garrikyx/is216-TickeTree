<template>
  <div id="app" :class="{'dark-mode': isDarkMode}" class="app-container">
    <Navbar 
      v-if="!$route.meta.hideNavbar" 
      :isLoggedIn="isLoggedIn" 
      @toggleSidebar="toggleSidebar"
      @toggleDarkMode="toggleDarkMode"
      :isDarkMode="isDarkMode"
    />
    
    <Sidebar 
      v-if="isLoggedIn && !$route.meta.hideSidebar" 
      :isSidebarOpen="showSidebar" 
      @close="toggleSidebar"
      @toggleDarkMode="toggleDarkMode"
      :isDarkMode="isDarkMode"  <!-- Pass the dark mode state -->
    ></Sidebar>
    
    <div class="content">
      <RouterView />
    </div>
    
    <Footer v-if="!$route.meta.hideFooter"></Footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Navbar from '@/components/Navbar.vue';
import Sidebar from '@/views/SideBar.vue';  
import Footer from '@/components/Footer.vue';

const auth = getAuth();

const isLoggedIn = ref(false);
const showSidebar = ref(false);
const isDarkMode = ref(false); // State for dark mode
const route = useRoute();

// Check for dark mode preference from local storage
const checkDarkModePreference = () => {
  const storedPreference = localStorage.getItem('dark-mode');
  if (storedPreference) {
    isDarkMode.value = storedPreference === 'true';
  }
};

// Toggle dark mode
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('dark-mode', isDarkMode.value);
};

// Toggle sidebar visibility
const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

// Check for user authentication status on mount
onMounted(() => {
  checkDarkModePreference();
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user;
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
  transition: background-color 0.3s, color 0.3s; /* Smooth transition */
}

.content {
  flex: 1;
}

.dark-mode {
  background-color: #121212; /* Dark background color */
  color: #ffffff; /* Light text color */
}

.dark-mode .navbar, .dark-mode .sidebar, .dark-mode .footer {
  background-color: #1e1e1e; /* Dark background for components */
}
</style>
