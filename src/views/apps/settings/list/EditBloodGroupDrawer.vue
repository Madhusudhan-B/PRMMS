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
   databloodgroup: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'databloodgroup',
  'bloodgroupData',
])

const isFormValid = ref(false)
const refForm = ref()
const blood_group_name = ref('')

const name=props.databloodgroup.blood_group_name
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
      axios.post(URL()+'/blood_group', {       
        
        'requestType':'update',
        'blood_group_data':{
          blood_group_id:props.databloodgroup.id,
          blood_group_name:props.databloodgroup.blood_group_name,
        
        } 
       
      
        
       
      },{'headers': { Authorization: token()}, })
      
      .then((response) => {
        emit('bloodgroupData', {
              status:'success',
              data:{
                id:props.databloodgroup.id,
                blood_group_name:props.databloodgroup.blood_group_name,
        
          },
            message:'Blood group Successfully Updated'     
          
          
          })
       
      })
      .catch((error) => {
          console.log(error)
          emit('bloodgroupData', {
                status:'failed',
                data:{
                  id:props.databloodgroup.id,
                  blood_group_name:name,
        
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
    <h3 class="title-header">{{$t('Blood Group - Update')}}</h3>

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
                  v-model="props.databloodgroup.id"
                  :rules="[requiredValidator]"                 
                  
                />
                </VCol>
                <VCol cols="12">
              <VTextField
                  v-model="props.databloodgroup.blood_group_name"
                  label="Bloog Group"
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
