<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import axios from 'axios';

import {location,getdeviceList} from '@/helpers/helper'
import {URL, token} from '@/helpers/token'


import {
  
  requiredValidator,
} from '@validators'

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'segmentData',
])

const isFormValid = ref(false)
const refForm = ref()


const segment_name = ref('')
 const slot_name = ref('')
 const ip_address = ref('')
 const port = ref('')
 const selectedLocation = ref()
 const locationList=location()
 const pids_device = ref('')
 const pids_devicelist= getdeviceList()
 const segment_number=ref(0)
 const subsystem_id = ref('')


// ?? drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
  nextTick(() => {
    refForm.value?.reset()
    refForm.value?.resetValidation()
  })
}

const onSubmit = () => {
 
 refForm.value?.validate().then(({ valid }) => {
   if (valid) {

     axios.post(URL()+'/devices/pids_segment',{
       requestType: "create",
       pid_segment_data: {
        location: selectedLocation.value,
        segment_name: segment_name.value,
        segment_number:segment_number.value,
        slot_name: slot_name.value,
        ip_address: ip_address.value,
        port: port.value,
        pids_device:pids_device.value,
     
        },
        subsystem_id: subsystem_id.value,
     
     },{'headers': { Authorization: token()}, }).then((response) => {
       let data = response.data
       emit("segmentData", {
                           status: "success",
                           data: {
                               id: data.pids_id,
                               location: selectedLocation.value,
        segment_name: segment_name.value,
        segment_number:segment_number.value,
        slot_name: slot_name.value,
        ip_address: ip_address.value,
        port: port.value,
        pids_device:pids_device.value,
      
       },
       subsystem_id: subsystem_id.value,
         message: "Device Successfully Created",
                       });
     })
     .catch((error) => {
       emit("segmentData", {
                           status: "failed",
                           data: {
                            id: data.pids_id,
                               location: selectedLocation.value,
                               segment_number:segment_number.value,
                            segment_name: segment_name.value,
                            slot_name: slot_name.value,
                            ip_address: ip_address.value,
                            port: port.value,
                            pids_device:pids_device.value,
                           },
                           subsystem_id: subsystem_id.value,
                           message: error,
                       });
     
     })
     // emit('segmentData', {
     //   id: 0,       
     //   device_name: device_name.value,
     //   ip_address: ip_address.value,
     //   port: port.value,
      
     
     // })

     
     emit('update:isDrawerOpen', false)
     nextTick(() => {
       refForm.value?.reset()
       refForm.value?.resetValidation()
     })
   }
 })
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
    @update:model-value="handleDrawerModelValueUpdate"
  >
    <!-- ?? Title -->
    <div class="d-flex align-center pa-6 pb-1">
    

      <h3 class="title-header" >
        {{$t('Segment - Create')}}
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
            @submit.prevent="onSubmit"
          >
          <VRow>
              <!-- ?? Full name -->
              

              <!-- ?? Email -->
              <VCol cols="12">
                <VTextField
                  v-model="segment_name"
                  :rules="[requiredValidator, emailValidator]"
                  label="Segment Name"
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="segment_number"
                  :rules="[requiredValidator]"
                  label="Segment Number"
                  type="number"
                  min=1
                  max=16
                />
              </VCol>

              <!-- ?? company -->
              <VCol cols="12" >
              <VSelect
                  v-model="selectedLocation"
                  label="Select Location"
                  :rules="[requiredValidator]"
                  :items="locationList"
                />
              </VCol>
              <VCol cols="12" >
                <VTextField
                  v-model="ip_address"
                  :rules="[requiredValidator]"
                  label="IP Address"
                  
                />
              </VCol>
              <VCol cols="12" >
                <VTextField
                  v-model="port"
                  :rules="[requiredValidator]"
                  label="Port"
                 
                />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="slot_name"
                  :rules="[requiredValidator]"
                  label="Slot Name"
                />
              </VCol>
              
              <VCol cols="12">

                <VSelect
                  v-model="pids_device"
                  label="Select PIDs device"
                  :rules="[requiredValidator]"
                  :items="pids_devicelist"
                />
                
              </VCol>
              <VCol cols="12">
              <VTextField
                  v-model="subsystem_id"
                  label="SubSystem ID"
                  :rules="[requiredValidator]"
                 
                />
              </VCol>


              <!-- <VCol cols="12">
              <VSelect
                  v-model="location"
                  label="Select Location"
                  :rules="[requiredValidator]"
                  :items="['location_short_code', 'location_description']"
                />
              </VCol> -->
              
              <!-- ?? Submit and Cancel -->
              <VCol cols="12">
                <VBtn
                  type="submit"
                  class="me-3"
                >
                  Create
                </VBtn>
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
