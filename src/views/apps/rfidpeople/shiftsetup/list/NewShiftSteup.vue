<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import axios from 'axios';
import AppDateTimePicker from '@core/components/AppDateTimePicker.vue'

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
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'shiftData',
])

const isFormValid = ref(false)
const refForm = ref()


const shift_name = ref('')
const shift_start_time = ref('')
const shift_end_time = ref('')
const communication_password = ref()
const compute_late_by = ref('')
const grace_late_by=ref()
const break_start_time = ref()
const break_end_time = ref()
const show2 = ref(false)
const rules = {
required: (value) => !!value || 'Required.',
min: (v) => v.length >= 8 || 'Min 8 characters',
}

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
    axios
            .post(
                URL() + `/shift`,
                {    
                          requestType: "create",
                          shift_data: {
                            shift_name:shift_name.value,
        
                            shift_start_time: shift_start_time.value,
                            shift_end_time: shift_end_time.value,
                            
                            compute_late_by:compute_late_by.value,
                            grace_late_by:grace_late_by.value,
                            break_start_time:break_start_time.value,
                            break_end_time: break_end_time.value,      
                                              
                            },
                           
                        },
                { headers: { Authorization: token() } }
            )
    .then((response) => {
       console.log(response.data);
       emit("shiftData", {
                            status: "success",
                            data: {
                              id: 0,
                              shift_name:shift_name.value,
        
                              shift_start_time: shift_start_time.value,
                              shift_end_time: shift_end_time.value,
                              
                              compute_late_by:compute_late_by.value,
                              grace_late_by:grace_late_by.value,
                              break_start_time:break_start_time.value,
                              break_end_time: break_end_time.value,      
                            },
                            message: "Shift Successfully Created",
                        });
      
     })
     .catch((error) => {
      console.log(error);
                        emit("shiftData", {
                            status: "failed",
                            data: {
                                id: 0,
                                shift_name:shift_name.value,
        
                                shift_start_time: shift_start_time.value,
                                shift_end_time: shift_end_time.value,
                                
                                compute_late_by:compute_late_by.value,
                                grace_late_by:grace_late_by.value,
                                break_start_time:break_start_time.value,
                                break_end_time: break_end_time.value,      
                            },
                            message: error,
                        });
     })
    //  emit('bloodgroupData', {
    //    id: 0,       
    //    blood_group_name:blood_group_name.value,
       
      
     
    //  })
     
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
    <h3 class="title-header">{{$t('Shift - Create')}}</h3>

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
              <VCol cols="12">
                <VTextField
                  v-model="shift_name"
                  :rules="[requiredValidator]"
                  label="Shift name"
                />
              </VCol>

              <!-- ?? Email -->
              <VCol cols="12">
                <AppDateTimePicker 
                  v-model="shift_start_time"
                  :rules="[requiredValidator]"
                  label="Shift start time"
                  :config="{ enableTime: true, noCalendar: true, dateFormat: 'H:i' }"

                />
              </VCol>
             

              <VCol cols="12">
              

                <AppDateTimePicker 
                  v-model="shift_end_time"
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
                  v-model="compute_late_by"
                  label="Compute late by"
                  :rules="[requiredValidator]"
                  
                />
              </VCol>
             

               <VCol cols="12">
              <VTextField
                  v-model="grace_late_by"
                  label="Grace late by"
                  :rules="[requiredValidator]"
                 
                />
              </VCol>
              <VCol cols="12">
              <AppDateTimePicker 
                  v-model="break_start_time"
                  label="Break Start Time"
                  :rules="[requiredValidator]"
                  :config="{ enableTime: true, noCalendar: true, dateFormat: 'H:i' }"

                />
              </VCol>
              <VCol cols="12">
              <AppDateTimePicker 
                  v-model="break_end_time"
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
