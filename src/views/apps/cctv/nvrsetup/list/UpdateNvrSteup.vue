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
   dataNVR: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'dataNVR',
  'nvrData',
])

const show1 = ref(false)
const show2 = ref(true)

const isFormValid = ref(false)
const refForm = ref()
const ip = ref('')
const devicename = ref('')
const port = ref('')
const password = ref('')
 const user_id = ref('')
  const device_no = ref('')
  const nvrid=ref('')
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
      axios.post(URL()+'/nvr', {       
        
        'requestType':'update',
        'nvr_data':{
          nvr_id:props.dataNVR.id,
          device_name:props.dataNVR.device_name,
        ip_address: props.dataNVR.ip_address,
        port: props.dataNVR.port,
        device_no:props.dataNVR.device_no,
       
        user_name:props.dataNVR.user_name,
        password: props.dataNVR.passowrd,
      
        } ,
        subsystem_id:1,
       
      
        
       
      },{'headers': { Authorization: token()}, })
     
      .then((response) => {
        console.log(response.data.data);
        let data = response.data.data
        emit('nvrData', {
              status:'success',
            data:{
             id:props.dataNVR.id,
             device_name:props.dataNVR.device_name,
        ip_address: props.dataNVR.ip_address,
        port: props.dataNVR.port,
        device_no:props.dataNVR.device_no,
       
        user_name:props.dataNVR.user_name,
        password: props.dataNVR.passowrd,
          },
          subsystem_id:1,
            message:'NVR Successfully Updated'     
          
          
          })
      })
      .catch((error) => {
          console.log(error)
          emit('nvrData', {
      status:'failed',
      data:{
        id:props.dataNVR.id,     device_name:props.dataNVR.device_name,
        ip_address: props.dataNVR.ip_address,
        port: props.dataNVR.port,
        device_no:props.dataNVR.device_no,
       
        user_name:props.dataNVR.user_name,
        password: props.dataNVR.passowrd,  shift_type_description:props.datashifttype.shift_type_description,
      },
      subsystem_id:1,
      message:error
     
      })
      })

      emit('update:isDrawerOpen', false)
      // emit('nvrData', {
      //   id: 0,       
      //   device_name:props.dataNVR.device_name,
      //   ip_address: props.dataNVR.ip_address,
      //   port: props.dataNVR.port,
      //   device_no:props.dataNVR.device_no,
       
      //   user_name:props.dataNVR.user_name,
      //   password: props.dataNVR.passowrd,
      
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
       {{$t('NVR - Update')}}
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
                  v-model="props.dataNVR.id"
                  :rules="[requiredValidator]"                 
                  
                />
                </VCol>
                <VCol cols="12">
                
                <VTextField
                  v-model="props.dataNVR.ip_address"
                  :rules="[requiredValidator]"
                  label="IP"
                  
                />
              </VCol>

              <!-- ?? Email -->
              <VCol cols="12">
                <VTextField
                  v-model="props.dataNVR.port"
                  :rules="[requiredValidator]"
                  label="Port"
                 
                />
              </VCol>
             



               <VCol cols="12">
              <VTextField
                  v-model="props.dataNVR.device_name"
                  label="Device Name"
                  :rules="[requiredValidator]"
                 
                />
              </VCol>

              <VCol cols="12">
              <VTextField
                  v-model="props.dataNVR.device_no"
                  label="Device Number"
                  :rules="[requiredValidator]"
                  type="number"
                />
              </VCol>
             
               <VCol cols="12">
                <VTextField
                  v-model="props.dataNVR.user_name"
                  :rules="[requiredValidator]"
                  label="User ID"
                 
                />
              </VCol>
             
              <VCol cols="12">
                <VTextField
                  v-model="props.dataNVR.password"
                  label="Password"
                  :rules="[requiredValidator]"
                  :type="show1 ? 'text' : 'password'"
                 
                  :append-inner-icon="show1 ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="show1 = !show1"
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
