<template>
  <h1 class="ml1">
    <span class="text-wrapper">
      <span class="line line1"></span>
      <span class="letters">Purchase History</span>
      <span class="line line2"></span>
    </span>
  </h1>
  <!-- Loading Message -->
  <span
    v-if="loading"
    class="back d-flex align-items-center justify-content-center"
  >
    <span>L</span><span>o</span><span>a</span><span>d</span><span>i</span
    ><span>n</span><span>g</span>
  </span>

  <!-- Events List -->
  <div v-else class="events-list container">
    <div class="container mt-4 purchase-history-section">

      <!-- Nav Pills for Upcoming and Past Events -->
      <ul class="nav nav-pills justify-content-center mb-4">
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: currentTab === 'upcoming' }"
            @click.prevent="setTab('upcoming')"
            href="#1"
            data-toggle="tab"
          >
            Upcoming Events
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: currentTab === 'past' }"
            @click.prevent="setTab('past')"
            data-toggle="tab"
            href="#2"
          >
            Past Events
          </a>
        </li>
      </ul>

      <p v-if="filteredTickets.length === 0" class="no-tickets-message">
        No tickets available
      </p>

      <router-link
        v-for="ticket in filteredTickets"
        :key="ticket.id"
        :to="{ name: 'PurchaseHistoryEvent', params: { orderID: ticket.id } }"
        class="purchase-item-link"
      >
        <div class="purchase-item row justify-content-center">
          <div class="event-image-container">
            <img
              :src="ticket.imageUrl"
              alt="Event Image"
              class="event-image"
              loading="lazy"
              @error="handleImageError"
            />
          </div>
          <div class="event-details col col-12 col-md-auto">
            <h2 class="text-center text-md-start">{{ ticket.eventName }}</h2>
            <p class="date text-center text-md-start">
              Date:
              <span v-if="ticket.endDate">
                {{ formatDate(ticket.startDate) }} -
                {{ formatDate(ticket.endDate) }}
              </span>
              <span v-else>
                {{ formatDate(ticket.startDate) }}
              </span>
            </p>
            <p class="seat text-center text-md-start">
              Seat: {{ ticket.seatNumbers.join(", ") }}
            </p>
          </div>
          <div class="event-price col col-12 col-md-auto">
            <span class="price">${{ ticket.price }}</span>
            <span class="badge-status paid w-100 w-md-25">Paid</span>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import anime from "animejs/lib/anime.es.js";
import { ref, computed, onMounted, nextTick } from "vue";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { getAuth } from "firebase/auth";

const currentTab = ref(localStorage.getItem("currentTab") || "upcoming");
const ticketlist = ref([]);
const loading = ref(true); // Loading state

// Function to set the current tab and save it in localStorage
function setTab(tab) {
  currentTab.value = tab;
  localStorage.setItem("currentTab", tab);
}
function initializeAnimation() {
  const textWrapper = document.querySelector('.ml1 .letters');
  if (textWrapper) {
    textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

    anime.timeline()
      .add({
        targets: '.ml1 .letter',
        scale: [0.3,1],
        opacity: [0,1],
        translateZ: 0,
        easing: "easeOutExpo",
        duration: 600,
        delay: (el, i) => 70 * (i+1)
      }).add({
        targets: '.ml1 .line',
        scaleX: [0,1],
        opacity: [0.5,1],
        easing: "easeOutExpo",
        duration: 700,
        offset: '-=875',
        delay: (el, i, l) => 80 * (l - i)
      })
  }
}
// Fetch tickets when the component is mounted
onMounted(async() => {
  // Wait for DOM to be ready and check if element exists
  await nextTick();
  initializeAnimation();
  const auth = getAuth();

  // Ensure we load tickets when the user is authenticated
  auth.onAuthStateChanged((user) => {
    if (user) {
      fetchTickets().then(() => {
        // Only run animation if there are purchase items
        const purchaseItems = document.querySelectorAll(".purchase-item");
        if (purchaseItems.length > 0) {
          anime({
            targets: ".purchase-item",
            translateY: [100, 0],
            opacity: [0, 1],
            duration: 1000,
            easing: "easeOutExpo",
            delay: anime.stagger(100), // Add stagger effect for multiple items
          });
        }
      });
    }
  });
});

async function fetchTickets() {
  loading.value = true;
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser || !currentUser.uid) return;

    const paymentCollectionRef = collection(db, "payment");
    const userTicketsQuery = query(
      paymentCollectionRef,
      where("userId", "==", currentUser.uid)
    );

    const querySnapshot = await getDocs(userTicketsQuery);

    ticketlist.value = querySnapshot.docs.map((doc) => {
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
    loading.value = false; // Stop loading
  }
}

// Parses event dates and returns Date objects for start and end dates
function parseEventDate(eventDate) {
  if (eventDate.includes(" - ")) {
    const dateParts = eventDate.split(" - ");
    const start = new Date(`${dateParts[0]} ${new Date().getFullYear()}`);
    const end = new Date(`${dateParts[1]} ${new Date().getFullYear()}`);

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
  return ticketlist.value.filter((ticket) => {
    if (currentTab.value === "upcoming") {
      return ticket.endDate
        ? ticket.endDate >= currentDate
        : ticket.startDate >= currentDate;
    } else {
      return ticket.endDate
        ? ticket.endDate < currentDate
        : ticket.startDate < currentDate;
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
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
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

.nav-pills .nav-link {
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.nav-pills .nav-link.active {
  background-color: #007bff;
  color: white;
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
  box-shadow: 7px 2px 10px #b7765c;
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

html {
  height: 90%;
}

.back {
  margin: 90px 0px 0px 0px;
  font-family: "Roboto";
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
.ml1 {
  font-weight: 900;
  font-size: 3.5em;
  text-align: center;
  margin-top: 20px;
}

.ml1 .letter {
  display: inline-block;
  line-height: 1em;
}

.ml1 .text-wrapper {
  position: relative;
  display: inline-block;
  padding-top: 0.1em;
  padding-right: 0.05em;
  padding-bottom: 0.15em;
}

.ml1 .line {
  opacity: 0;
  position: absolute;
  left: 0;
  height: 3px;
  width: 100%;
  background-color: #fff;
  transform-origin: 0 0;
}

.ml1 .line1 {
  top: 0;
}
.ml1 .line2 {
  bottom: 0;
}
</style>
