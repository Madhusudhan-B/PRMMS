<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import axios from 'axios';

import {location} from '@/helpers/helper'
import {URL, token} from '@/helpers/token'


// import {
//   emailValidator,
//   requiredValidator,
// } from '@validators'
const show2 = ref(false)
const rules = {
required: (value) => !!value || 'Required.',
min: (v) => v.length >= 8 || 'Min 8 characters',
}
const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
   dataReader: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'dataReader',
  'readerData',
])

const isFormValid = ref(false)
const refForm = ref()
const door_name = ref('')
const device_name = ref('')
const door_no = ref('')
const reader_name = ref('')
 const reader_number = ref('')
 
  const Readerid=ref('')
  
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
     axios.post(URL()+'/controller_reader', {       
       
       'requestType':'update',
       'controller_reader_data':{
        controller_reader_id:props.dataReader.id,
         reader_name:props.dataReader.reader_name,
       
       } ,
       subsystem_id:1,
      
     
       
      
     },{'headers': { Authorization: token()}, })
     
     .then((response) => {
       emit('readerData', {
             status:'success',
             data:{
              id:response.data.id,
         reader_name:props.dataReader.reader_name,
       
         },
         subsystem_id:1,
         
           message:'Reader Successfully Updated'     
         
         
         })
      
     })
     .catch((error) => {
         console.log(error)
         emit('readerData', {
               status:'failed',
               data:{
                id:props.dataReader.id,
         reader_name:props.dataReader.reader_name,
         },
         subsystem_id:1,
        
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


const state =[
  {
    title: 'IN',
    value: 'IN',
  },
  {
    title: 'OUT',
    value: 'OUT',
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
    <h3 class="title-header">Reader - Update</h3>

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
                  v-model="props.dataReader.id"
                  :rules="[requiredValidator]"                 
                  
                />
                </VCol>
                <VCol cols="12">
                
                <VTextField
                  v-model="props.dataReader.device_name"
                  :rules="[requiredValidator]"
                  label="Device Name"
                  
                />
              </VCol>

              <!-- ?? Email -->
              <VCol cols="12">
                <VTextField
                  v-model="props.dataReader.door_name"
                  :rules="[requiredValidator]"
                  label="Door Name"
                  
                />
              </VCol>
             



               <VCol cols="12">
              <VTextField
                  v-model="props.dataReader.reader_number"
                  label="Reader No"
                  :rules="[requiredValidator]"
                  
                />
              
              </VCol>

              
              <VCol cols="12">
              <VTextField
                  v-model="props.dataReader.reader_name"
                  label="Reader Name"
                  :rules="[requiredValidator]"
                  
                />
              
              </VCol>

          
              <VCol cols="12">
              <VSelect
                  v-model="props.dataReader.inout_state"
                  label="In/Out State"
                  :rules="[requiredValidator]"
                  :items="state"
                  
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
