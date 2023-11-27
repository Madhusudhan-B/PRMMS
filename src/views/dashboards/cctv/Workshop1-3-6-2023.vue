<script setup>
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'
import { hexToRgb } from '@layouts/utils'
import { getLineChartSimpleConfig } from '@core/libs/apex-chart/apexCharConfig'

const vuetifyTheme = useTheme()

const series = [
  85,
  2,
]

const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
  const labelSuccessColor = `rgba(${ hexToRgb(currentTheme.primary) },0.2)`
  const headingColor = `rgba(${ hexToRgb(currentTheme['on-background']) },${ variableTheme['high-emphasis-opacity'] })`

  const chartColors = {
    donut: {
      series1: currentTheme.primary,
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
      'IN',
      'OUT',
     
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
              color: currentTheme.primary,
              fontSize: '.8125rem',
              label: 'Total',
              fontFamily: 'Public Sans',
              formatter() {
                return '87'
              },
            },
          },
        },
      },
    },
  }
})



const balanceChartConfig = computed(() => getLineChartSimpleConfig(vuetifyTheme.current.value))

const chartseries = [{
  data: [
    
    50,
    16,
    35,
    20,
    70,
    50,
  ],
}]

</script>

<template>
  <VCard>
    <VCardText class="d-flex justify-space-between">
      <div class="d-flex flex-column">
        <div class="mb-auto">
          <h6 class="text-h6 text-no-wrap mt-1 ml-30">
            CCTV
          </h6>
         
        </div>

        <VueApexCharts
          :options="chartOptions"
          :series="series"
          :height="147"
          :width="130"
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
        <div class="mb-auto">

        </div>
        <VueApexCharts
    type="line"
    height="147"
    :options="balanceChartConfig"
    :series="chartseries"
    class="mt-8"
  /> 

      </div>
    </VCardText>
  </VCard>
</template>
