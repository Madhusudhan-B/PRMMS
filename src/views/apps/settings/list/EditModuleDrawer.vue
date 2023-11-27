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
   datamodule: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'datamodule',
  'moduleData',
])

const isFormValid = ref(false)
const refForm = ref()
const module_name = ref('')
const short_code = ref('')
const display_priority = ref('')
const is_active = ref('')

  
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
      axios.post(URL()+'/module', {       
        
        'requestType':'update',
        'module_data':{
          module_id:props.datamodule.id,
          module_name:props.datamodule.module_name,
        short_code:props.datamodule.short_code,
        display_priority:props.datamodule.display_priority,
        is_active:props.datamodule.is_active,
        
        
        } 
       
      
        
       
      },{'headers': { Authorization: token()}, })
      
     
      .then((response) => {
        emit('moduleData', {
              status:'success',
              data:{
               id:props.datamodule.id,
          module_name:props.datamodule.module_name,
        short_code:props.datamodule.short_code,
        display_priority:props.datamodule.display_priority,
        is_active:props.datamodule.is_active,
        
          },
            message:'Module Successfully Updated'     
          
          
          })
       
      })
      .catch((error) => {
          console.log(error)
          emit('leaveData', {
                status:'failed',
                data:{
                  id:props.datamodule.id,
          module_name:props.datamodule.module_name,
        short_code:props.datamodule.short_code,
        display_priority:props.datamodule.display_priority,
        is_active:props.datamodule.is_active,
        
                },
                message:error
              
                })
      nextTick(() => {
        refForm.value?.reset()
        refForm.value?.resetValidation()
      })
      })

      emit('update:isDrawerOpen', false)
      emit('datamodule', {
        id: 0,       
        module_name:props.datamodule.module_name,
        short_code:props.datamodule.short_code,
        display_priority:props.datamodule.display_priority,
        is_active:props.datamodule.is_active,
       
      
      })
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

const status = [
        {
            title: "Active",
            value: true,
        },
        {
            title: "Inactive",
            value: false,
        },
    ];
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
     
      <h3 class="title-header"> {{$t('Module - Update')}}</h3>

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
                  v-model="props.datamodule.id"
                  :rules="[requiredValidator]"                 
                  
                />
                </VCol>
                <VCol cols="12">
              <VTextField
                  v-model="props.datamodule.module_name"
                  label="Module Name"
                  :rules="[requiredValidator]"
                 
                />
              </VCol>
              <VCol cols="12">
              <VTextField
                  v-model="props.datamodule.short_code"
                  label="Short Code"
                  :rules="[requiredValidator]"
                 
                />
              </VCol>
              <VCol cols="12">
              <VTextField
                  v-model="props.datamodule.display_priority"
                  label="Display Priority"
                  :rules="[requiredValidator]"
                 
                />
              </VCol>
               
              <VCol cols="12">
                                <VSelect v-model="props.datamodule.is_active" label="Select Status" :rules="[requiredValidator]" :items="status" />
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
