<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import axios from 'axios';

import {location} from '@/helpers/helper'
import {URL, token} from '@/helpers/token'


import {
  emailValidator,
  requiredValidator,
} from '@validators'
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
   dataShift: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'dataShift',
  'shiftData',
])

const isFormValid = ref(false)
const refForm = ref()
const ip = ref('')
const devicename = ref('')
const port = ref('')
const password = ref('')
 const user_id = ref('')
  const device_no = ref('')
  const controllerid=ref('')
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
 
 refForm.value?.validate().then(({ valid }) => {
   if (valid) {
     axios.post(URL()+'/shift', {       
       
       'requestType':'update',
       'shift_data':{
        shift_id:props.dataShift.id,
        shift_name:props.dataShift.shift_name,
        
        shift_start_time: props.dataShift.shift_start_time,
        shift_end_time: props.dataShift.shift_end_time,
        
        compute_late_by:props.dataShift.compute_late_by,
        grace_late_by:props.dataShift.grace_late_by,
        break_start_time:props.dataShift.break_start_time,
        break_end_time: props.dataShift.break_end_time,    
       
       } ,
      
     
       
      
     },{'headers': { Authorization: token()}, })
     
     .then((response) => {
       emit('shiftData', {
             status:'success',
             data:{
        id:props.dataShift.id,
        shift_name:props.dataShift.shift_name,
        
        shift_start_time: props.dataShift.shift_start_time,
        shift_end_time: props.dataShift.shift_end_time,
        
        compute_late_by:props.dataShift.compute_late_by,
        grace_late_by:props.dataShift.grace_late_by,
        break_start_time:props.dataShift.break_start_time,
        break_end_time: props.dataShift.break_end_time,    
         },
         
           message:'Shift Successfully Updated'     
         
         
         })
      
     })
     .catch((error) => {
         console.log(error)
         emit('shiftData', {
               status:'failed',
               data:{
                id:props.dataShift.id,
        shift_name:props.dataShift.shift_name,
        
        shift_start_time: props.dataShift.shift_start_time,
        shift_end_time: props.dataShift.shift_end_time,
        
        compute_late_by:props.dataShift.compute_late_by,
        grace_late_by:props.dataShift.grace_late_by,
        break_start_time:props.dataShift.break_start_time,
        break_end_time: props.dataShift.break_end_time,    
         },
        
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
    value: 1,
  },
  {
    title: 'NO',
    value: 0,
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
    <h3 class="title-header">{{$t('Shift - Update')}}</h3>

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
              <VCol cols="12">
                <VTextField
                  v-model="props.dataShift.shift_name"
                  :rules="[requiredValidator]"
                  label="Shift name"
                />
              </VCol>

              <!-- ?? Email -->
              <VCol cols="12">
                <AppDateTimePicker 
                  v-model="props.dataShift.shift_start_time"
                  :rules="[requiredValidator]"
                  label="Shift start time"
                  :config="{ enableTime: true, noCalendar: true, dateFormat: 'H:i' }"

                />
              </VCol>
             

              <VCol cols="12">
              

                <AppDateTimePicker 
                  v-model="props.dataShift.shift_end_time"
                  :rules="[requiredValidator]"
                  label="Shift end time"
                  :config="{ enableTime: true, noCalendar: true, dateFormat: 'H:i' }"

                />
              </VCol>
              <!-- ?? company -->
              <!-- <VCol cols="12">
                <VTextField
                  v-model="rs_type"
                  :rules="[requiredValidator]"
                  label="RS Type"
                />
              </VCol> -->
              

             
              <VCol cols="12">
           

                <VTextField
                  v-model="props.dataShift.compute_late_by"
                  label="Compute late by"
                  :rules="[requiredValidator]"
                  
                />
              </VCol>
             

               <VCol cols="12">
              <VTextField
                  v-model="props.dataShift.grace_late_by"
                  label="Grace late by"
                  :rules="[requiredValidator]"
                 
                />
              </VCol>
              <VCol cols="12">
              <AppDateTimePicker 
                  v-model="props.dataShift.break_start_time"
                  label="Break Start Time"
                  :rules="[requiredValidator]"
                  :config="{ enableTime: true, noCalendar: true, dateFormat: 'H:i' }"

                />
              </VCol>
              <VCol cols="12">
              <AppDateTimePicker 
                  v-model="props.dataShift.break_end_time"
                  label="Break End Time"
                  :rules="[requiredValidator]"
                  :config="{ enableTime: true, noCalendar: true, dateFormat: 'H:i' }"

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
