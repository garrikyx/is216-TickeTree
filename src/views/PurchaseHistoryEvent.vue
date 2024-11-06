<template>
  <div id="app" v-if="event">
    <!-- Poster and Event Info Section -->
    <div class="poster-section">
      <img :src="event?.imageUrl" class="poster-img" alt="Event Poster" @error="handleImageError" />
      <div class="event-info">
        <h1 class="event-title"><strong>{{ event.eventName }}</strong></h1>
        <p class="order-id">Ticket ID: {{ orderId }}</p>
        <p class="event-date">Date: {{ formattedDate }}</p>
        <p class="event-location">{{ event.location }}</p>
        <p class="seat-number">Seat: {{ event.seat.join(', ') }}</p>
      </div>
    </div>

    <!-- Show QR Code Button -->
    <div class="ticket-section">
      <div class="ticket-info">
        <button class="show-qr-btn" @click="getTicket">Show QR Code</button>
      </div>
    </div>

    <!-- Digital Ticket Modal -->
    <transition name="fade">
      <div v-if="showTicket" class="modal-overlay" @click.self="showTicket = false">
        <div class="digital-ticket">
          <div class="ticket-header">
            <button class="close-btn" @click="showTicket = false">×</button>
            <h3 class="ticket-title">TickeTree</h3>
          </div>
          <div class="ticket-content">
            <h1 class="standard-ticket">{{ event?.eventName }}</h1>
            <div class="seat-info">
              <div class="seat-detail">
                <span class="label">SEC</span><br />
                <span class="value">{{ event.ticket.section }}</span>
              </div>
              <div class="seat-detail">
                <span class="label">ROW</span><br />
                <span class="value">{{ event.ticket.row }}</span>
              </div>
            </div>
            <br />
            <p v-if="message" class="unavailable-message">{{ message }}</p>
            <img v-else-if="qrCode" :src="qrCode" alt="QR Code" class="qr-code" />
          </div>
        </div>
      </div>
    </transition>
  </div>

  <div v-else>
    <p>Loading event details...</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineProps } from 'vue';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { getAuth } from 'firebase/auth';
import QRCode from 'qrcode';

const props = defineProps(['orderID']);
const event = ref(null);
const showTicket = ref(false);
const qrCode = ref(null);
const message = ref('');
const orderId = ref(props.orderID);

onMounted(() => {
  const auth = getAuth();
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      await fetchEventDetails();
    } else {
      console.log('User not authenticated, retrying...');
    }
  });
});

async function fetchEventDetails() {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser || !currentUser.email) return;

    const paymentCollectionRef = collection(db, 'payment');
    const orderIdQuery = query(paymentCollectionRef, where('orderId', '==', props.orderID));
    const orderIdSnapshot = await getDocs(orderIdQuery);

    if (!orderIdSnapshot.empty) {
      const doc = orderIdSnapshot.docs[0];
      const eventData = doc.data();

      event.value = {
        id: doc.id,
        eventName: eventData.eventName,
        date: eventData.eventDate,
        time: eventData.eventTime,
        location: eventData.eventLocation,
        imageUrl: eventData.imageUrl || '/images/noimage.png',
        seat: eventData.seatNumbers || [],
        ticket: eventData.ticket || { section: '151', row: '15' },
      };
    } else {
      console.error('No matching document found for the order ID:', props.orderID);
    }
  } catch (error) {
    console.error('Error fetching event details: ', error);
  }
}

const formattedDate = computed(() => {
  if (!event.value || !event.value.date) return '';
  const dateRange = event.value.date.split('-');

  if (dateRange.length === 2) {
    const startDate = dateRange[0].trim();
    const endDate = dateRange[1].trim();
    return `${startDate} - ${endDate}`;
  }

  return event.value.date;
});

async function generateQRCode() {
  const currentDate = new Date();
  let qrCodeAvailableDate;

  if (event.value.date.includes('-')) {
    const startDateStr = event.value.date.split('-')[0].trim();
    qrCodeAvailableDate = new Date(startDateStr + ' ' + new Date().getFullYear());
  } else {
    qrCodeAvailableDate = new Date(event.value.date + ' ' + new Date().getFullYear());
  }

  if (currentDate >= qrCodeAvailableDate) {
    try {
      const qrData = {
        eventName: event.value.eventName,
        date: event.value.date,
        location: event.value.location,
        orderId: props.orderID,
      };

      qrCode.value = await QRCode.toDataURL(JSON.stringify(qrData), { width: 200 });
      message.value = '';
    } catch (err) {
      console.error(err);
    }
  } else {
    message.value = `QR code will only be available on ${qrCodeAvailableDate.toDateString()}.`;
    qrCode.value = null;
  }
}

function handleImageError(event) {
  event.target.src = '/images/noimage.png';
}

function getTicket() {
  showTicket.value = true;
  generateQRCode();
}
</script>

<style scoped>
/* General Styles */
#app {
  font-family: 'Arial', sans-serif;
  color: #333;
  margin: 0;
  padding: 0;
}

/* Poster Section */
.poster-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f8f8f8;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.poster-img {
  width: 100%;
  max-width: 800px;
  border-radius: 12px;
  object-fit: cover;
}

.event-title {
  margin-bottom: 15px;
}

.event-info {
  text-align: center;
  margin-top: 20px;
  font-size: 18px;
}

/* Ticket Section */
.ticket-section {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.show-qr-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
}

.show-qr-btn:hover {
  background-color: #45a049;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.digital-ticket {
  width: 100%;
  max-width: 380px;
  background-color: #0a0a0a;
  border-radius: 20px;
  overflow: hidden;
  color: white;
}

.ticket-header {
  padding: 16px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #2a2a2a;
  position: relative;
}

.close-btn {
  position: absolute;
  left: 16px;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

.ticket-title {
  width: 100%;
  text-align: center;
  font-size: 20px;
  margin: 0;
}

.ticket-content {
  padding: 24px;
}

.standard-ticket {
  text-align: center;
  font-size: 25px;
  margin-bottom: 24px;
}

.seat-info {
  display: flex;
  justify-content: space-between;
  padding-left: 60px;
  padding-right: 60px;
}

.seat-detail {
  text-align: center;
}

.label {
  font-weight: bold;
}

.unavailable-message {
  color: red;
  text-align: center;
}

.qr-code {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  height: auto;
}
</style>
