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

const isFormValid = ref(false)
const refForm = ref()
const ip = ref('')
const devicename = ref('')
const port = ref('')
const password = ref('')
 const user_id = ref('')
  const device_no = ref('')
  const nvrid=ref('')
  
// ?? drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
  // nextTick(() => {
  //   refForm.value?.reset()
  //   refForm.value?.resetValidation()
  // })
}
const user=localStorage.getItem('userData')

const onUpdate = () => {
 
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      axios.post(URL()+'/tag_inventory', {       
        
        'requestType':'update',
        'tag_inventory_data':{
          id:props.dataNVR.id,
          epc:props.dataNVR.epc,
          created_by_user:user.user_name,
          is_active:props.dataNVR.is_active,
          created_by_device:'web',
          tid: props.dataNVR.tid,
      
        } 
       
      
        
       
      },{'headers': { Authorization: token()}, })
     
      .then((response) => {
        console.log(response.data.data);
        let data = response.data.data
        emit('nvrData', {
              status:'success',
            data:{
              id:props.dataNVR.id,
          epc:props.dataNVR.epc,
          created_by_user:user.user_name,
          is_active:props.dataNVR.is_active,
          created_by_device:'web',
          tid: props.dataNVR.tid,
          },
            message:'Tag Inventory Successfully Updated'     
          
          
          })
      })
      .catch((error) => {
          console.log(error)
          emit('nvrData', {
      status:'failed',
      data:{
        id:props.dataNVR.id,
          epc:props.dataNVR.epc,
          created_by_user:user.user_name,
          is_active:props.dataNVR.is_active,
          created_by_device:'web',
          tid: props.dataNVR.tid,
      },
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

const statuslist=[
  {
    title:'Active',
    value:true,
  },
  {
    title:'Inactive',
    value:false,
  }
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
    <h3 class="title-header">
       {{$t('Tag  - Update')}}
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
                  v-model="props.dataNVR.epc"
                  :rules="[requiredValidator]"
                  label="EPC"
                  
                />
              </VCol>

              <!-- ?? Email -->
              <VCol cols="12">
                <VTextField
                  v-model="props.dataNVR.tid"
                  :rules="[requiredValidator]"
                  label="TID"
                 
                />
              </VCol>
             


     <!-- ?? status -->
     <VCol cols="12">
              <VSelect
                  v-model="props.dataNVR.is_active"
                  label="Select status"
                  :rules="[requiredValidator]"
                  :items="statuslist"
                />
              </VCol>

            
            
              <!-- ?? Submit and Cancel -->
              <VCol cols="12">
                <VBtn
                  type="submit"
                  class="me-3"
                >
                  Submit
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
