<template>
  <div class="container-fluid">
    <div class="row mt-4 mb-4">
      <div class="col fw-bold mb-2 fs-4 mx-4">Explore Categories</div>
    </div>

    <div class="row">
      <div class="col-0 col-lg-1"></div>

      <div v-for="category in categories" 
           :key="category.id" 
           :class="category.columnClass">
        <div class="category-item">
          <router-link
          :to="{ name: 'CategoryEvents', params: { categoryId: category.id }}"
          class="category-item"
        >
        <img
        :src="category.image"
        class="rounded-circle img-fluid category-image"
        :alt="`${category.name} Category`"
        />
      </router-link>
        <div class="mt-2 text-center">{{ category.name }}</div>
        </div>
      </div>

      <div class="col-0 col-lg-1 col-md-1"></div>
    </div>
  </div>
</template>

<script setup>

import { RouterLink } from 'vue-router';

const categories = [
  {
    id: 1,
    name: 'Entertainment',
    image: '/images/entertainment.jpg',
    columnClass: 'col-lg-2 col-md-4 col-sm-6 col-12 mb-2'
  },
  {
    id: 2,
    name: 'Sports',
    image: '/images/sports.jpg',
    columnClass: 'col-lg-2 col-md-4 col-sm-6 col-12 mb-2'
  },
  {
    id: 3,
    name: 'Arts & Culture',
    image: '/images/arts.jpg',
    columnClass: 'col-lg-2 col-md-4 col-sm-6 col-12 mb-2'
  },
  {
    id: 4,
    name: 'Business & Education',
    image: '/images/convention.jpg',
    columnClass: 'col-lg-2 col-sm-6 col-12 col-md-6 mb-2'
  },
  {
    id: 5,
    name: 'Exhibitions',
    image: '/images/exhibition.jpg',
    columnClass: 'col-lg-2 col-12 col-md-6 mb-2'
  }
]
</script>

<style scoped>
.category-item {
  cursor: pointer;
  text-align: center;
  transition: transform 0.2s;
}

.category-item:hover {
  transform: translateY(-5px);
}

.category-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
}
</style>