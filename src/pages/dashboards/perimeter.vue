<script setup>
import { useTheme } from 'vuetify'
import PerimeterMap from '@/views/dashboards/perimeter/PerimeterMap.vue'

import Perimeter1 from '@/views/dashboards/perimeter/Perimeter1.vue'
import Perimeter2 from '@/views/dashboards/perimeter/Perimeter2.vue'

// Import the moment library
import moment from 'moment';
// Get the current date and time
const currentDateTime = moment();
// Format the date and time according to your desired format
const formattedDateTime = currentDateTime.format('DD-MM-YYYY h:mm');

const date = ref(formattedDateTime)
const vdate = ref(formattedDateTime)

const vuetifyTheme = useTheme()
const currentTheme = vuetifyTheme.current.value.colors

const changeVariable = () => {
  date.value = vdate.value
 // emit('value-changed', date.value);
}

</script>

<template>
  <VRow class="match-height" id="perimeter">
   
  
    <VCol
      cols="12"
      md="6"
      sm="6"
    >
      <Perimeter1 :date="date" />
    </VCol>
    <VCol
      cols="12"
      md="6"
      sm="6"
    >
      <Perimeter2 :date="date" />
    </VCol>
  
    
    <VCol
      cols="12"
      md="12"
    >
      <PerimeterMap :date="date" />
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
    subject: DB_PERIMETER
</route>

