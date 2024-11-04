<template>
  <div v-if="isSidebarOpen" class="overlay" @click="$emit('close')"></div>
  <aside :class="['sidebar', { open: isSidebarOpen, dark: isDarkMode }]" @click.stop>
    <div class="user-section" @click="$emit('close')">
      <i class="fas fa-user user-icon"></i>
      <span class="user-name">{{ userName || 'User' }}</span>
    </div>
    <button @click="$emit('close')" class="close-btn" aria-label="Close sidebar">&times;</button>
    <ul>
      <li :class="{ active: isActive('/profile') }">
        <i class="fas fa-user-circle"></i>
        <RouterLink to="/profile">Profile</RouterLink>
      </li>
      <li :class="{ active: isActive('/purchase-history') }">
        <i class="fas fa-history"></i>
        <RouterLink to="/purchase-history">Purchase History</RouterLink>
      </li>
      <li :class="{ active: isActive('/faqs') }">
        <i class="fas fa-question-circle"></i>
        <RouterLink to="/faqs">FAQs</RouterLink>
      </li>
      <li :class="{ active: isActive('/settings') }">
        <i class="fas fa-cog"></i>
        <RouterLink to="/settings">Settings</RouterLink>
      </li>
    </ul>
    <div class="toggle-container">
    <span class="toggle-label-text">Dark Mode</span> 
      <input 
        type="checkbox" 
        id="toggle" 
        :checked="isDarkMode" 
        @change="$emit('toggleDarkMode', !isDarkMode)" 
      />
      <label for="toggle" class="toggle-label">
        <span class="slider"></span>
      </label>
    </div>
    <button class="logout-btn" @click="logout" aria-label="Log out">Log Out</button>
  </aside>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter, RouterLink } from 'vue-router';
import { db } from '../../firebase';

const props = defineProps({
  isSidebarOpen: Boolean,
  isDarkMode: Boolean // Accept the dark mode state as a prop
});

const auth = getAuth();
const router = useRouter();
const userName = ref('');

const isActive = (route) => {
  return router.currentRoute.value.path === route;
};

const fetchUserName = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      userName.value = userDoc.data().name || 'User';
    } else {
      console.log("User document not found!");
      userName.value = 'User';
    }
  } catch (error) {
    console.error("Error fetching user data: ", error);
    userName.value = 'User';
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    router.push('/login');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      fetchUserName(user.uid);
    }
  });
});
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #f8f9fa;
  position: fixed;
  top: 0;
  right: -250px; /* Initially hidden */
  height: 100vh;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  z-index: 1000;
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column; /* Align items vertically */
  justify-content: space-between; /* Space out content */
}

.sidebar.open {
  right: 0; /* Slide in */
}

/* User section styles */
.user-section {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e6ea;
  margin-top: 50px;
  margin-bottom: 10px;
}

.user-icon {
  font-size: 40px;
  color: #007bff;
  margin-bottom: 10px;
  cursor: pointer; /* Add cursor pointer to indicate it's clickable */
}

.user-name {
  font-size: 18px;
  color: #333;
}

ul {
  list-style: none;
  padding: 0;
  flex-grow: 1; /* Allow this section to grow */
}

ul li {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  transition: background-color 0.3s ease;
}

ul li:hover {
  background-color: #e2e6ea;
}

ul li.active {
  background-color: #007bff;
  color: white;
}

ul li.active a {
  color: white;
}

ul li a {
  color: #333;
  text-decoration: none;
  margin-left: 10px;
}

ul li i {
  font-size: 20px;
}

.close-btn {
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
}

.logout-btn {
  margin-top: 20px; /* Adjusted margin to separate from menu items */
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px;
  width: 100%;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.logout-btn:hover {
  background-color: #c82333;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Dark, transparent background */
  z-index: 999; /* Just below the sidebar */
}

/* Toggle Switch Styles */
.toggle-container {
  display: flex; /* Align items in a row */
  align-items: center; /* Center vertically */
  justify-content: center; /* Center horizontally */
  margin-top: 20px; /* Space above the toggle section */
}

.toggle-label-text {
  margin-right: 10px; /* Space between the label and toggle */
  font-size: 16px; /* Match the font size with sidebar items */
  color: #333; /* Match your theme color */
}

/* Toggle button styles */
#toggle {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 60px;
  height: 30px;
  border-radius: 30px;
  background-color: #ccc; /* Light color for the toggle */
  position: relative; /* Position relative for the slider */
  cursor: pointer;
  transition: background-color 0.5s ease-in;
}

/* Slider inside the toggle button */
#toggle::before {
  content: "";
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #fff; /* White dot for the toggle */
  position: absolute;
  top: 50%;
  left: 3px;
  transform: translateY(-50%);
  transition: all 0.5s ease-in;
}

/* Toggle button checked styles */
#toggle:checked {
  background: #333; /* Dark color when checked */
}

#toggle:checked::before {
  background: #fff; /* Keep the dot white when checked */
  left: 32px; /* Move the dot to the right */
}
</style>