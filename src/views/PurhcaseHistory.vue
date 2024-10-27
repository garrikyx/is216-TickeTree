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
    <EventsList :tickets="purchasedTickets" :currentTab="currentTab" />
  </div>
</template>

<script>
import EventsList from "@/components/purchasehistory/EventList.vue"; // Adjusted import path

export default {
  name: "PurchaseHistory",
  components: {
    EventsList,
  },
  data() {
    return {
      currentTab: "upcoming", // Default tab is upcoming events
      purchasedTickets: [
        {
          id: 1,
          eventName: "Tate McRae Concert",
          location: "The Star Theatre",
          category: "Entertainment",
          seatCategory: "VIP",
          section: "A1",
          seatNumber: 15,
          price: 120,
          date: "2024-10-31",
          time: "7:00 PM",
          image: "/marketplace-images/tatemcrae.jpg",
        },
        {
          id: 2,
          eventName: "HSBC Rugby Sevens 2024",
          location: "Singapore National Stadium",
          category: "Sports",
          seatCategory: "General",
          section: "B2",
          seatNumber: 42,
          price: 180,
          date: "2024-05-03",
          time: "5:00 PM",
          image: "/marketplace-images/rugby7.png",
        },
        {
          id: 3,
          eventName: "The World of Studio Ghibli",
          location: "ArtScience Museum",
          category: "Arts & Culture",
          seatCategory: null,
          section: null,
          seatNumber: null,
          price: 20,
          date: "2024-10-22",
          time: "6:00 PM",
          image: "/marketplace-images/studioghibli.jpg",
        },
        {
          id: 4,
          eventName: "TechX Summit 2024",
          location: "Sands Expo & Convention Centre",
          category: "Conferences & Conventions",
          seatCategory: "VIP",
          section: "D1",
          seatNumber: 5,
          price: 270,
          date: "2024-04-03",
          time: "9:00 AM",
          image: "/marketplace-images/techsummit.jpg",
        },
        {
          id: 5,
          eventName: "Taiwan Adventure Trip",
          location: "Taiwan",
          category: "Travel & Adventure",
          seatCategory: null,
          section: null,
          seatNumber: null,
          price: 180,
          date: "2025-03-15",
          time: "All Day",
          image: "/marketplace-images/taiwan.png",
        },
        {
          id: 6,
          eventName: "Ed Sheeran Tour 2024",
          location: "Singapore National Stadium",
          category: "Entertainment",
          seatCategory: "2",
          section: "D",
          seatNumber: "68",
          price: 1800,
          date: "2024-02-16",
          time: "8:00 PM",
          image: "/marketplace-images/edsheeran.jpg",
        },
        {
          id: 7,
          eventName: "Dua Lipa - Radical Optimism Tour",
          location: "Singapore Indoor Stadium",
          category: "Entertainment",
          seatCategory: "3",
          section: "C",
          seatNumber: "12",
          price: 168,
          date: "2024-11-05",
          time: "7:00 PM",
          image: "/marketplace-images/dualipa.jpg",
        },
      ],
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