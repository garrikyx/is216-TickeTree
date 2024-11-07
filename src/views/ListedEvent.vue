<template>
    <div class="container mt-4">
      <!-- Event Poster and Details -->
      <div class="poster text-center">
        <img
          :src="event?.imageUrl || '/images/noimage.png'"
          class="img-fluid shadow-lg rounded poster-img"
          alt="Event Poster"
        />
      </div>
      <hr class="custom-hr" />
  
      <div class="text-center mt-4">
        <h2 class="event-title">{{ event?.eventName || "Event Title" }}</h2>
        <p><i class="bi bi-calendar-event"></i> {{ event?.date || "TBD" }}</p>
        <p><i class="bi bi-clock"></i> {{ event?.time || "TBD" }}</p>
        <p><i class="bi bi-geo-alt"></i> {{ event?.location || "Location Unknown" }}</p>
        <p>{{ event?.description || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum." }}</p>
      </div>
      <!-- Ticket Purchase Button -->
      <div class="mt-4 d-flex justify-content-center">
        <button @click="handleTicketPurchase" class="btn btn-success btn-lg">Buy Ticket</button>
      </div>
    </div>
  
      <!-- Price History Chart Section -->
      <div class="mt-4">
        <h5>Price History</h5>
        <Chart/>
      </div>
  
  
  </template>
  
  <script>
  import { ref, onMounted, computed } from "vue";
  import { useRoute } from "vue-router";
  import { useTicketStore } from "@/stores/ticketStore";
  import Chart from "@/components/marketplace/Chart.vue";
  
  export default {
    name: "ListedEvent",
    components: {
      Chart,
    },
    setup() {
      const route = useRoute();
      const eventId = route.params.id;
      const event = ref(null);
      const priceHistoryData = ref([]);
      const ticketStore = useTicketStore();
  
      // Fetch event details and related tickets on mount
      onMounted(async () => {
        // Fetch specific event details if available
        event.value = await ticketStore.fetchTicketById(eventId);
      });
  
  
      // Handle ticket purchase action
      function handleTicketPurchase() {
        console.log("Ticket purchase initiated for event:", event.value?.name);
        // Additional purchase logic can be added here
      }
  
      return {
        event,
        priceHistoryData,
        handleTicketPurchase,
      };
    },
  };
  </script>
  
  <style scoped>
  .poster-img {
    max-height: 400px;
    border-radius: 10px;
  }
  
  .event-title {
    font-size: 2.5em;
    font-weight: bold;
  }
  
  hr.custom-hr {
    border: 1px solid #ddd;
    width: 80%;
  }
  
  .container {
    margin-top: 20px;
  }
  </style>
  