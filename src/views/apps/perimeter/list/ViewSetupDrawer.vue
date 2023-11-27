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
  datasegment:{
    type:String,
    required:true,
  }
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'datasegment',
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
     
      <h3 class="title-header" >
      {{$t('Segment - View')}}
      </h3>
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
          <VForm
            ref="refForm"
            v-model="isFormValid"
           
          >

            <VRow>
            <VCol cols="5">
            Segment Name
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{props.datasegment.segment_name}}
              </VCol>

              <VCol cols="5">
           Location
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{props.datasegment.location_short_code.location}}
              </VCol>
             
              <VCol cols="5">
           Slot Name
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{props.datasegment.slot_name}}
              </VCol>
             
              <VCol cols="5">
            IP Address
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{props.datasegment.ip_address}}
              </VCol>
             
             
              <VCol cols="5">
          Port
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{props.datasegment.port}}
              </VCol>
             

              <VCol cols="5">
         PID Device
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{props.datasegment.pids_device}}
              </VCol>
             
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
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
