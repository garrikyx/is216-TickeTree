<template>
    <div class="chart-container">
      <h2 class="text-xl font-bold mb-4">Interactive Ticket Price Analysis</h2>
      <canvas ref="chartRef"></canvas>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import Chart from 'chart.js/auto'
  
  export default {
    name: 'TicketPriceChart',
    
    setup() {
      const chartRef = ref(null)
      let chart = null
  
      const ticketData = {
        labels: ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05', '2024-01-06'],
        datasets: [
          {
            label: 'Ticket Price ($)',
            data: [50, 55, 45, 60, 65, 70],
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: '#2563eb',
            pointHoverBackgroundColor: '#1e40af',
            pointBorderColor: '#ffffff',
            pointHoverBorderColor: '#ffffff',
            pointBorderWidth: 2,
          },
          {
            label: 'Demand',
            data: [30, 25, 35, 40, 50, 45],
            borderColor: '#f97316',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: '#f97316',
            pointHoverBackgroundColor: '#ea580c',
            pointBorderColor: '#ffffff',
            pointHoverBorderColor: '#ffffff',
            pointBorderWidth: 2,
          }
        ]
      }
  
      const createChart = () => {
        const ctx = chartRef.value.getContext('2d')
        
        chart = new Chart(ctx, {
          type: 'line',
          data: ticketData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              intersect: false,
              mode: 'index',
            },
            plugins: {
              tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#1f2937',
                bodyColor: '#1f2937',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                usePointStyle: true,
                callbacks: {
                  label: function(context) {
                    const label = context.dataset.label || ''
                    const value = context.parsed.y
                    return `${label}: ${context.dataset.label.includes('$') ? '$' : ''}${value}`
                  }
                }
              },
              legend: {
                position: 'top',
                labels: {
                  usePointStyle: true,
                  pointStyle: 'circle',
                  padding: 20,
                  font: {
                    size: 12,
                    family: "'Inter', sans-serif"
                  }
                }
              }
            },
            scales: {
              x: {
                grid: {
                  display: false
                },
                ticks: {
                  font: {
                    size: 12,
                    family: "'Inter', sans-serif"
                  }
                }
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: '#f3f4f6'
                },
                ticks: {
                  font: {
                    size: 12,
                    family: "'Inter', sans-serif"
                  },
                  callback: function(value, index, values) {
                    return '$' + value
                  }
                }
              }
            }
          }
        })
      }
  
      onMounted(() => {
        createChart()
      })
  
      onBeforeUnmount(() => {
        if (chart) {
          chart.destroy()
        }
      })
  
      return {
        chartRef
      }
    }
  }
  </script>
  
  <style scoped>
  .chart-container {
    width: 100%;
    height: 400px;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  }
  </style>