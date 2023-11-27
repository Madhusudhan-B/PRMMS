<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import axios from 'axios';

import {location, moduleslist} from '@/helpers/helper'
import {URL, token} from '@/helpers/token'


import {
 
  requiredValidator,
} from '@validators'

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  datasubmodule: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'datasubmodule',
  'submoduleData',
])
const items = ["Add", "View", "Edit", "Delete"];
const isFormValid = ref(false)
const refForm = ref()

const modiuleList = moduleslist()
  
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

      
      
      axios.post(URL()+'/sub_module', {       
        
        'requestType':'update',
        'sub_module_data':{
          sub_module_id:props.datasubmodule.id,
          sub_module_name:props.datasubmodule.sub_module_name,
        short_code:props.datasubmodule.short_code,
        display_priority:props.datasubmodule.display_priority,
        is_active:props.datasubmodule.is_active,
        access_config:props.datasubmodule.access_config,
        module:props.datasubmodule.module,
        
        } 
       
      
        
       
      },{'headers': { Authorization: token()}, })
     
      .then((response) => {
        emit('submoduleData', {
              status:'success',
            data:{
              id:props.datasubmodule.id,
          sub_module_name:props.datasubmodule.sub_module_name,
        short_code:props.datasubmodule.short_code,
        display_priority:props.datasubmodule.display_priority,
        is_active:props.datasubmodule.is_active,
        access_config:props.datasubmodule.access_config,
        module:props.datasubmodule.module,
          },
            message:'Sub Module Successfully Updated'     
          
          
          })
       
      })
      .catch((error) => {
        console.log(error)
          emit('submoduleData', {
      status:'failed',
      data:{
        id:props.datasubmodule.id,
          sub_module_name:props.datasubmodule.sub_module_name,
        short_code:props.datasubmodule.short_code,
        display_priority:props.datasubmodule.display_priority,
        is_active:props.datasubmodule.is_active,
        access_config:props.datasubmodule.access_config,
        module:props.datasubmodule.module,
      },
      message:error
     
      })
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
    <h3 class="title-header">{{$t('Sub Module - Update')}}</h3>

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
                  v-model="props.datasubmodule.id"
                  :rules="[requiredValidator]"                 
                  
                />
                </VCol>
                <VCol cols="12">
              <VSelect
                  v-model="props.datasubmodule.module"
                  label=" Module name"
                  :rules="[requiredValidator]"
                
                  :items="modiuleList"
                 
                />
              </VCol>
                <VCol cols="12">
              <VTextField
                  v-model="props.datasubmodule.sub_module_name"
                  label="Sub Module name"
                  :rules="[requiredValidator]"
                 
                />
              </VCol>
              <VCol cols="12">
              <VTextField
                  v-model="props.datasubmodule.short_code"
                  label="Short Code"
                  :rules="[requiredValidator]"
                 
                />
              </VCol>
              <VCol cols="12">
              <VTextField
                  v-model="props.datasubmodule.display_priority"
                  label="Display Priority"
                  :rules="[requiredValidator]"
                 
                />
              </VCol>
              <VCol cols="12">
                                <VSelect v-model="props.datasubmodule.is_active" label="Select One" :rules="[requiredValidator]" :items="status" />
                            </VCol>

                            <VCol cols="12">
                                <VSelect v-model="props.datasubmodule.access_config" label="Select Access Config" :rules="[requiredValidator]" :items="items" multiple />
             
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
