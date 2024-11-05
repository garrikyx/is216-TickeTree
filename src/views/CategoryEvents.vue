<template>
  <div>
    <div v-if="loading" class="text-center">
      <p>Loading events...</p>
    </div>

    <div v-else>
      <!-- No events found -->
      <div v-if="visibleEvents.length === 0" class="text-center">
        <p>No events found for this category.</p>
      </div>

      <div id="category-events" class="container mt-4">
        <div class="row mt-4">
          <div class="col text-center mb-4">
            <h2>{{ categoryName }} Events</h2>
            <p>Discover exciting events in the {{ categoryName }} category!</p>
          </div>
        </div>

        <div class="row">
          <router-link
            v-for="event in visibleEvents"
            :key="event.id"
            :to="{ name: 'EventDetail', params: { id: event.id } }"
            class="col-md-4 mb-4"
            style="text-decoration: none; color: inherit;"
          >
            <div class="card h-100">
              <img
                :src="event.images?.images?.[0]?.original_url || '/images/noimage.png'"
                class="card-img-top"
                :alt="event.name"
              />
              <div class="card-body">
                <p class="fw-bold text-start mb-0">
                  <span class="fs-4">{{ event.datetime_summary }}</span>
                </p>
                <h5 class="card-title text-start">{{ event.name }}</h5>
                <p class="card-text text-start">
                  {{ event.location_summary }}<br />
                </p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { fetchEvents } from '@/api/eventsApi';
import { useEventStore } from '@/stores/eventStore';

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

onMounted(() => {
  const apiCategoryIds = categoryMapping[props.categoryId] || [];
  categoryName.value = categoryNames[props.categoryId];
  fetchEventsForCategory(apiCategoryIds);
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
</style>
