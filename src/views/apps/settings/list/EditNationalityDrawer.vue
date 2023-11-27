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
  datanationality: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'nationalityData',
  'datanationality',
])

const isFormValid = ref(false)
const refForm = ref()
const nationality_name = ref('')

  
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
      axios.post(URL()+'/nationality', {       
        
        'requestType':'update',
        'nationality_data':{
          nationality_id:props.datanationality.id,
          nationality_name:props.datanationality.nationality_name,
        
        
        } 
              
      },{'headers': { Authorization: token()}, })
      
      
      .then((response) => {
        // console.log(response.data.data);
        // let data = response.data.data
        emit('nationalityData', {
              status:'success',
            data:{
            id: props.datanationality.id,       
            nationality_name:props.datanationality.nationality_name,
          },
            message:'Location Successfully Updated'     
          
          
          })
       
      })
      .catch((error) => {
          console.log(error)
          emit('nationalityData', {
      status:'failed',
      data:{
        id: props.datanationality.id,       
        nationality_name:props.datanationality.nationality_name,
      },
      message:error
     
      })
      })

      emit('update:isDrawerOpen', false)
      // emit('datanationality', {
      //   id: 0,       
      //   nationality_name:props.datanationality.nationality_name,
       
      
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
    <h3 class="title-header">{{$t('Nationality - Update')}}</h3>

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
                  v-model="props.datanationality.id"
                  :rules="[requiredValidator]"                 
                  
                />
                </VCol>
                <VCol cols="12">
              <VTextField
                  v-model="props.datanationality.nationality_name"
                  label="Nationality Name"
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
