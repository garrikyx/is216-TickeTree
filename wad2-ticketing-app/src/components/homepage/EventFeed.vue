<template>
  <div class="container-fluid">
    <div class="row mt-4 mb-1">
      <div class="col fw-bold mb-2 fs-4 mx-4">Browse Events</div>
    </div>

    <div class="row mb-4 mx-4">
      <div class="col">
        <button 
          v-for="filter in filters" 
          :key="filter"
          :class="['btn', 'btn-outline-primary', 'btn-sm', 'me-2', 
                   { active: currentFilter === filter }]"
          @click="setFilter(filter)"
        >
          {{ filter }}
        </button>
      </div>
    </div>

    <div class="row text-center mx-4">
      <div v-for="event in events" 
           :key="event.id" 
           class="col-md-4 mb-4">
        <div class="card h-100">
          <img :src="event.image" class="card-img-top" :alt="event.title">
          <div class="card-body">
            <p class="fw-bold text-start mb-0">
              <span class="fs-4">{{ event.date }}</span> 
              {{ event.month }}
            </p>
            <h5 class="card-title text-start">{{ event.title }}</h5>
            <p class="card-text text-start">
              {{ event.venue }}<br>{{ event.time }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="row text-center mx-4">
      <div class="col">
        <button 
          class="btn btn-outline-primary"
          @click="loadMore"
        >
          See More
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const filters = ['All', 'Today', 'This Weekend', 'Popular']
const currentFilter = ref('All')

const events = [
  {
    id: 1,
    title: 'Tate McRae: THINK LATER TOUR',
    date: '31',
    month: 'OCTOBER',
    venue: 'The Star Theatre',
    time: '8:00PM - 10:00PM',
    image: '/images/tatemcrae.jpg'
  },
  {
    id: 2,
    title: 'Dua Lipa - Radical Optimism Tour',
    date: '5 - 6',
    month: 'NOVEMBER',
    venue: 'Singapore Indoor Stadium',
    time: '8:00PM - 10:00PM',
    image: '/images/dualipa.jpg'
  },
  {
    id: 3,
    title: 'Imagine Dragons - LOOM WORLD TOUR',
    date: '25',
    month: 'NOVEMBER',
    venue: 'Singapore Indoor Stadium',
    time: '8:00PM - 10:00PM',
    image: '/images/imaginedragons.jpg'
  }
]

const setFilter = (filter) => {
  currentFilter.value = filter
  // Add filter logic here
}

const loadMore = () => {
  // Add load more logic here
  console.log('Loading more events...')
}
</script>

<style scoped>
.card {
  transition: transform 0.2s;
  border: none;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

.card:hover {
  transform: translateY(-5px);
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}

.btn-outline-primary.active {
  background-color: var(--bs-primary);
  color: white;
}
</style>