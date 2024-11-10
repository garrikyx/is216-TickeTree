<template>
  <div class="container mt-4 purchase-history-section">
    <h1 class="text-center">Purchase History</h1>

    <!-- Toggle Buttons for Upcoming and Past Events -->
    <div class="toggle-buttons">
      <button :class="{ active: currentTab === 'upcoming' }" @click="setTab('upcoming')">
        Upcoming Events
      </button>
      <button :class="{ active: currentTab === 'past' }" @click="setTab('past')">
        Past Events
      </button>
    </div>

    <!-- Loading Message -->
    <p v-if="loading" class="loading-message">Loading tickets...</p>

    <!-- Events List -->
    <div v-else class="events-list">
      <p v-if="filteredTickets.length === 0" class="no-tickets-message">No tickets available</p>
      
      <router-link
        v-for="ticket in filteredTickets"
        :key="ticket.id"
        :to="{ name: 'PurchaseHistoryEvent', params: { orderID: ticket.id } }"
        class="purchase-item-link"
      >
        <div class="purchase-item">
          <div class="event-image-container">
            <img :src="ticket.imageUrl" alt="Event Image" class="event-image" loading="lazy" @error="handleImageError" />
          </div>
          <div class="event-details">
            <h2>{{ ticket.eventName }}</h2>
            <p class="date">
              Date:
              <span v-if="ticket.endDate">
                {{ formatDate(ticket.startDate) }} - {{ formatDate(ticket.endDate) }}
              </span>
              <span v-else>
                {{ formatDate(ticket.startDate) }}
              </span>
            </p>
            <p class="seat">Seat: {{ ticket.seatNumbers.join(', ') }}</p>
          </div>
          <div class="event-price">
            <span class="price">${{ ticket.price }}</span>
            <span class="badge-status paid">Paid</span>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { getAuth } from 'firebase/auth';

const currentTab = ref(localStorage.getItem("currentTab") || "upcoming");
const ticketlist = ref([]);
const loading = ref(true);  // Loading state

// Function to set the current tab and save it in localStorage
function setTab(tab) {
  currentTab.value = tab;
  localStorage.setItem("currentTab", tab);
}

// Fetch tickets when the component is mounted
onMounted(() => {
  const auth = getAuth();
  
  // Ensure we load tickets when the user is authenticated
  auth.onAuthStateChanged((user) => {
    if (user) {
      fetchTickets();
    }
  });
});

async function fetchTickets() {
  loading.value = true;  // Start loading
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    // Check if the user is authenticated
    if (!currentUser || !currentUser.uid) return;

    // Query the user's tickets from the database
    const paymentCollectionRef = collection(db, 'payment');
    const userTicketsQuery = query(
      paymentCollectionRef,
      where("userId", "==", currentUser.uid)
    );

    const querySnapshot = await getDocs(userTicketsQuery);

    // Map the documents to a ticket list
    ticketlist.value = querySnapshot.docs.map(doc => {
      const eventData = doc.data();
      const [startDate, endDate] = parseEventDate(eventData.eventDate);

      return {
        id: doc.id,
        eventName: eventData.eventName,
        startDate,
        endDate,
        seatNumbers: eventData.seatNumbers || [], 
        price: eventData.totalPrice,
        quantity: eventData.quantity,
        imageUrl: eventData.imageUrl || "/images/noimage.png",
      };
    });
  } catch (error) {
    console.error("Error fetching tickets: ", error);
  } finally {
    loading.value = false;  // Stop loading
  }
}

// Parses event dates and returns Date objects for start and end dates
function parseEventDate(eventDate) {
  if (eventDate.includes(" - ")) {
    const dateParts = eventDate.split(" - ");
    const start = new Date(`${dateParts[0]} ${new Date().getFullYear()}`);
    const end = new Date(`${dateParts[1]} ${new Date().getFullYear()}`);

    // Adjust for year transition if end date is earlier than start date
    if (end < start) {
      end.setFullYear(end.getFullYear() + 1);
    }

    return [start, end];
  } else {
    const singleDate = new Date(`${eventDate} ${new Date().getFullYear()}`);
    return [singleDate, null];
  }
}

// Filter tickets based on the current tab (upcoming or past)
const filteredTickets = computed(() => {
  const currentDate = new Date();
  return ticketlist.value.filter(ticket => {
    if (currentTab.value === 'upcoming') {
      return ticket.endDate ? ticket.endDate >= currentDate : ticket.startDate >= currentDate;
    } else {
      return ticket.endDate ? ticket.endDate < currentDate : ticket.startDate < currentDate;
    }
  });
});

// Set a fallback image if the original fails to load
function handleImageError(event) {
  event.target.src = "/images/noimage.png";
}

// Format date to a string in "Mon Nov 4" format
function formatDate(date) {
  if (date instanceof Date) {
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',  // Displays day of the week (e.g., Mon)
      day: 'numeric',    // Displays the numeric day (e.g., 4)
      month: 'short',    // Displays abbreviated month (e.g., Nov)
    });
  }
  return date;
}
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
  background-color: white;
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

.events-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.purchase-item {
  display: flex;
  align-items: center;
  background-color: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  width: 100%;
  gap: 16px;
}

.event-image-container {
  flex: 0 0 120px;
}

.event-image {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.event-details {
  flex-grow: 1;
}

.event-details h2 {
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0;
  color: black;
}

.date,
.seat {
  font-size: 0.9rem;
  color: #666;
  margin-top: 5px;
  margin-bottom: 5px;
}

.event-price {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100px;
}

.price {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 5px;
  color: black;
}

.badge-status {
  font-size: 0.8rem;
  padding: 5px 10px;
  border-radius: 20px;
  background-color: green;
  color: #fff;
  text-align: center;
}

.purchase-item-link {
  text-decoration: none;
}

.no-tickets-message,
.loading-message {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-top: 20px;
}
</style>
