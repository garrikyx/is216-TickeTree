<template>
  <div class="container mt-4 purchase-history-section">
    <h1 class="text-center">Purchase History</h1>

    <!-- Toggle Buttons for Upcoming and Past Events -->
    <div class="toggle-buttons">
      <button
        :class="{ active: currentTab === 'upcoming' }"
        @click="currentTab = 'upcoming'"
      >
        Upcoming Events
      </button>
      <button
        :class="{ active: currentTab === 'past' }"
        @click="currentTab = 'past'"
      >
        Past Events
      </button>
    </div>

    <!-- Events List Component -->
    <EventsList :tickets="ticketlist" :currentTab="currentTab" />
  </div>
</template>

<script>
import EventsList from "@/components/purchasehistory/EventList.vue"; // Adjusted import path
import { purchasedTickets } from "@/data/tickets";
import { onMounted } from 'vue';

export default {
  name: "PurchaseHistory",
  components: {
    EventsList,
  },
  data() {
    return {
      currentTab: "upcoming", // Default tab is upcoming events
      ticketlist:purchasedTickets
    };
  },
};
</script>

<style scoped>
.purchase-history-section {
  padding: 20px;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
}

.toggle-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.toggle-buttons button {
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
  transition: background-color 0.3s ease;
}

.toggle-buttons button:last-child {
  margin-right: 0;
}

.toggle-buttons button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}
</style>