<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import axios from 'axios';

import {location} from '@/helpers/helper'
import {URL, token} from '@/helpers/token'


// import {
//   emailValidator,
//   requiredValidator,
// } from '@validators'

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  datatrip:{
    type:String,
    required:true,
  }
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'datatrip',
])



const isFormValid = ref(false)
const refForm = ref()

// ?? drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
  // nextTick(() => {
  //   refForm.value?.reset()
  //   refForm.value?.resetValidation()
  // })
}



const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}



</script>

<template>
  <VNavigationDrawer
    temporary
    :width="400"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
   
  >
    <!-- ?? Title -->
    <div class="d-flex align-center pa-6 pb-1">
      <h3 style="color: #2f2774;"> {{$t('Trip - View')}}</h3>
     

      <VSpacer />

      <!-- ?? Close btn -->
      <VBtn
        variant="tonal"
        color="default"
        icon
        size="32"
        class="rounded"
        @click="closeNavigationDrawer"
      >
        <VIcon
          size="18"
          icon="tabler-x"
        />
      </VBTn>
    </div>

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- ?? Form -->
       

            <VRow>
              <!-- ?? Full name -->
              <VCol cols="12">
              Trip ID : {{props.datatrip.id}}
              </VCol>
              <VCol cols="12">
              Trip Number : {{props.datatrip.trip_number}}
              </VCol>
              <VCol cols="12">
              Date :{{props.datatrip.trip_date}}
              </VCol>
              <VCol cols="12">
              Number of Locomotives : {{props.datatrip.no_of_locos}}
              </VCol>
              <VCol cols="12">
             Number of Wegons : {{props.datatrip.no_of_wagons}}
              </VCol>
              <VCol cols="12">
              Status : {{props.datatrip.trip_status.status_name}}
              </VCol>
             
             
             
              <!-- ?? Cancel -->
              <VCol cols="12">
               
                <VBtn
                  type="reset"
                  variant="tonal"
                  color="secondary"
                  @click="closeNavigationDrawer"
                >
                  Cancel
                </VBtn>
              </VCol>
            </VRow>
        
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
