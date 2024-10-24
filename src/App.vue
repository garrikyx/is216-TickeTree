<script setup>
import { RouterLink, RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
import { onMounted } from "vue";
import { fetchEvents } from "./api/eventsApi";


onMounted(async() => {
  try {
    const events = await fetchEvents();
    console.log(events)
  } catch (err) {
    console.error('Error fetching events',err);
    
  }
})
</script>

<template>
  <div id="app" class="app-container">
    <Navbar v-if="!$route.meta.hideNavbar"/>
    <div class="content">
      <RouterView /> 
    </div>
    <Footer v-if="!$route.meta.hideFooter"></Footer>
  </div>
</template>

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
