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
            <li class="nav-item nav-link text-light d-lg-none">
              Login
            </li>
          </ul>
        </div>
        
        <RouterLink 
          to="/login" 
          class="btn btn-primary d-none d-lg-block me-4"
        >
          Login
        </RouterLink>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { RouterLink } from 'vue-router'
  
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/marketplace", label: "Marketplace" },
    { path: "/myevents", label: "My Events" },
  ]
  </script>
  
  <style scoped>
  .nav-link.active {
    color: var(--bs-warning) !important;
  }
  
  .navbar-nav .router-link-active {
    color: var(--bs-warning) !important;
  }
  </style>