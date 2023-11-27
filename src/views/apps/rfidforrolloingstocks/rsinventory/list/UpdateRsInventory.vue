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

const  onFileChange = (event)=>{
                  
                  const file = event.target.files[0];
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = () => {
                    props.dataNVR.image_data= reader.result;
                  };
                }


                const user=localStorage.getItem('userData')


const onUpdate = () => {

  

 
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      axios.post(URL()+'/rs', {       
        
        'requestType':'update',
        'rs_data':{
          id:props.dataNVR.id,
          rolling_stock_type:props.dataNVR.rs_type,
                              created_by_user:user.user_name,
                              rs_number:props.dataNVR.rs_number,     
                              is_active:props.dataNVR.is_active,
                             // image_data: props.dataNVR.image_data,
                              created_by_device:'web'
                          
      
        } 
       
      
        
       
      },{'headers': { Authorization: token()}, })
     
      .then((response) => {
        console.log(response.data.data);
        let data = response.data.data
        emit('nvrData', {
              status:'success',
            data:{
              id:props.dataNVR.id,
          rolling_stock_type:props.dataNVR.rs_type,
                              created_by_user:user.user_name,
                              rs_number:props.dataNVR.rs_number,     
                              is_active:props.dataNVR.is_active,
                             // image_data: props.dataNVR.image_data,
                              created_by_device:'web'
          },
            message:'RS Inventory Successfully Updated'     
          
          
          })
      })
      .catch((error) => {
          console.log(error)
          emit('nvrData', {
      status:'failed',
      data:{
        id:props.dataNVR.id,
          rolling_stock_type:props.dataNVR.rs_type,
                              created_by_user:user.user_name,
                              rs_number:props.dataNVR.rs_number,     
                              is_active:props.dataNVR.is_active,
                             // image_data: props.dataNVR.image_data,
                              created_by_device:'web'
      },
      message:error
     
      })
      })

      emit('update:isDrawerOpen', false)
      
    }
  })
}

const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}


const rslist=[
  {
    title:'Wagon',
    value:2,
  },
  {
    title:'Locomotive',
    value:1,
  }
]

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
      {{$t('Rolling Stock - Update')}}
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
                 <!-- ?? Full name -->
              <VCol cols="12">
              <VSelect
                  v-model="props.dataNVR.rolling_stock_type"
                  label="Select RS Type"
                  :rules="[requiredValidator]"
                  :items="rslist"
                />
              </VCol>

            

            
              <VCol cols="12">
              <VTextField
                  v-model="props.dataNVR.rs_number"
                  label="Rs Number"
                  :rules="[requiredValidator]"
                 
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
