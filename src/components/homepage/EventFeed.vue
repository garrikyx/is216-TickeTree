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
      <div
        v-for="event in hardCodeEvents"
        :key="event.id"
        class="col-md-4 mb-4"
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
              {{ event.venue }}<br/>
            </p>
          </div>
        </div>
      </div>
      <div v-for="event in visibleEvents" :key="event.id" class="col-md-4 mb-4">
        <div class="card h-100">
          <img
            :src="event.images.images[0]?.original_url || '/images/noimage.png'"
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
      </div>
    </div>

    <div class="row text-center mx-4">
      <div class="col">
        <button class="btn btn-outline-primary" @click="toggleShowMore">
          {{ showAllEvents ? 'Show Less' : 'Show More' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { fetchEvents } from "@/api/eventsApi";
import { onMounted, ref, computed } from "vue";

const filters = ["Popular"];
const currentFilter = ref("Popular");

const setFilter = (filter) => {
  currentFilter.value = filter;
  // Add filter logic here
};

const hardCodeEvents = [
  {
    id: 1,
    title: "Tate McRae: THINK LATER TOUR",
    date: "31",
    month: "OCTOBER",
    venue: "The Star Theatre",
    time: "8:00PM - 10:00PM",
    image: "/images/tatemcrae.jpg",
  },
  {
    id: 2,
    title: "Dua Lipa - Radical Optimism Tour",
    date: "5 - 6",
    month: "NOVEMBER",
    venue: "Singapore Indoor Stadium",
    time: "8:00PM - 10:00PM",
    image: "/images/dualipa.jpg",
  },
  {
    id: 3,
    title: "Imagine Dragons - LOOM WORLD TOUR",
    date: "25",
    month: "NOVEMBER",
    venue: "Singapore Indoor Stadium",
    time: "8:00PM - 10:00PM",
    image: "/images/imaginedragons.jpg",
  },
];

const events = ref([]);
const visibleCount = ref(3);
const showAllEvents = ref(false);

const loadEvents = async () => {
  try {
    const response = await fetchEvents({ order: "popularity", rows: 20 });
    // console.log(response);
    events.value = response;
  } catch (error) {
    console.error("Failed to fetch events:", error);
  }
};

const visibleEvents = computed(() => events.value.slice(0, visibleCount.value));


const toggleShowMore = () => {
  showAllEvents.value = !showAllEvents.value;
  visibleCount.value = showAllEvents.value ? events.value.length : 3;
};

onMounted(() => {
  loadEvents();
});
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
