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

<script setup>
import { ref, onMounted } from 'vue';
import EventsList from "@/components/purchasehistory/EventList.vue"; // Adjusted import path
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase'; // Ensure this points to your Firebase config

const currentTab = ref("upcoming"); // Default tab is upcoming events
const ticketlist = ref([]); // Initialize ticketlist

// Fetch tickets when component mounts
onMounted(fetchTickets);

// Fetch tickets from Firestore
async function fetchTickets() {
  try {
    const paymentCollectionRef = collection(db, 'payment');
    const querySnapshot = await getDocs(paymentCollectionRef);
    
    // Map through documents and add necessary fields
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
        customerEmail: eventData.customerEmail,
        quantity: eventData.quantity,
        eventCategory: eventData.category // Ensure this exists in your Firestore documents
      };
    });
  } catch (error) {
    console.error("Error fetching tickets: ", error);
  }
}

// Parse the event date string into Date objects
function parseEventDate(eventDate) {
  // Check if the eventDate contains a range (indicated by " - ")
  if (eventDate.includes(" - ")) {
    const dateParts = eventDate.split(" - ");

    // Parse start date
    const [startDay, startDate, startMonth] = dateParts[0].split(" ").slice(1);
    const startDateObj = new Date(`${startDate} ${startMonth} ${new Date().getFullYear()}`);

    // Parse end date
    const [endDay, endDate, endMonth] = dateParts[1].split(" ").slice(1);
    const endDateObj = new Date(`${endDate} ${endMonth} ${new Date().getFullYear()}`);

    return [startDateObj, endDateObj];
  } else {
    // If there's no range, parse the single date
    const [day, date, month] = eventDate.split(" ").slice(1);
    const singleDateObj = new Date(`${date} ${month} ${new Date().getFullYear()}`);
    
    return [singleDateObj, null]; // Return null for the end date
  }
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
</style>
