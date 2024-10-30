import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { fetchEvents } from '@/api/eventsApi';

export const useEventStore = defineStore('eventStore', {
  state: () => ({
    events: [],  
    selectedEvent: null,  
  }),

  actions: {
    async loadEvents() {
      if (this.events.length) return; 
      try {
        this.events = await fetchEvents({ order: 'popularity', rows: 20 });
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    },

    selectEventById(eventId) {
      this.selectedEvent = this.events.find(event => event.id === Number(eventId)) || null;
    }
  },
});
