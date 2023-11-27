<script setup>
import { useTheme } from 'vuetify'
import RfidforPeople from '@/views/dashboards/rfidforpeople/RfidForPeople.vue'

import Attendance from '@/views/dashboards/rfidforpeople/Attendance.vue'
import Logs from '@/views/dashboards/rfidforpeople/Logs.vue'
import Inout from '@/views/dashboards/rfidforpeople/Inout.vue'

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

const { emit } = defineEmits();

const changeVariable = () => {
  date.value = vdate.value
 // emit('value-changed', date.value);
}
</script>

<template >
  <VRow   v-if="$can('read', 'DB_PEOPLE')" class="match-height" id="rfid-for-people" >  
  
    <VCol
      cols="12"
      md="3"
      sm="6"
    >
      <Attendance  :date="date" />
    </VCol>
    <VCol
      cols="12"
      md="4"
      sm="6"
    >
      <Logs  :date="date" />
    </VCol>
    <VCol
      cols="12"
      md="5"
      sm="6"
    >
      <Inout  :date="date" />
    </VCol>
    

   
    <VCol
      cols="12"
      md="12"
    >
      <RfidforPeople :date="date" />
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
    subject: DB_PEOPLE
  </route>
