<script setup>
import { useTheme } from 'vuetify'
import { getHorizontalBarChartConfig } from '@core/libs/chartjs/chartjsConfig'
import BarChart from '@core/libs/chartjs/components/BarChart'
import { serverURL,URL, token } from "@/helpers/token"
import axios from "@axios"
import moment from 'moment';


const workshoplogs = ref([])
const label_list = ref([])
const log_in = ref([])
const log_out = ref([])
const list =ref([])


const props = defineProps({
 
 date:{
   type:String,
   required:true,
 }
}) 

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


const vuetifyTheme = useTheme()
const chartOptions = computed(() => getHorizontalBarChartConfig(vuetifyTheme.current.value))



const fetchlogs = (dt) => {
        axios
            .post(
                URL() + `/widgets/workshop_logs`,
                {
                    requestType: "view",
                    queryDataTime:moment(props.date, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm')
             
                },
                { headers: { Authorization: token() } }
            )
            .then((response) => {
                //   this.listings = response.data;
                console.log("workshop logs axios");
                console.log(response.data.data);
                workshoplogs.value = response.data.data;
                workshoplogs.value.forEach(item => {
                  console.log('location name'+item.Location)
                
                  console.log('location name'+item.Location)
                  label_list.value.push(item.Location)
                  log_in.value.push(item.LoginCount)
                  log_out.value.push(item.LogoutCount)

                 
                 

                })
                console.log(label_list.value)
                console.log(log_in.value)
                console.log(log_out.value)
                list.value= {
                  labels: label_list.value,
                        datasets: [
                          {
                            maxBarThickness: 15,
                            label: 'IN',
                            backgroundColor: chartJsCustomColors.areaChartBlueLight,
                            borderColor: 'transparent',
                            data: log_in.value,
                          },
                          {
                            maxBarThickness: 15,
                            backgroundColor: chartJsCustomColors.polarChartGrey,
                            label: 'OUT',
                            borderColor: 'transparent',
                            data: log_out.value,
                          },
                        ]}
               
            })
            .catch((error) => {
                //   isErrorAlertVisible.value=true
                //   isAlertVisible.value=false
                //   err.value=error
                console.error(error);
				
            });
    };

    watchEffect(fetchlogs(props.date))
    
//     const data = {
//  list.value
// }
// Watch for changes in the prop
watchEffect(() => {
  //list.value=[]
  fetchlogs(props.date)
});

</script>

<template>
  <VCard>
    <VCardText class="justify-space-between">
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
