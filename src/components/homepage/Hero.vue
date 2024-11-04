<!-- HeroSearch.vue -->
<template>
  <div
    class="hero-image d-flex flex-column w-100 position-relative align-items-center justify-content-center"
    :style="{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }"
  >
    <!-- Overlay -->
    <div
      class="bg-black position-absolute top-0 start-0 w-100 h-100 opacity-40"
    ></div>

    <!-- Content -->
    <div
      class="position-relative z-3 text-center w-100 px-4"
      style="max-width: 800px"
    >
      <div class="font-weight-bold text-white h2 mb-4">
        Find the hottest events today!
      </div>

      <!-- Search Input -->
      <div class="position-relative">
        <div class="d-flex bg-white p-3 rounded-5 shadow">
          <div class="d-flex align-items-center w-100">
            <i class="bi bi-search text-muted me-2"></i>
            <input
              type="text"
              placeholder="Search for Events..."
              class="form-control border-0"
              v-model="searchQuery"
              @input="handleSearch"
            />
          </div>
        </div>

        <!-- Search Results -->
        <div
          v-if="searchQuery.trim()"
          class="position-absolute w-100 mt-2 bg-white rounded shadow-lg overflow-hidden"
        >
          <div v-if="isSearching" class="p-4 text-muted text-center">
            Searching...
          </div>

          <template v-else>
            <div v-if="searchResults.length" class="search-results">
              <div
                v-for="event in searchResults"
                :key="event.id"
                class="p-3 border-bottom hover-bg-light cursor-pointer"
                @click="selectEvent(event)"
              >
                <RouterLink
                  :to="{ name: 'EventDetail', params: { id: event.id } }"
                  class="custom-link"
                >
                  <div class="d-flex align-items-center">
                    <div
                      class="flex-shrink-0"
                      style="width: 60px; height: 60px"
                    >
                      <img
                        :src="event.images.images[0].original_url"
                        :alt="event.title"
                        class="img-fluid rounded"
                        style="width: 100%; height: 100%; object-fit: cover"
                      />
                    </div>
                    <div class="ms-3 flex-grow-1">
                      <div class="d-flex justify-content-between">
                        <div class="fw-medium">{{ event.name }}</div>
                        <span class="small text-muted">{{
                          event.datetime_summary
                        }}</span>
                      </div>
                    </div>
                  </div>
                </RouterLink>
              </div>
            </div>
            <div v-else class="p-4 text-muted text-center">No events found</div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { fetchEvents } from "@/api/eventsApi";
import { ref, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";

// State
const backgroundImage = ref("/images/concert-hero.jpg");
const searchQuery = ref("");
const searchResults = ref([]);
const isSearching = ref(false);
const events = ref([]);

const performSearch = async (query) => {
  if (!query.trim()) {
    events.value = [];
    return;
  }

  try {
    isSearching.value = true;
    const response = await fetchEvents({
      order: "popularity",
      rows: 20,
    });
    let eventLs = [];
    for (let i of response) {
      if (i["name"].toLowerCase().includes(query)) {
        eventLs.push(i);
      }
    }
    events.value = eventLs;
    searchResults.value = events.value;
  } catch (error) {
    console.error("Failed to fetch events:", error);
  } finally {
    isSearching.value = false;
  }
};

// Debounced search
const debouncedSearch = useDebounceFn(performSearch, 300);

const handleSearch = () => {
  debouncedSearch(searchQuery.value);
};

const selectEvent = (event) => {
  console.log("Selected event:", event);
  // Add your event selection logic here
  // For example, emit an event or navigate to event details
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};
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

.cursor-pointer {
  cursor: pointer;
}

.hover-bg-light:hover {
  background-color: #f8f9fa;
}

.search-results {
  max-height: 300px;
  overflow-y: auto;
}

.border-bottom:last-child {
  border-bottom: none !important;
}

@media (max-width: 768px) {
  .hero-image {
    padding: 0 1rem;
  }
}


.custom-link {
  color: inherit;          
  text-decoration: none;   
}

.custom-link:hover {
  text-decoration: none;
}

</style>