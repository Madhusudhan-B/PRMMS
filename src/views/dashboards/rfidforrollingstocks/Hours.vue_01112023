<script setup>
import { useTheme } from 'vuetify'
import { getHorizontalBarChartConfig } from '@core/libs/chartjs/chartjsConfig'
import BarChart from '@core/libs/chartjs/components/BarChart'
import { serverURL, URL, token } from "@/helpers/token"
import axios from "@axios"
// Import the moment library
import moment from 'moment'

const props = defineProps({
 
 date:{
   type:String,
   required:true,
 }
})

const vuetifyTheme = useTheme()
const chartOptions = computed(() => getHorizontalBarChartConfig(vuetifyTheme.current.value))


const workshoplogs = ref([])
const label_list = ref([])
const repair = ref([])
const hours = ref([])
const list =ref([])

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
                URL() + `/widgets/rfid_rs_repair_hours`,
                {
                    requestType: "view",
                     queryDataTime:moment(props.date, 'DD-MM-YYYY').format('YYYY-MM-DD')
             
                },
                { headers: { Authorization: token() } }
            )
            .then((response) => {
                //   this.listings = response.data;
                console.log("Rolling stock workshop logs axios");
                console.log(response.data.data);
                workshoplogs.value = response.data.data;
                workshoplogs.value.forEach(item => {
                 
                   label_list.value.push(item.Location)
                   repair.value.push(item.RepairCount)
                   hours.value.push(item.RepairHours)
                 

                })
                list.value= {
                           labels:label_list.value,
                            datasets: [
                              {
                                maxBarThickness: 15,
                                label: 'HOURS',
                                backgroundColor: chartJsCustomColors.warningShade,
                                borderColor: 'transparent',
                                data: hours.value,
                              },
                              {
                                maxBarThickness: 15,
                                backgroundColor: chartJsCustomColors.horizontalBarInfo,
                                label: 'REPAIRS',
                                borderColor: 'transparent',
                                data: repair.value,
                              },
                            ]
                      
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

    watchEffect(fetchlogs())
    
// Watch for changes in the prop
watchEffect(() => {
  list.value=[]
  fetchlogs()
});

</script>

<template>
   <VCard>
    <VCardText class="d-flex justify-space-between">
      <div class="d-flex flex-column">
        <div class="mb-auto">
  <BarChart
    :height="150"
    :chart-data="list"
    :chart-options="chartOptions"
  />
</div>
      </div>
    </VCardText>
  </VCard>
</template>
