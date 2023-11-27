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
  dataShift:{
    type:String,
    required:true,
  }
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'dataShift',
])



const isFormValid = ref(false)
const refForm = ref()
const ip = ref('')
const port = ref('')
const password = ref('')
 const user_id = ref('')
  const nvr = ref('')
  const selectedLocation = ref()
 const selectedSegment = ref()
 const selectedStatus = ref()
 const id=props.dataShift

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
    <h3 class="title-header">{{$t('Shift - View')}}</h3>

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
             Shift
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{props.dataShift.shift_name}}
              </VCol>
              
              <VCol cols="5">
             Shift Start Time
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{props.dataShift.shift_start_time}}
              </VCol>
              
              <VCol cols="5">
              Shift End time
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{props.dataShift.shift_end_time}}
              </VCol>
               
              <VCol cols="5">
              Compute late By
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{props.dataShift.compute_late_by}}
              </VCol>
               
              <VCol cols="5">
              Grace Late by
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{props.dataShift.grace_late_by}}
              </VCol>

              <VCol cols="5">
              Break Start Time
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{props.dataShift.break_start_time}}
              </VCol>

              <VCol cols="5">
              Break End Time
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{props.dataShift.break_end_time}}
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
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
<style>
  .think{
  font-weight: bold;
}
  </style>

