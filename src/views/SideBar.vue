<template>
  <div v-if="showSidebar" class="overlay" @click="$emit('close')"></div>
  <aside class="sidebar">
    <div class="user-section">
      <i class="fas fa-user user-icon"></i>
      <span class="user-name">{{ userName || 'User' }}</span> <!-- Display user's name or a fallback -->
    </div>
    <button @click="$emit('close')" class="close-btn" aria-label="Close sidebar">&times;</button>
    <ul>
      <li :class="{ active: isActive('/profile') }">
        <i class="icon-dashboard"></i>
        <RouterLink to="/profile">Profile</RouterLink>
      </li>
      <li :class="{ active: isActive('/purchase-history') }">
        <i class="icon-history"></i>
        <RouterLink to="/purchase-history">Purchase History</RouterLink>
      </li>
      <li :class="{ active: isActive('/faqs') }">
        <i class="icon-faq"></i>
        <RouterLink to="/faqs">FAQs</RouterLink>
      </li>
      <li :class="{ active: isActive('/settings') }">
        <i class="icon-settings"></i>
        <RouterLink to="/settings">Settings</RouterLink>
      </li>
    </ul>
    <button class="logout-btn" @click="logout" aria-label="Log out">Log Out</button>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter, RouterLink } from 'vue-router';
import { db } from '../../firebase'; // Make sure this path points correctly to your Firebase config

const auth = getAuth();
const router = useRouter();
const isLoggedIn = ref(false);
const userName = ref('');
const showSidebar = ref(true);

const isActive = (route) => {
  return router.currentRoute.value.path === route;
};

const fetchUserName = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      userName.value = userDoc.data().name || 'User'; // Retrieve the name field from Firestore
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
  // Check if a user is logged in and update state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
      fetchUserName(user.uid); // Fetch user name from Firestore
    } else {
      isLoggedIn.value = false;
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
  right: 0;
  height: 100vh;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  z-index: 1000;
  transition: transform 0.3s ease;
}

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
}

.user-name {
  font-size: 18px;
  color: #333;
}

ul {
  list-style: none;
  padding: 0;
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
  margin-top:350px;
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
  transition: opacity 0.3s ease;
}
</style>
