<script setup>
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'
import { hexToRgb } from '@layouts/utils'
import { serverURL, URL, token } from "@/helpers/token"
import axios from "@axios"
import moment from 'moment';

const props = defineProps({
 
 date:{
   type:String,
   required:true,
 }
})
const eventlogs = ref([])
const gates=ref([])
const data=ref([])

var series = [{
            data:data.value,
          }]

const fetcheventlogs = (dt) => {
        axios
            .post(
                URL() + `/widgets/event_logs`,
                {
                    requestType: "view",
                    queryDataTime:moment(props.date, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm')
         
                },
                { headers: { Authorization: token() } }
            )
            .then((response) => {
            
                //   this.listings = response.data;
                console.log("event logs axios")
                console.log(response.data.data)
                eventlogs.value = response.data.data

                eventlogs.value.forEach(item => {
                  gates.value.push(item.gate)
                  data.value.push(item.count)

                })
                console.log(props.date)
                console.log(gates.value)
                console.log(data.value)
               
 
            })
            .catch((error) => {
                //   isErrorAlertVisible.value=true
                //   isAlertVisible.value=false
                //   err.value=error
                console.error(error);
			
            });
    };

    //watchEffect(fetcheventlogs(props.date))

    // Watch for changes in the prop
watchEffect(() => {
  
  gates.value=[]
  data.value=[]
  series = [{
            data:data.value,
          }]
  fetcheventlogs(props.date)
     
       //   chartOptions()
});
   

  //   setTimeout(() => {  
     
  //     watchEffect(fetcheventlogs())
  //     series = [{
  //           data:data.value,
  //         }]
  //         chartOptions()
  //  }, 5000);

const vuetifyTheme = useTheme()



const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
  
const labelColor = `rgba(${ hexToRgb(currentTheme['on-surface']) },${ variableTheme['disabled-opacity'] })`

  return {
    chart: {
      height: 90,
      type: 'line',
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    labels: [
    ...gates.value
    ],
    grid: {
      borderColor: `rgba(${ hexToRgb(String(variableTheme['border-color'])) },${ variableTheme['border-opacity'] })`,
      strokeDashArray: 6,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
      padding: {
        top: -18,
        left: -4,
        right: 7,
        bottom: -10,
      },
    },
    colors: [currentTheme.info],
    stroke: { width: 2 },
    tooltip: {
      enabled: false,
      shared: false,
      intersect: true,
      x: { show: false },
    },
    xaxis: {

      categories: gates.value,
        labels: {
          style: {
            fontSize: '14px',
            colors: labelColor,
            fontFamily: 'Public Sans',
          },
        },
      
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: { labels: { show: false } },
    markers: {
      size: 3.5,
      fillColor: currentTheme.info,
      strokeColors: 'transparent',
      strokeWidth: 3.2,
      discrete: [{
        seriesIndex: 0,
        dataPointIndex: 5,
        fillColor: currentTheme.surface,
        strokeColor: currentTheme.info,
        size: 5,
        shape: 'circle',
      }],
      hover: { size: 5.5 },
    },
    responsive: [{
      breakpoint: 960,
      options: { chart: { height: 110 } },
    }],
  }
})
</script>

<template>
  <VCard>
    <VCardText>
      <div class="pb-2">
        <h6 class="text-h6 mt-1">
          {{$t('Entry Logs')}} 
        </h6>
       
      </div>

      <VueApexCharts
        type="line"
        :options="chartOptions"
        :series="series"
        :height="90"
      />

     
    </VCardText>
  </VCard>
</template>
