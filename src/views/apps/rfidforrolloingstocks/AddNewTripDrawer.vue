<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { requiredValidator } from '@validators'
import axios from 'axios';

import {tripstatus} from '@/helpers/helper'
import {URL, token} from '@/helpers/token'
const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'tripData',
])

const isFormValid = ref(false)
const refForm = ref()
const trip_id = ref('')
const trip_number = ref('')
const date = ref('')
const number_locomotives = ref('')
const number_wegons = ref('')
const is_status = ref('')
const selectedStatus= ref('')
const StatusList= tripstatus()


// ?? drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
  nextTick(() => {
    refForm.value?.reset()
    refForm.value?.resetValidation()
  })
}
const user=localStorage.getItem('userData')
//console.log(user)


const onSubmit = () => {
 
 refForm.value?.validate().then(({ valid }) => {
   if (valid) {
     axios
           .post(
               URL() + `/trip`,
               {    
                         requestType: "create",
                         trip_data: {
                           
                            trip_number: trip_number.value,
                            trip_date: date.value,
                            no_of_locos: number_locomotives.value,
                            no_of_wagons: number_wegons.value,
                            trip_status: selectedStatus.value,
                           
            
                           }
                          
                       },
               { headers: { Authorization: token() } }
           )
   .then((response) => {
      console.log(response.data);
      emit("tripData", {
                           status: "success",
                           data: {
                             id: 0,
                            
                            trip_number: trip_number.value,
                            trip_date: date.value,
                            no_of_locos: number_locomotives.value,
                            no_of_wagons: number_wegons.value,
                            trip_status: selectedStatus.value,
          
      
                           },
                           message: "Trip Successfully Created",
                       });
     
    })
    .catch((error) => {
     console.log(error);
                       emit("tripData", {
                           status: "failed",
                           data: {
                               id: 0,
                              
                            trip_number: trip_number.value,
                            trip_date: date.value,
                            no_of_locos: number_locomotives.value,
                            no_of_wagons: number_wegons.value,
                            trip_status: selectedStatus.value,
         
      
                           },
                           message: error,
                       });
    })
 
     emit('update:isDrawerOpen', false)
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
      <h3 style="color: #2f2774;"> {{$t('Trip - Create')}}</h3>

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
                  v-model="trip_number"
                  :rules="[requiredValidator]"
                  label="Trip Number"
                />
              </VCol>
              <VCol cols="12">
                <AppDateTimePicker
                  v-model="date"
                  :rules="[requiredValidator]"
                  label="Date"
                />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="number_locomotives"
                  :rules="[requiredValidator]"
                  label="Number of Locomotives"
                />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="number_wegons"
                  :rules="[requiredValidator]"
                  label="Number of Wegons"
                />
              </VCol>
              <VCol cols="12">
              <VSelect
                  v-model="selectedStatus"
                  label="Trip Status"
                  :rules="[requiredValidator]"
                  :items="StatusList"
                />
              </VCol>
            
               <!-- ?? status -->
  

              <!-- ?? Submit and Cancel -->
              <VCol cols="12">
                <VBtn
                  type="submit"
                  class="me-3"
                >
                  Submit
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
