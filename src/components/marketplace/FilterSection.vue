<template>
  <div class="d-flex justify-content-start align-items-center mb-3">
    <div class="dropdown">
      <button
        class="btn btn-secondary dropdown-toggle"
        type="button"
        id="filterDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Filter
      </button>
      
      <!-- Custom dropdown menu -->
      <div class="dropdown-menu p-3" aria-labelledby="filterDropdown">
        <div class="row gx-5">
          <!-- Column for categories -->
          <div class="col-md-6">
            <h6>Categories</h6>
            <ul class="list-unstyled">
              <!-- Select All option -->
              <li>
                <a class="dropdown-item" @click="selectAllCategories">All Categories</a>
              </li>
              <!-- Render categories -->
              <li v-for="category in categories" :key="category">
                <a class="dropdown-item" @click="setCategory(category)">
                  {{ category }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Column for sort options -->
          <div class="col-md-6">
            <h6>Sort Options</h6>
            <ul class="list-unstyled">
              <li v-for="(sort, index) in sortOptions" :key="index">
                <a class="dropdown-item" @click="setSortOption(sort)">
                  {{ sort.label }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Selected filters badges -->
    <div class="ms-3">
      <span
        v-for="filter in selectedFilters"
        :key="filter"
        class="badge bg-info me-2"
      >
        {{ filter }}
        <button 
          type="button" 
          class="btn-close btn-close-white ms-2" 
          aria-label="Remove" 
          @click="removeFilter(filter)"
        ></button>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterSection',
  props: {
    selectedFilters: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      categories: [
        'Entertainment',
        'Sports',
        'Arts & Culture',
        'Conferences & Conventions',
        'Travel & Adventure'
      ],
      sortOptions: [
        { label: 'Price: Low to High', event: 'setPrice', value: 'low' },
        { label: 'Price: High to Low', event: 'setPrice', value: 'high' },
        { label: 'Date: Earliest First', event: 'setDate', value: 'ascending' },
        { label: 'Date: Latest First', event: 'setDate', value: 'descending' }
      ]
    }
  },
  methods: {
    // Emit event to set a single category
    setCategory(category) {
      this.$emit('setCategory', category);
    },

    // Emit event for selecting all categories
    selectAllCategories() {
      this.$emit('setAllCategories', this.categories);
    },

    // Emit event to set sort option
    setSortOption(sort) {
      this.$emit(sort.event, sort.value);
    },

    // Emit event to remove a filter
    removeFilter(filter) {
      this.$emit('removeFilter', filter);
    }
  }
}
</script>

<style scoped>
.dropdown-menu {
  width: 400px;
}

.row.gx-5 {
  gap: 30px;
}
</style>