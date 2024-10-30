<template>
    <div 
      class="hero-image d-flex flex-column w-100 vh-80 position-relative align-items-center justify-content-center"
      :style="{ 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }"
    >
      <div class="bg-black position-absolute top-0 start-0 w-100 h-100 opacity-40"></div>
      
      <div class="position-relative z-3 font-weight-bold text-white h2 text-center">
        Find the hottest events today!
      </div>
      
      <div class="d-flex justify-content-between bg-white p-3 rounded shadow mt-3 w-50 position-relative z-3">
        <div class="d-flex flex-row align-items-center w-100 pe-3">
          <input 
            type="text" 
            placeholder="Search for Events..." 
            class="form-control border-0" 
            v-model="searchQuery"
            @input="handleSearch"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const backgroundImage = '/images/concert-hero.jpg'
  const searchQuery = ref('')
  
  const handleSearch = () => {
    console.log('Searching:', searchQuery.value)
  }
  </script>
  
  <style scoped>
  .hero-image {
    min-height: 50vh;
  }
  
  .opacity-40 {
    opacity: 0.4;
  }
  
  .z-3 {
    z-index: 3;
  }
  
  @media (max-width: 768px) {
    .w-50 {
      width: 90% !important;
    }
  }
  </style>