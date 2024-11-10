<template>
  <div class="container-fluid">
    <!-- Loading Spinner -->
    <div v-if="loading" class="text-center">
      <span class="back d-flex align-items-center justify-content-center">
        <span>L</span>
        <span>o</span>
        <span>a</span>
        <span>d</span>
        <span>i</span>
        <span>n</span>
        <span>g</span>
      </span>
    </div>

    <div v-else>
      <!-- No Events Found -->
      <div v-if="visibleEvents.length === 0" class="text-center">
        <p>No events found for this category.</p>
      </div>

      <!-- Category Title and Description -->
      <div id="category-events" class="container mt-4">
        <div class="row mt-4">
          <div class="col text-center mb-4">
            <h1>{{ categoryName }} Events</h1>
            <h5>Discover exciting events in the {{ categoryName }} category!</h5>
          </div>
        </div>
      </div>

      <!-- Event Cards -->
      <div class="row mx-5">
        <router-link
          v-for="event in visibleEvents"
          :key="event.id"
          :to="{ name: 'EventDetail', params: { id: event.id } }"
          class="col-md-6 col-lg-4 mb-4 custom-link"
        >
          <Card class="custom-card" :class="isDarkMode ? 'dark' : 'light'">
            <div class="image-container">
              <img
                :src="event.images?.images?.[0]?.original_url || '/images/noimage.png'"
                class="card-img-top"
                :alt="event.name"
              />
              <div class="overlay">
                <span>{{ event.datetime_summary }}</span>
              </div>
            </div>
            <CardHeader class="p-2">
              <CardTitle>{{ event.name }}</CardTitle>
            </CardHeader>
            <CardContent class="px-2 mb-3">
              <p class="card-text">
                📍{{ event.location_summary }}
              </p>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, nextTick, onMounted, ref } from 'vue';
import { fetchEvents } from '@/api/eventsApi';
import { useEventStore } from '@/stores/eventStore';
import CardHeader from '@/components/ui/card/CardHeader.vue';
import Card from '@/components/ui/card/Card.vue';
import CardTitle from '@/components/ui/card/CardTitle.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import CardFooter from '@/components/ui/card/CardFooter.vue';
import anime from 'animejs';

const isDarkMode = inject('isDarkMode');
const categoryMapping = {
  1: [190, 6],
  2: [7],
  3: [23, 21, 1, 11],
  4: [3],
};

const categoryNames = {
  1: "Entertainment",
  2: "Sports",
  3: "Arts & Culture",
  4: "Business & Education",
  5: "Exhibitions",
};

const props = defineProps(["categoryId"]);
const visibleEvents = ref([]);
const categoryName = ref("");
const loading = ref(true);


const eventStore = useEventStore(); // Access the event store

// Fetch events based on the mapped category IDs
const fetchEventsForCategory = async (categoryIds) => {
  try {
    loading.value = true;
    const categoryParam = categoryIds.join(",");
    const events = await fetchEvents({
      category: categoryParam,
      order: "popularity",
      rows: 20,
    });

    // Update visible events for the category view
    visibleEvents.value = events;

    // Add each fetched event to the store if it's not already there
    events.forEach(event => {
      eventStore.addEventIfNotExists(event);
    });
  } catch (error) {
    console.error("Error fetching events:", error);
  } finally {
    loading.value = false;
  }
};

const animateCards = () => {
  anime({
    targets: ".custom-card",
    translateY: [50, 0],
    delay: anime.stagger(100),
    easing: "easeOutExpo",
  });
};

onMounted(() => {
  const apiCategoryIds = categoryMapping[props.categoryId] || [];
  categoryName.value = categoryNames[props.categoryId];
  fetchEventsForCategory(apiCategoryIds);
  nextTick(() => {
    animateCards();
  });
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

.back {
  margin: 1em auto;
  font-family: "Roboto";
  height: 100vh;
}
.back span {
  font-size: 3em;
  color: #ffd5b4;
  background: #262b37;
  display: table-cell;
  box-shadow: inset 0 0 5px rgba(38, 38, 38, 0.3), 0 5px 0 #000000;
  padding: 0 15px;
  line-height: 100px;
  animation: jumb 2s infinite;
  border-radius: 10px;
}
@keyframes jumb {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-30px);
    box-shadow: 0 15px 0 rgb(92, 44, 0);
  }
  100% {
    transform: translateY(0px);
  }
}
.back span:nth-child(1) {
  animation-delay: 0s;
}
.back span:nth-child(2) {
  animation-delay: 0.1s;
}
.back span:nth-child(3) {
  animation-delay: 0.2s;
}
.back span:nth-child(4) {
  animation-delay: 0.3s;
}
.back span:nth-child(5) {
  animation-delay: 0.4s;
}
.back span:nth-child(6) {
  animation-delay: 0.5s;
}
.back span:nth-child(7) {
  animation-delay: 0.6s;
}

.custom-card.light {
  background-color: rgb(255, 255, 255);
  height: 100%;
  border-radius: 0px;
  box-shadow: 7px 10px 10px rgba(15, 15, 15, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  transform: translateY(50px);
  color: black;
}

.custom-card.dark {
  background-color: rgb(0, 0, 0);
  height: 100%;
  border-radius: 0px;
  box-shadow: 7px 10px 10px rgba(240, 240, 240, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  transform: translateY(50px);
  color: rgb(245, 245, 245);
}

.animate-in {
  animation: fadeInUp 0.6s ease forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 1;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.custom-card:hover {
  transform: translateY(-5px);
  box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.25);
}

.image-container {
  position: relative;
}

.card-img-top {
  height: 200px;
  width: 100%;
  object-fit: cover;
  background-color: #ffffff;
  border-radius: 0px;
}

/* Responsive Image Height */
@media (max-width: 768px) {
  .card-img-top {
    height: 150px;
  }
}

@media (max-width: 576px) {
  .card-img-top {
    height: 120px;
  }
}

.overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
  color: #ffffffdd;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  font-family: Arial, sans-serif;
}

.btn-outline-primary {
  color: #b7765c !important;
  border: #b7765c solid 0.5px !important;
}

.btn-outline-primary:hover {
  background-color: #b9806a37 !important;
}

.btn-outline-primary.active {
  background-color: #b7765c !important;
  color: white !important;
}

.custom-link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.custom-link:hover {
  text-decoration: none;
}

.placeholder-box {
  margin: auto;
  height: 550px;
  font-size: 1rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
