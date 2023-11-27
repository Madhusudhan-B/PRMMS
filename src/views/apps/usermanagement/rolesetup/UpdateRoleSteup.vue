<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import axios from 'axios';

import {URL, token} from '@/helpers/token'


import {
 
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
   dataRole: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'dataRole',
  'roleData',
])

const isFormValid = ref(false)
const refForm = ref()
  const roleid=ref('')
  
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
      axios.post(URL()+'/role', {
        'requestType':'update',
        'roleData':{
          id:props.dataRole.id,
        role_name:props.dataRole.role_name,
        short_code:props.dataRole.short_code,
        is_active:props.dataRole.is_active, 
        } 
      },{'headers': { Authorization: token()}, })
      .then((response) => {
        // console.log(response.data.data);
        // let data = response.data.data
        emit('roleData', {
        status:'success',
        data:{
          id: props.dataRole.id,       
          role_name:props.dataRole.role_name,
        short_code:props.dataRole.short_code,
        is_active:props.dataRole.is_active,
        },
        message:'Role Successfully Updated'      
      
      
      })
       
      })
      .catch((error) => {
        console.log(error)
        
        emit('roleData', {
      status:'failed',
      data:{
        id: 0,       
        role_name:props.dataRole.role_name,
        short_code:props.dataRole.short_code,
        is_active:props.dataRole.is_active,
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


const status =[
  {
    title: 'Active',
    value: true,
  },
  {
    title: 'Inactive',
    value: false,
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
    <h3 class="title-header">{{$t('Role - Update')}}</h3>

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
                  v-model="props.dataRole.id"
                  :rules="[requiredValidator]"                 
                  
                />
                </VCol>
        

               <!-- ?? Full name -->
               <VCol cols="12">
                <VTextField
                  v-model="props.dataRole.role_name"
                  :rules="[requiredValidator]"
                  label="Role Name"
                />
              </VCol>
               <!-- ?? Full name -->
               <VCol cols="12">
                <VTextField
                  v-model="props.dataRole.short_code"
                  :rules="[requiredValidator]"
                  label="Short code"
                />
              </VCol>

              <VCol cols="12">
           

                  <VSelect
                    v-model="props.dataRole.is_active"
                    label="Status"
                    :rules="[requiredValidator]"
                    :items="status"
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
               
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
