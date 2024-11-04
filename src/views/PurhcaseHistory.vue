<template>
  <div class="container mt-4 purchase-history-section">
    <h1 class="text-center">Purchase History</h1>

    <!-- Toggle Buttons for Upcoming and Past Events -->
    <div class="toggle-buttons">
      <button :class="{ active: currentTab === 'upcoming' }" @click="currentTab = 'upcoming'">
        Upcoming Events
      </button>
      <button :class="{ active: currentTab === 'past' }" @click="currentTab = 'past'">
        Past Events
      </button>
    </div>

    <!-- Events List -->
    <div class="events-list">
      <!-- Check if there are no tickets in the filtered list -->
      <p v-if="filteredTickets.length === 0" class="no-tickets-message">No tickets available</p>
      
      <router-link
        v-for="ticket in filteredTickets"
        :key="ticket.id"
        :to="{ name: 'PurchaseHistoryEvent', params: { orderID: ticket.id } }"
        class="purchase-item-link"
      >
        <div class="purchase-item">
          <div class="event-image-container">
            <img :src="ticket.imageUrl" alt="Event Image" class="event-image" @error="handleImageError" />
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
            <p class="seat">Seat: {{ ticket.seatNumber }}</p>
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
import { db } from '../../firebase'; // Ensure this imports your Firebase config
import { getAuth } from 'firebase/auth';

const currentTab = ref("upcoming");
const ticketlist = ref([]);

// Fetch tickets on component mount
onMounted(fetchTickets);

async function fetchTickets() {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser || !currentUser.email) return; // Check if the user is logged in

    const paymentCollectionRef = collection(db, 'payment');
    const userTicketsQuery = query(
      paymentCollectionRef,
      where("customerEmail", "==", currentUser.email)
    );

    const querySnapshot = await getDocs(userTicketsQuery);

    ticketlist.value = querySnapshot.docs.map(doc => {
      const eventData = doc.data();
      const [startDate, endDate] = parseEventDate(eventData.eventDate);

      return {
        id: doc.id,
        eventName: eventData.eventName,
        startDate,
        endDate,
        seatNumber: eventData.seatNumber,
        price: eventData.totalPrice,
        quantity: eventData.quantity,
        imageUrl: eventData.imageUrl || "/images/noimage.png",
      };
    });
  } catch (error) {
    console.error("Error fetching tickets: ", error);
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

// Format date to a string
function formatDate(date) {
  if (date instanceof Date) {
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
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

.events-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.purchase-item {
  display: flex;
  align-items: center;
  background-color: #f1f2f5;
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
  color: black; /* Change event name color to black */
}

.date,
.seat {
  font-size: 0.9rem;
  color: #666;
  margin-top: 5px; /* Adjusted margin for equal spacing */
  margin-bottom: 5px; /* Added margin-bottom for consistency */
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
  color: black; /* Change price color to black */
}

.badge-status {
  font-size: 0.8rem;
  padding: 5px 10px;
  border-radius: 20px;
  background-color: green; /* Change badge color to green */
  color: #fff; /* Keep text color white for contrast */
  text-align: center;
}

.purchase-item-link {
  text-decoration: none; /* Remove underline */
}

.no-tickets-message {
  text-align: center;
  font-size: 1.2rem;
  color: #666; /* Optional: change color as needed */
  margin-top: 20px;
}

</style>
