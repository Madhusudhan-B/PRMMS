<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import axios from 'axios';

import {location, getdeviceList} from '@/helpers/helper'
import {URL, token} from '@/helpers/token'


import {
  emailValidator,
  requiredValidator,
} from '@validators'

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
   datasegment: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'datasegment',
  'segmentData',
])

const isFormValid = ref(false)
const refForm = ref()
const pids_devicelist= getdeviceList()
const subsystem_id = ref('')
const locationList=location()
// ?? drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
  // nextTick(() => {
  //   refForm.value?.reset()
  //   refForm.value?.resetValidation()
  // })
}

const onUpdate = () => {
  //  alert('update')
  refForm.value?.validate().then(({ valid }) => {
    
   // if (valid) {
      axios.post(URL()+'/devices/pids_segment', {
       
        'requestType':'update',
        'pid_segment_data':{
          id:props.datasegment.id,
          segment_name:props.datasegment.segment_name,
          segment_number:props.datasegment.segment_number,
        location: props.datasegment.location.id,
        slot_name: props.datasegment.slot_name,
        ip_address: props.datasegment.ip_address,
        port: props.datasegment.port,
        pids_device: props.datasegment.pids_device,
      
        } ,
        subsystem_id:1, 
      },{'headers': { Authorization: token()}, })
      .then((response) => {
     
        console.log(response.data.data);
        let data = response.data.data
        emit('segmentData', {
              status:'success',
            data:{
             id:props.datasegment.id,
             segment_name:props.datasegment.segment_name,
             segment_number:props.datasegment.segment_number,
        location: props.datasegment.location,
        slot_name: props.datasegment.slot_name,
        ip_address: props.datasegment.ip_address,
        port: props.datasegment.port,
        pids_device: props.datasegment.pids_device,
       
          },
          subsystem_id:1,
            message:'Segment Successfully Updated'     
          
          
          })
       
      })
      .catch((error) => {
        console.log(error)
          emit('segmentData', {
      status:'failed',
      data:{
        id:props.datasegment.id,       segment_name:props.datasegment.segment_name,
        segment_number:props.datasegment.segment_number,
        location: props.datasegment.location,
        slot_name: props.datasegment.slot_name,
        ip_address: props.datasegment.ip_address,
        port: props.datasegment.port,
        pids_device: props.datasegment.pids_device,
       
      },
      subsystem_id:1,
      message:error
     
      })
      })

      emit('update:isDrawerOpen', false)
      // emit('datadevice', {
      //   id: 0,       
      //   device_name:props.datadevice.device_name,
      //   ip_address:props.datadevice.ip_address,
      //   port:props.datadevice.port,
       
       
      
      // })
      // nextTick(() => {
      //   refForm.value?.reset()
      //   refForm.value?.resetValidation()
      // })
   // }
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
        {{$t('Segment - Update')}}
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
            @submit.prevent="onUpdate"
          >
            <VRow>
              <!-- ?? Full name -->
              <VCol cols="12" hidden>
               <VTextField 
                  v-model="props.datasegment.segment_id"
                  :rules="[requiredValidator]"                 
                  
                />
                </VCol>
                <VCol cols="12">
              <VTextField
                  v-model="props.datasegment.segment_name"
                  label="Segment Name"
                  :rules="[requiredValidator]"
                 
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="props.datasegment.segment_number"
                  :rules="[requiredValidator]"
                  label="Segment Number"
                  type="number"
                />
              </VCol>            

              <VCol cols="12" >
              <VSelect
                  v-model="props.datasegment.location.id"
                  label="Select Location"
                  :rules="[requiredValidator]"
                  :items="locationList"
                />
              </VCol>

              <!-- ?? Email -->
              <VCol cols="12">
                <VTextField
                  v-model="props.datasegment.slot_name"
                  :rules="[requiredValidator]"
                  label="Slot Name"
                 
                />
              </VCol>
             
              <VCol cols="12">
                <VTextField
                  v-model="props.datasegment.ip_address"
                  :rules="[requiredValidator]"
                  label="IP Address"
                 
                />
              </VCol>
             
              <VCol cols="12">
                <VTextField
                  v-model="props.datasegment.port"
                  :rules="[requiredValidator]"
                  label="Port"
                 
                />
              </VCol>
             
          
             



              

              
             
            
            
              <!-- ?? Submit and Cancel -->
              <VCol cols="12">
                <VBtn
                  type="submit"
                  class="me-3"
                >
                  Update
                </VBtn>
                <!-- <VBtn
                  type="reset"
                  variant="tonal"
                  color="secondary"
                  @click="closeNavigationDrawer"
                >
                  Cancel
                </VBtn> -->
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
