<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import axios from 'axios';

import {departmentlist} from '@/helpers/helper'
import {URL, token} from '@/helpers/token'
import {
 
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
  'roleData',
])

const isFormValid = ref(false)
const refForm = ref()
const role_name = ref('')
const short_code = ref('')
const is_active = ref('')
const post_status =ref('')
const show=ref(false)
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
      axios.post(URL()+'/role',{
        'requestType':'create',
        'roleData':{
              
       role_name: role_name.value,
       short_code: short_code.value,
       is_active: true,
      
        }
     
      
      },{'headers': { Authorization: token()}, }).then((request, response) => {
       
        console.log(request.body)
        emit('roleData', {
        status:'success',
        data:{
          id: 0,       
        role_name: role_name.value,
        short_code: short_code.value,
        is_active: is_active.value,
        },
        message:'Role Successfully Created'      
      
      
      })
       
      })
      .catch((error) => {
          console.log(error)
        
          emit('roleData', {
        status:'failed',
        data:{
          id: 0,       
          role_name: role_name.value,
        short_code: short_code.value,
        is_active: is_active.value,
        },
        message:error
       
      
      
      })
      })
      
      
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
    <h3 class="title-header">{{$t('Role - Create')}}</h3>

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
                  v-model="role_name"
                  :rules="[requiredValidator]"
                  label="Role Name"
                />
              </VCol>
               <!-- ?? Full name -->
               <VCol cols="12">
                <VTextField
                  v-model="short_code"
                  :rules="[requiredValidator]"
                  label="Short Code"
                />
              </VCol>

              <!--VCol cols="12">
           

           <VSelect
             v-model="is_active"
             label="Status"
             :rules="[requiredValidator]"
             :items="status"
           />
         </VCol --->


            
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
