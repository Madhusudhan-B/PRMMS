<script setup>
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'
import { hexToRgb } from '@layouts/utils'
import { serverURL,URL, token } from "@/helpers/token"
import axios from "@axios"
import moment from 'moment';

const attendance = ref([])
const login=ref(0)
const logout=ref(0)
const total=ref(0)
const list=ref([])


const props = defineProps({
 
  date:{
    type:String,
    required:true,
  }
})

var series = list.value
// queryDataTime:moment(props.date, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm')

const fetchAttendance = (dt) => {
  
        axios
            .post(
                URL() + `/widgets/attendance`,
                {
                    requestType: "view",
                    queryDataTime:moment(props.date, 'DD-MM-YYYY').format('YYYY-MM-DD')
                },
                { headers: { Authorization: token() } }
            )
            .then((response) => {
                //   this.listings = response.data;
              
                console.log("attendance axios");
                console.log(response.data.data);
                attendance.value = response.data.data;
                login.value= attendance.value.login_count ? attendance.value.login_count : 0
                logout.value= attendance.value.logout_count ? attendance.value.logout_count : 0
                total.value= attendance.value.staff_count ? attendance.value.staff_count : 0
                list.value.push(login.value)
                list.value.push(logout.value)
                series = list.value
               // chartOptions()
               
            })
            .catch((error) => {
                //   isErrorAlertVisible.value=true
                //   isAlertVisible.value=false
                //   err.value=error
                console.error(error);
			
            });
    };

//  watchEffect(fetchAttendance(props.date))
  
// Watch for changes in the prop
watchEffect(() => {
  list.value = []
  series = list.value
  fetchAttendance(props.date)
  console.log('attendance')
  console.log(series)
});


  // setTimeout(() => {  
  //   watchEffect(fetchAttendance())
  //   series = [
  //     login.value,
  //     logout.value,

  //   ]

  //   chartOptions()

  //   }, 5000);

const vuetifyTheme = useTheme()




const chartOptions = computed(() => {
  
  console.log('series')
  console.log(series)
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
  console.log('compent options date:'+props.date)
  
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
      // chartColors.donut.series2,
      // chartColors.donut.series3,
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
                return login.value+logout.value
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
             {{$t('Attendance')}}
          </h6>
          <span class="text-sm">{{$t('In-Out Report')}}</span>
        </div>

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
        <VueApexCharts
          :options="chartOptions"
          :series="series"
          :height="147"
          :width="130"
        
        />
      </div>
    </VCardText>
  </VCard>
</template>
