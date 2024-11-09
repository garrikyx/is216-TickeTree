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

    <!-- New Card -->
    <div class="row mx-5">
      <div
        v-for="event in filteredEvents"
        :key="event.id"
        class="col-md-6 col-lg-4 mb-4"
      >
        <Card class="custom-card">
          <RouterLink
            :to="{ name: 'EventDetail', params: { id: event.id } }"
            class="custom-link"
            ><div class="image-container">
              <img
                :src="
                  event.images?.images[0]?.original_url || '/images/noimage.png'
                "
                class="card-img-top"
                :alt="event.name"
              />
              <div class="overlay">
                <div class="fw-light">{{ event.datetime_summary }}</div>
              </div>
            </div>
            <CardHeader class="p-2">
              <CardDescription class="m-0 fst-italic fw-lighter">{{
                event.category.name
              }}</CardDescription>
              <CardTitle>{{ event.name }}</CardTitle>
            </CardHeader>
            <CardContent class="px-2 mb-3">
              <div>📍{{ event.location_summary }}</div>
              <div class="mt-3">Description: 
                <span class="fw-lighter">{{ truncateDescription(event.description) }}</span>
              </div>
            </CardContent>
            <CardFooter> </CardFooter>
          </RouterLink>
        </Card>
      </div>
    </div>

    <!-- Show More Button for Popular view only -->
    <div class="row text-center mx-4" v-if="currentFilter === 'Popular'">
      <div class="col">
        <button
          class="mb-5 mt-2 btn btn-outline-primary"
          @click="toggleShowMore"
        >
          {{ showAllEvents ? "Show Less" : "Show More" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ref, computed, onMounted } from "vue";
import { useEventStore } from "@/stores/eventStore";

const filters = ["Popular", "Recently Viewed"];
const currentFilter = ref("Popular");

const setFilter = (filter) => {
  currentFilter.value = filter;
};

const visibleCount = ref(3);
const showAllEvents = ref(false);

const toggleShowMore = () => {
  showAllEvents.value = !showAllEvents.value;
  visibleCount.value = showAllEvents.value ? eventStore.events.length : 3;
};
const truncateDescription = (text, maxLength = 100) => {
  return text && text.length > maxLength
    ? text.substring(0, maxLength) + "..."
    : text;
};

const eventStore = useEventStore();

onMounted(() => {
  eventStore.loadEvents();
});

const filteredEvents = computed(() => {
  if (currentFilter.value === "Recently Viewed") {
    return eventStore.recentlyViewed;
  } else {
    return eventStore.events.slice(0, visibleCount.value);
  }
});
</script>

<style>


.custom-card {
  background-color: rgb(255, 255, 255);
  height: 550px;
  border-radius: 0px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15)!important;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.custom-card:hover {
  transform: translateY(-5px); /* Lift the card on hover */
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25); /* Darker shadow on hover */
}

.card {
  transition: transform 0.2s;
  border: none;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  height: 450px;
}

.card:hover {
  transform: translateY(-5px);
}

.image-container {
  position: relative;
}

.card-img-top {
  height: 200px; /* Default height for larger screens */
  width: 100%;
  object-fit: cover;
  position: relative;
  background-color: #e0e0e0;
  border-radius: 0px;
}

/* Adjust height for smaller screens */
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
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9),
    rgba(0, 0, 0, 0.8),
    rgba(0, 0, 0, 0.7),
    rgba(0, 0, 0, 0)
  );
  color: #ffffffe2;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  font-family: Arial, sans-serif;
}

.btn-outline-primary.active {
  background-color: var(--bs-primary);
  color: white;
}

.custom-link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.custom-link:hover {
  text-decoration: none;
}
</style>
