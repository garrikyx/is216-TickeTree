<template>
  <div class="container-fluid">
    <div class="row mt-4 mb-1">
      <div class="col fw-bold mb-2 fs-4 mx-4">Browse Events</div>
    </div>

    <!-- Filter Buttons -->
    <div class="row mb-4 mx-4">
      <div class="col">
        <button
          v-for="filter in filters"
          :key="filter"
          :class="[
            'btn',
            'btn-outline-primary',
            'btn-sm',
            'me-2',
            { active: currentFilter === filter },
          ]"
          @click="setFilter(filter)"
        >
          {{ filter }}
        </button>
      </div>
    </div>

    <div class="row text-center mx-4">
      <!-- Display hardcoded events only for Popular filter -->
      <div
        v-for="event in hardCodeEvents"
        :key="event.id"
        class="col-md-4 mb-4"
        v-if="currentFilter === 'Popular'"
      >
        <div class="card h-100">
          <img :src="event.image" class="card-img-top" :alt="event.title" />
          <div class="card-body">
            <p class="fw-bold text-start mb-0">
              <span class="fs-4">{{ event.date }}</span>
              {{ event.month }}
            </p>
            <h5 class="card-title text-start">{{ event.title }}</h5>
            <p class="card-text text-start">
              {{ event.venue }}<br />
            </p>
          </div>
        </div>
      </div>

      <!-- Display events from the store based on selected filter -->
      <div v-for="event in filteredEvents" :key="event.id" class="col-md-4 mb-4">
        <RouterLink :to="{ name: 'EventDetail', params: { id: event.id } }" class="custom-link">
          <div class="card h-100">
            <img
              :src="event.images?.images[0]?.original_url || '/images/noimage.png'"
              class="card-img-top"
              :alt="event.name"
            />
            <div class="card-body">
              <p class="fw-bold text-start mb-0">
                <span class="fs-4"> {{ event.datetime_summary }} </span>
              </p>
              <h5 class="card-title text-start">{{ event.name }}</h5>
              <p class="card-text text-start">
                {{ event.location_summary }}<br />
              </p>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>

    <!-- Show More Button for Popular view only -->
    <div class="row text-center mx-4" v-if="currentFilter === 'Popular'">
      <div class="col">
        <button class="mb-5 mt-2 btn btn-outline-primary" @click="toggleShowMore">
          {{ showAllEvents ? 'Show Less' : 'Show More' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useEventStore } from '@/stores/eventStore';

const filters = ["Popular", "Recently Viewed"]; // Add "Recently Viewed" filter
const currentFilter = ref("Popular");

const setFilter = (filter) => {
  currentFilter.value = filter;
};

// Define hardcoded events
const hardCodeEvents = [
  {
    id: 1,
    title: "Tate McRae: THINK LATER TOUR",
    date: "31",
    month: "OCTOBER",
    venue: "The Star Theatre",
    image: "/images/tatemcrae.jpg",
  },
  {
    id: 2,
    title: "Dua Lipa - Radical Optimism Tour",
    date: "5 - 6",
    month: "NOVEMBER",
    venue: "Singapore Indoor Stadium",
    image: "/images/dualipa.jpg",
  },
  {
    id: 3,
    title: "Imagine Dragons - LOOM WORLD TOUR",
    date: "25",
    month: "NOVEMBER",
    venue: "Singapore Indoor Stadium",
    image: "/images/imaginedragons.jpg",
  },
];

// Initialize reactive states for event display control
const visibleCount = ref(3);
const showAllEvents = ref(false);

const toggleShowMore = () => {
  showAllEvents.value = !showAllEvents.value;
  visibleCount.value = showAllEvents.value ? eventStore.events.length : 3;
};

// Use the event store
const eventStore = useEventStore();

// Fetch events from the store when the component is mounted
onMounted(() => {
  eventStore.loadEvents();
});

// Computed property to filter events based on the current filter
const filteredEvents = computed(() => {
  if (currentFilter.value === "Recently Viewed") {
    return eventStore.recentlyViewed; // Show all recently viewed events
  } else {
    return eventStore.events.slice(0, visibleCount.value); // Show popular events with "Show More" functionality
  }
});
</script>

<style scoped>
.card {
  transition: transform 0.2s;
  border: none;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.card:hover {
  transform: translateY(-5px);
}

.card-img-top {
  height: 250px;
  object-fit: cover;
}

.btn-outline-primary.active {
  background-color: var(--bs-primary);
  color: white;
}

.custom-link {
  color: inherit;
  text-decoration: none;
}

.custom-link:hover {
  text-decoration: none;
}
</style>
