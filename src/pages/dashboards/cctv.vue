<script setup>
import { useTheme } from 'vuetify'
import cctvmap from '@/views/dashboards/cctv/cctvmap.vue'

import Workshop1 from '@/views/dashboards/cctv/Workshop1.vue'
import Workshop2 from '@/views/dashboards/cctv/Workshop2.vue'
import Workshop3 from '@/views/dashboards/cctv/Workshop3.vue'
import Workshop4 from '@/views/dashboards/cctv/Workshop4.vue'



import {URL, token} from '@/helpers/token'
import axios from '@axios'
// Import the moment library
import moment from 'moment';
// Get the current date and time
const currentDateTime = moment();
// Format the date and time according to your desired format
const formattedDateTime = currentDateTime.format('DD-MM-YYYY h:mm');

const date = ref(formattedDateTime)
const vdate = ref(formattedDateTime)

const workshop = ref([])
const ws1 = ref([])
const ws2 = ref([])
const ws3 = ref([])
const ws4 = ref([])

// ?? Fetching Role list
const fetchWorkshop = () => {
 
 axios.post(URL()+`/widgets/cctv_hb_status`,{
      
      'requestType':'view',
      queryDataTime:moment(date.value, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm')
         
     // 'date':date.value
    
    }, { 'headers': { Authorization: token() } }) 
    .then((response) => {
     
     //   this.listings = response.data; 
     console.log('workshop')      
     console.log(response.data.data);
     workshop.value=response.data.data
     workshop.value.forEach(item => {

      if(item.widgetname==="CCTV"){
        console.log(item)
        ws1.value=item
      }
      if(item.widgetname==="RFID_PEOPLE"){
        ws4.value=item
      }
      if(item.widgetname==="PERIMETER"){
        ws3.value=item
      }
      if(item.widgetname==="WORKSHOP"){
        ws2.value=item
      }
      
               

      })
  
      
    })
    .catch((error) => {
      isErrorAlertVisible.value=true
      isAlertVisible.value=false
      err.value=error
      console.error(error)
    })
    
    
   
}




watchEffect(fetchWorkshop())

// watchEffect()
// fetchWorkshop()
const changeVariable = () => {
  fetchWorkshop()
  date.value = vdate.value
 // emit('value-changed', date.value);
}
</script>

<template>
  <VRow class="match-height" id="cctv"> 
  
    <VCol
      cols="12"
      md="4"
      sm="6"
    >
      <Workshop1 :cctv="ws1" :date="date"/>
    </VCol>
    <VCol
      cols="12"
      md="3"
      sm="6"
    >
      <Workshop4  v-bind:people="ws4" :date="date"/>
    </VCol>
    
    <VCol
      cols="12"
      md="3"
      sm="6"
    >
      <Workshop2  v-bind:workshop="ws2"/>
    </VCol>
    <VCol
      cols="12"
      md="2"
      sm="6"
    >
      <Workshop3 v-bind:perimeter="ws3" :date="date"/>
    </VCol>
     <VCol
      cols="12"
      md="12"
    >
      <cctvmap :date="date" />
    </VCol>
    <VCol
      cols="12"
      md="8"
      sm="6"
    >
   
    </VCol>

 

    <VCol
      cols="12"
      md="2"
      sm="6"
    >
    <AppDateTimePicker
    v-model="vdate"
    label="Date & Time"
    :config="{ enableTime: true, dateFormat: 'd-m-Y H:i' }"
  />
</VCol>
 <VCol
      cols="12"
      md="2"
      sm="6"
    >
    <VBtn @click="changeVariable">Change</VBtn>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>

<route lang="yaml">
  meta:
    action: read
    subject: DB_CCTV
</route>
