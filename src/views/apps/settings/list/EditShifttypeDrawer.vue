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
   datashifttype: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'datashifttype',
  'shifttypeData',
])

const isFormValid = ref(false)
const refForm = ref()
const shift_type_description = ref('')

  
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
      axios.post(URL()+'/shift_type', {       
        
        'requestType':'update',
        'shift_type_data':{
          shift_type_id:props.datashifttype.id,
          shift_type_description:props.datashifttype.shift_type_description,
        } 
       
      
        
       
      },{'headers': { Authorization: token()}, })
      
      .then((response) => {
        // console.log(response.data.data);
        // let data = response.data.data
        emit('shifttypeData', {
              status:'success',
            data:{
             id:props.datashifttype.id,
          shift_type_description:props.datashifttype.shift_type_description,
          },
            message:'Shift Type Successfully Updated'     
          
          
          })
      })
      .catch((error) => {
          console.log(error)
          emit('shifttypeData', {
      status:'failed',
      data:{
        id:props.datashifttype.id,
          shift_type_description:props.datashifttype.shift_type_description,
      },
      message:error
     
      })
      })

      emit('update:isDrawerOpen', false)
      // emit('datashifttype', {
      //   id: 0,       
      //   shift_type_description:props.datashifttype.shift_type_description,
       
      
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
    <h3 class="title-header">{{$t('Shift Type - Update')}}</h3>

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
                  v-model="props.datashifttype.id"
                  :rules="[requiredValidator]"                 
                  
                />
                </VCol>
                <VCol cols="12">
              <VTextField
                  v-model="props.datashifttype.shift_type_description"
                  label="Shift Type"
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
