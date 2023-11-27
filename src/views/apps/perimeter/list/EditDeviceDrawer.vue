<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import axios from 'axios';

import {location} from '@/helpers/helper'
import {URL, token} from '@/helpers/token'


import {
  
  requiredValidator,
} from '@validators'

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  datadevice: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'datadevice',
  'departmentData',
])

const isFormValid = ref(false)
const refForm = ref()

const subsystem_id = ref('')

  
// ?? drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
  // nextTick(() => {
  //   refForm.value?.reset()
  //   refForm.value?.resetValidation()
  // })
}

const onUpdate = () => {
 
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      axios.post(URL()+'/devices/pids_device', {
       
        'requestType':'update',
        'pids_device_data':{
          id:props.datadevice.id,
          device_name:props.datadevice.device_name,
        ip_address:props.datadevice.ip_address,
        port:props.datadevice.port,
      
        } ,
        subsystem_id:1,
       
       
      
        
       
      },{'headers': { Authorization: token()}, })
      .then((response) => {
     
        console.log(response.data.data);
        let data = response.data.data
        emit('deviceData', {
              status:'success',
            data:{
             id:props.datadevice.id,
             device_name:props.datadevice.device_name,
        ip_address:props.datadevice.ip_address,
        port:props.datadevice.port,
          },
          subsystem_id:1,
            message:'Device Successfully Updated'     
          
          
          })
       
      })
      .catch((error) => {
        console.log(error)
          emit('deviceData', {
      status:'failed',
      data:{
        id:props.datadevice.id,     device_name:props.dataNVR.device_name,
        device_name:props.datadevice.device_name,
        ip_address:props.datadevice.ip_address,
        port:props.datadevice.port,
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
      <h3 class="title-header">
      {{$t('Device - Update')}}
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
                  v-model="props.datadevice.id"
                  :rules="[requiredValidator]"                 
                  
                />
                </VCol>
                <VCol cols="12">
              <VTextField
                  v-model="props.datadevice.device_name"
                  label="Device Name"
                  :rules="[requiredValidator]"
                 
                />
              </VCol>
              <VCol cols="12">
              <VTextField
                  v-model="props.datadevice.ip_address"
                  label="IP Address"
                  :rules="[requiredValidator]"
                 
                />
              </VCol>
              <VCol cols="12">
              <VTextField
                  v-model="props.datadevice.port"
                  label="Port"
                  :rules="[requiredValidator]"
                 
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
