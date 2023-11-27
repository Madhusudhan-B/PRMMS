<script setup>
import { useTheme } from 'vuetify'
import BarChart from '@/@core/libs/chartjs/components/BarChart'
import { getLatestBarChartConfig } from '@core/libs/chartjs/chartjsConfig'
import moment from 'moment';
import { serverURL, URL, token } from "@/helpers/token"
import axios from "@axios"
const props = defineProps({
  colors: {
    type: null,
    required: true,
  },
  date:{
   type:String,
   required:true,
 }
})


const workshoplogs = ref([])
const label_list = ref([])
const repair = ref([])
const hours = ref([])
const list =ref([])

const vuetifyTheme = useTheme()
var chartOptions = {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              stepSize: 20,
              max: 100,
            },
          },
        ],
      },
    }
const chartJsCustomColors = {
  white: '#fff',
  yellow: '#ffe802',
  primary: '#836af9',
  areaChartBlue: '#2c9aff',
  barChartYellow: '#ffcf5c',
  polarChartGrey: '#4f5d70',
  polarChartInfo: '#299aff',
  lineChartYellow: '#d4e157',
  polarChartGreen: '#28dac6',
  lineChartPrimary: '#9e69fd',
  lineChartWarning: '#ff9800',
  horizontalBarInfo: '#26c6da',
  polarChartWarning: '#ff8131',
  scatterChartGreen: '#28c76f',
  warningShade: '#ffbd1f',
  areaChartBlueLight: '#84d0ff',
  areaChartGreyLight: '#edf1f4',
  scatterChartWarning: '#ff9f43',
}


const fetchlogs = () => {
        axios
            .post(
                URL() + `/widgets/intrusion_count_monthly`,
                {
                    requestType: "view",
                    'queryDataTime':moment(props.date, 'DD-MM-YYYY HH:mm').format('YYYY-MMM-DD HH:mm')
     
                },
                { headers: { Authorization: token() } }
            )
            .then((response) => {
                //   this.listings = response.data;
                console.log("Rolling stock workshop logs axios");
                console.log(response.data.data);
                workshoplogs.value = response.data.data;
                workshoplogs.value.forEach(item => {
                  label_list.value.push(moment(item.Month, 'YYYY-MM').format('MMM-YYYY'))
                  //  label_list.value.push(item.Month)
                   repair.value.push(item.IntrusionCount)
                  

                })
                // list.value= {
                //            labels:label_list.value,
                //             datasets: [
                //               {
                //                 maxBarThickness: 15,
                //                 label: 'HOURS',
                //                 backgroundColor: chartJsCustomColors.warningShade,
                //                 borderColor: 'transparent',
                //                 data: hours.value,
                //               },
                //               {
                //                 maxBarThickness: 15,
                //                 backgroundColor: chartJsCustomColors.horizontalBarInfo,
                //                 label: 'REPAIRS',
                //                 borderColor: 'transparent',
                //                 data: repair.value,
                //               },
                //             ]
                      
                //      }
              list.value={
                        labels: label_list.value,
                        datasets: [{
                          maxBarThickness: 15,
                          backgroundColor: chartJsCustomColors.primary,
                          label: 'No.of Intrusion',
                          borderColor: 'transparent',
                          borderRadius: {
                            topRight: 15,
                            topLeft: 15,
                          },
                          data: repair.value,
                        }],
                      }
               
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

   // watchEffect(fetchlogs())
          // Watch for changes in the prop
    watchEffect(() => {
      list.value=[]
      repair.value=[]
      label_list.value=[]
   
      fetchlogs()
    });
</script>
<template>
    <VCard>
    <VCardText class="d-flex justify-space-between">
  <BarChart
    :height="150"
    :chart-data="list"
    :chart-options="chartOptions"
  />
</VCardText>
  </VCard>
</template>
