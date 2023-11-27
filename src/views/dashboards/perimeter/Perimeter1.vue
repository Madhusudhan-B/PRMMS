<script setup>
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'
import { getScatterChartConfig } from '@core/libs/apex-chart/apexChartsConfig'
import moment from 'moment';


const props = defineProps({
 
 date:{
   type:String,
   required:true,
 }
})

const vuetifyTheme = useTheme()
//  const scatterChartConfig = computed(() => getScatterChartConfig(vuetifyTheme.current.value))
var scatterChartConfig ={
                            x: {
                              type: 'time',
                              time: {
                                unit: 'day',
                                displayFormats: {
                                  day: 'YYYY-MMM-DD', // Format for displaying dates on x-axis
                                },
                              },
                            },
                          }
import { serverURL, URL, token } from "@/helpers/token"
    import axios from "@axios"
    
const eventlogs = ref([])

const list=ref([])

var series = [{
  data: list.value,
}]

const  formatDate=(date)=>{
  var year = date.getFullYear();
  var month = date.getMonth() + 1; // Note: January is 0
  var day = date.getDate();
  return year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);

}

const parseDate=(dateString)=>{
	// Split the input string using the '-' delimiter
 	const parts = dateString.split('-');

	// Check if the parts array contains exactly 3 elements (day, month, and year)
 	if (parts.length === 3) {
    		const day = parseInt(parts[0], 10);     // Parse day as an integer
    		const month = parseInt(parts[1], 10) - 1; // Parse month as an integer (subtract 1 as months are 0-based)
    		const year = parseInt(parts[2], 10);    // Parse year as an integer

    		// Create a new Date object using the extracted components
    		const dateObject = new Date(year, month, day);

   		// Check if the dateObject is a valid date
    		if (!isNaN(dateObject.getTime())) {
      			return dateObject;
    		}
  	}
}


const fetcheventlogs = () => {
 
 // Get the current date
console.log("Props Date: " + props.date);


var currentDate = parseDate(props.date);
console.log("Start Date: " + currentDate); 

// Subtract 7 days
var startDate = parseDate(props.date);
startDate.setDate(startDate.getDate() - 7);

// Format the dates
var startDateFormatted = formatDate(startDate);
var currentDateFormatted = formatDate(currentDate);


// Display the dates
console.log("Start Date: " + startDateFormatted);
console.log("Current Date: " + currentDateFormatted);

        axios
            .post(
                URL() + `/widgets/intrusion_count`,
                {
                    requestType: "view",
                    start_date:startDateFormatted,
                    end_date:currentDateFormatted
                },
                { headers: { Authorization: token() } }
            )
            .then((response) => {
             
                //   this.listings = response.data;
                console.log("Perimeter event logs axios")
                console.log(response.data.data)
                eventlogs.value = response.data.data

                eventlogs.value.forEach(item => {
                 // console.log('workshop 1')
                  console.log(item)
                  var dt=item.Date.split('-')
                   // if(item.IntrusionCount>=0){
                  list.value.push({ x:dt[2]+'-'+dt[1],y:item.IntrusionCount})
                   // }
                 
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

 //   watchEffect(fetcheventlogs())

    // Watch for changes in the prop
watchEffect(() => {
  list.value=[]
  series = [{
  data: list.value,
  }]
  fetcheventlogs()
});


</script>

<template>
   <VCard>
    <VCardText class="d-flex justify-space-between">
  <VueApexCharts
    type="scatter"
    height="150"
    width="500"
    :options="scatterChartConfig"
    :series="series"
  />
</VCardText>
  </VCard>
</template>
<style>
  .apexcharts-legend {
   
    display: none !important;
}

.apexcharts-toolbar{
  display:none !important;
}

/* svg[Attributes Style] {
    width: 550 !important;
    height: 150;
    transform: translate(0, 0);
} */
  </style>
