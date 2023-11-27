<script setup>
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'
import { getLineChartSimpleConfig } from '@core/libs/apex-chart/apexCharConfig'
// Import the moment library
import moment from 'moment';

const vuetifyTheme = useTheme()
const balanceChartConfig = computed(() => getLineChartSimpleConfig(vuetifyTheme.current.value))

import { serverURL, URL, token } from "@/helpers/token"
import axios from "@axios"


const eventlogs = ref([])

const list=ref([])

const props = defineProps({
 
 date:{
   type:String,
   required:true,
 }
})

const  formatDate=(date)=>{
  var year = date.getFullYear();
  var month = date.getMonth() + 1; // Note: January is 0
  var day = date.getDate();
  return year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
}

const fetcheventlogs = () => {
  // Get the current date
var currentDate = new Date();

// Subtract 7 days
var startDate = new Date();
startDate.setDate(startDate.getDate() - 7);

// Format the dates
var startDateFormatted = formatDate(startDate);
var currentDateFormatted = formatDate(currentDate);

// Display the dates
console.log("Start Date: " + startDateFormatted);
console.log("Current Date: " + currentDateFormatted);
        axios
            .post(
                URL() + `/widgets/rfid_repairs`,
                {
                    requestType: "view",
                    start_date:startDateFormatted,
                    end_date:currentDateFormatted
                },
                { headers: { Authorization: token() } }
            )
            .then((response) => {
             
                //   this.listings = response.data;
                console.log("event logs axios")
                console.log(response.data.data)
                eventlogs.value = response.data.data

                eventlogs.value.forEach(item => {
                 console.log(item)
                   var dt=item.Date.split('-')
                    list.value.push({ x:dt[2]+'/'+dt[1],y:item.RepairCount})
                })
               
 
            })
            .catch((error) => {
                //   isErrorAlertVisible.value=true
                //   isAlertVisible.value=false
                //   err.value=error
                console.error(error);
                  // if(error.response.status <= 400){
                  // 	window.location = serverURL() + "/error/access-denied"
                  // }
            });
    };

    watchEffect(fetcheventlogs())

    // Watch for changes in the prop
watchEffect(() => {
  fetcheventlogs()
});

    const series = [{
  data: list.value,
}]
</script>

<template>
  <VueApexCharts
    type="line"
    height="150"
    :options="balanceChartConfig"
    :series="series"
  />

 </template>
