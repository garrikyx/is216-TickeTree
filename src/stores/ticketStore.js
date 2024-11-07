import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { db } from '../../firebase.js';
import { collection, getDocs } from 'firebase/firestore';

export const useTicketStore = defineStore('ticketStore', () => {
  // State
  const tickets = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const selectedFilters = ref([]);
  const priceRange = ref([0, 1800]);
  const sortConfig = ref({
    type: null, // 'price' or 'date'
    order: null // 'low'/'high' for price, 'ascending'/'descending' for date
  });

  // Getters
  const filteredTickets = computed(() => {
    let filtered = [...tickets.value];

    // Apply category filters
    if (selectedFilters.value.length > 0) {
      filtered = filtered.filter(ticket => 
        selectedFilters.value.includes(ticket.category)
      );
    }

    // Apply price range filter
    filtered = filtered.filter(ticket => 
      ticket.price >= priceRange.value[0] && 
      ticket.price <= priceRange.value[1]
    );

    // Apply sorting
    if (sortConfig.value.type === 'price') {
      filtered.sort((a, b) => {
        return sortConfig.value.order === 'low' 
          ? a.price - b.price 
          : b.price - a.price;
      });
    } else if (sortConfig.value.type === 'date') {
      filtered.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortConfig.value.order === 'ascending'
          ? dateA - dateB
          : dateB - dateA;
      });
    }

    return filtered;
  });

  // Actions
  async function fetchTickets() {
    loading.value = true;
    error.value = null;
    try {
      const querySnapshot = await getDocs(collection(db, 'ticket'));
      tickets.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (err) {
      error.value = 'Failed to fetch tickets';
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  function getTicketsByEvent(eventId) {
    return tickets.value.filter((ticket) => ticket.eventId === eventId);
  }

  function toggleCategoryFilter(category) {
    const index = selectedFilters.value.indexOf(category);
    if (index === -1) {
      selectedFilters.value.push(category);
    } else {
      selectedFilters.value.splice(index, 1);
    }
  }

  function setAllCategories(categories) {
    selectedFilters.value = [...categories];
  }

  function setPriceRange(range) {
    priceRange.value = range;
  }

  function sortByPrice(order) {
    sortConfig.value = { type: 'price', order };
  }

  function sortByDate(order) {
    sortConfig.value = { type: 'date', order };
  }

  function removeFilter(filter) {
    const index = selectedFilters.value.indexOf(filter);
    if (index !== -1) {
      selectedFilters.value.splice(index, 1);
    }
  }

  return {
    // State
    tickets,
    loading,
    error,
    selectedFilters,
    priceRange,
    sortConfig,
    
    // Getters
    filteredTickets,
    
    // Actions
    fetchTickets,
    getTicketsByEvent,
    toggleCategoryFilter,
    setAllCategories,
    setPriceRange,
    sortByPrice,
    sortByDate,
    removeFilter
  };
});
