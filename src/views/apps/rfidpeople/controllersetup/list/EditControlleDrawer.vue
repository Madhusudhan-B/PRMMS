<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import axios from 'axios';
import {location} from '@/helpers/helper'
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
   dataController: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'dataController',
  'controllerData',
])

const isFormValid = ref(false)
const refForm = ref()
const ip = ref('')
const device_name = ref('')
const port = ref('')
const selectedLocation = ref()
const password = ref('')
const device_type=ref()
const device_status = ref()
const device_enabled = ref()
const locationList=location()
const subsystem_id = ref('')
// const show2 = ref(false)
const rules = {
required: (value) => !!value || 'Required.',
min: (v) => v.length >= 8 || 'Min 8 characters',
}

//const name=props.databloodgroup.blood_group_name
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
      axios.post(URL()+'/devices/controller', {       
        
        'requestType':'update',
        'controller_data':{
          id:props.dataController.id,
          device_name:props.dataController.device_name,
        ip_address: props.dataController.ip_address,
        port: props.dataController.port,
        device_name:props.dataController.device_name,
        device_type:props.dataController.device_type,
        device_enabled:props.dataController.device_enabled,
        location: props.dataController.location.id,
       
        
        },
       
        subsystem_id: 1, 
        
      
        
       
      },{'headers': { Authorization: token()}, })
      
      .then((response) => {
        emit('controllerData', {
              status:'success',
              data:{
                id:response.data.id,
                device_name:props.dataController.device_name,
                ip_address: props.dataController.ip_address,
                port: props.dataController.port,
                device_name:props.dataController.device_name,
                device_type:props.dataController.device_type,
                device_enabled:props.dataController.device_enabled,
                location: props.dataController.location.id,

        
          },
          subsystem_id:1,
         location: props.dataController.location.location_short_code,
            message:'Controller Successfully Updated'     
          
          
          })
       
      })
      .catch((error) => {
          console.log(error)
          emit('controllerData', {
                status:'failed',
                data:{
                id:response.data.id,
                device_name:props.dataController.device_name,
                ip_address: props.dataController.ip_address,
                port: props.dataController.port,
                device_name:props.dataController.device_name,
                device_type:props.dataController.device_type,
                device_enabled:props.dataController.device_enabled,
                location: props.dataController.location.id,

        
          },
          subsystem_id:1,
         location: props.dataController.location.location_short_code,
                message:error
              
                })
      // nextTick(() => {
      //   refForm.value?.reset()
      //   refForm.value?.resetValidation()
      // })
    })

      emit('update:isDrawerOpen', false)
      // emit('databloodgroup', {
      //   id: 0,       
      //   blood_group_name:props.databloodgroup.blood_group_name,
       
      
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
const status =[
  {
    title: 'UP',
    value: 1,
  },
  {
    title: 'DOWN',
    value: 0,
  },
]

const enabled =[
  {
    title: 'YES',
    value: true,
  },
  {
    title: 'NO',
    value: false,
  },
]

const devicetype =[
  {
    title: 'Standalone',
    value: '1',
  },
  {
    title: 'Two-Door',
    value: '2',
  },
  {
    title: 'Four-Door',
    value: '4',
  },
  
]

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
    <h3 class="title-header">Controller - Update</h3>

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
                  v-model="props.dataController.id"
                  :rules="[requiredValidator]"                 
                  
                />
                </VCol>
                <VCol cols="12">
                
                <VTextField
                  v-model="props.dataController.ip_address"
                  :rules="[requiredValidator]"
                  label="IP"
                  
                />
              </VCol>

              <!-- ?? Email -->
              <VCol cols="12">
                <VTextField
                  v-model="props.dataController.port"
                  :rules="[requiredValidator]"
                  label="Port"
                 
                />
              </VCol>
             



               <VCol cols="12">
              <VTextField
                  v-model="props.dataController.device_name"
                  label="Device Name"
                  :rules="[requiredValidator]"
                 
                />
              
              </VCol>

            
             
              <VCol cols="12">
              

                <VSelect
                  v-model="props.dataController.device_type"
                  label="Device Type"
                  :rules="[requiredValidator]"
                  :items="devicetype"
                />
              </VCol>
              <VCol cols="12">
              <VSelect
              v-model="props.dataController.location.id"
                  label="Select Location"
                  :rules="[requiredValidator]"
                  :items="locationList"
                />
              </VCol>
           

              <VCol cols="12">
              <VSelect
                  v-model="props.dataController.device_enabled"
                  label="Select Enabled"
                  :rules="[requiredValidator]"
                  :items="enabled"
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
               
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
