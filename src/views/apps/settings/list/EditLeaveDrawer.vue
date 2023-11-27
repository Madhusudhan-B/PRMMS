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
  dataleave: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'dataleave',
  'leaveData',
])

const isFormValid = ref(false)
const refForm = ref()


  
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

      axios.post(URL()+'/leave_type', {       
        
        'requestType':'update',
        'leave_type_data':{
          leave_type_id:props.dataleave.id,
          leave_type_name:props.dataleave.leave_type_name,
        description:props.dataleave.description,
        is_active:props.dataleave.is_active,
        
        } 
       
      
        
       
      },{'headers': { Authorization: token()}, })
      
      .then((response) => {
        emit('leaveData', {
              status:'success',
            data:{
            id: props.dataleave.id,       
            leave_type_name:props.dataleave.leave_type_name,
        description:props.dataleave.description,
        is_active:props.dataleave.is_active,
          },
            message:'Leave type Successfully Updated'     
          
          
          })
       
      })
      .catch((error) => {
          console.log(error)
          emit('leaveData', {
      status:'failed',
      data:{
        id: props.dataleave.id,       
        leave_type_name:props.dataleave.leave_type_name,
        description:props.dataleave.description,
        is_active:props.dataleave.is_active,
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

const status=[
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
     
      <h3 class="title-header">{{$t('Leave - Update')}}</h3>

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
                  v-model="props.dataleave.id"
                  :rules="[requiredValidator]"                 
                  
                />
                </VCol>
                <VCol cols="12">
              <VTextField
                  v-model="props.dataleave.leave_type_name"
                  label="Leave Type"
                  :rules="[requiredValidator]"
                 
                 
                />
                <!-- :items="['Casual Leave', 'Sick Leave', 'Earned Leave']" -->
              </VCol>
              <VCol cols="12">
              <VTextField
                  v-model="props.dataleave.description"
                  label="Description"
                  :rules="[requiredValidator]"
                 
                />
              </VCol>
              
              <VCol cols="12">
             
             <VSelect v-model="props.dataleave.is_active" label="Status" :rules="[requiredValidator]" :items="status" />
                           
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
