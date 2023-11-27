<script setup>
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'
import { hexToRgb } from '@layouts/utils'

const vuetifyTheme = useTheme()

const props = defineProps({
 
  people: {
  type: String,
  required: true,
},
})

const emit = defineEmits([

'people',
])

console.log('props ws4')
console.log(props.people)
const series = [
parseInt(props.people.active_count),
parseInt(props.people.inactive_count),
]
console.log(series)

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
  const labelSuccessColor = `rgba(${ hexToRgb(currentTheme.success) },0.2)`
  const headingColor = `rgba(${ hexToRgb(currentTheme['on-background']) },${ variableTheme['high-emphasis-opacity'] })`

  const chartColors = {
    donut: {
      series1: currentTheme.success,
      series2: '#28c76fb3',
      series3: '#28c76f80',
      series4: labelSuccessColor,
    },
  }
  
  return {
    chart: {
      parentHeightOffset: 0,
      type: 'donut',
    },
    labels: [
      'Active',
      'Inactive',
     
    ],
    colors: [
      chartColors.donut.series1,
      chartColors.donut.series2,
      chartColors.donut.series3,
      chartColors.donut.series4,
    ],
    stroke: { width: 0 },
    dataLabels: {
      enabled: false,
      formatter(val) {
        return `${ parseInt(val) }%`
      },
    },
    legend: { show: false },
    tooltip: { theme: false },
    grid: {
      padding: {
        top: 15,
        right: -20,
        left: -20,
      },
    },
    states: { hover: { filter: { type: 'none' } } },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            value: {
              fontSize: '1.375rem',
              fontFamily: 'Public Sans',
              color: headingColor,
              fontWeight: 600,
              offsetY: -15,
              formatter(val) {
                return `${ parseInt(val) }%`
              },
            },
            name: {
              offsetY: 20,
              fontFamily: 'Public Sans',
            },
            total: {
              show: true,
              showAlways: true,
              color: currentTheme.success,
              fontSize: '.8125rem',
              label: 'Total',
              fontFamily: 'Public Sans',
              formatter() {
                return parseInt(props.people.camera_count)
              },
            },
          },
        },
      },
    },
  }
})
</script>

<template>
  <VCard>
    <VCardText class="d-flex justify-space-between">
      <div class="d-flex flex-column">
        <div class="mb-auto">
          <h6 class="text-h6 text-no-wrap mt-1">
           {{$t('Access Control')}}
          </h6>
         
        </div>
        <VueApexCharts
          :options="chartOptions"
          :series="[
parseInt(props.people.active_count),
parseInt(props.people.inactive_count),
]"
          :height="147"
          :width="200"
          class="ml-5"
        />
        <!--div>
          <h5 class="text-h5 mb-1">
           500
          </h5>
          <div class="text-sm">
            <VIcon
              icon="tabler-chevron-up"
              size="24"
              color="success"
              class="me-1"
            />
            <span class="text-success font-weight-medium">15.8% </span>
          </div>
        </div -->
      </div>
      <div>
      
      </div>
    </VCardText>
  </VCard>
</template>
