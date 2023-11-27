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
  dataUser:{
    type:String,
    required:true,
  }
})

const emit = defineEmits([
  'update:isDrawerOpen',
  //'dataUser',
])



const isFormValid = ref(false)
const refForm = ref()
const ip = ref('')
const port = ref('')
const password = ref('')
 const user_id = ref('')
  const nvr = ref('')
  const selectedLocation = ref()
 const selectedSegment = ref()
 const selectedStatus = ref()
 const id=props.dataUser

// ?? drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
  // nextTick(() => {
  //   refForm.value?.reset()
  //   refForm.value?.resetValidation()
  // })
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
   
  >
    <!-- ?? Title -->
    <div class="d-flex align-center pa-6 pb-1">
    <h3 class="title-header">{{$t('User - View')}}</h3>

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
           
          >
            <VRow>
              
            <VCol cols="5">
            Login ID
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{props.dataUser.login_name}}
              </VCol>

              <VCol cols="5">
              User name
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{props.dataUser.user_name}}
              </VCol>
              
              <VCol cols="5">
              Email
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{props.dataUser.email}}
              </VCol>

              <VCol cols="5">
              Access type
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{props.dataUser.access_type}}
              </VCol>
              
              <VCol cols="5">
              Department
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{props.dataUser.department ? props.dataUser.department.department_short_code : ''}}
              </VCol>
              
              <VCol cols="5">
              Phone Number
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{props.dataUser.phone_number}}
              </VCol>
               
              <VCol cols="5">
              Image
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              <img :src="props.dataUser.image_data" width="150" height="150" />
              </VCol>

              <VCol cols="5">
              Status
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{props.dataUser.is_active? 'Active':'Inactive'}}
              </VCol>
             
              <!-- <VCol cols="12">
              Access Type : {{props.dataUser.access_type}}
              </VCol>          -->
             
           
            
            
              <!-- ?? Cancel -->
              <VCol cols="12">
               
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

<style>
  .think{
  font-weight: bold;
}
  </style>
