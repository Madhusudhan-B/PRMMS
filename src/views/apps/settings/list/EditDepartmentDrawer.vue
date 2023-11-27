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
  datadepartment: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'datadepartment',
  'departmentData',
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
      axios.post(URL()+'/department', {
     
         
        'requestType':'update',
        'department_data':{
          id:props.datadepartment.id,
        department_description:props.datadepartment.department_description,
        department_short_code:props.datadepartment.department_short_code,
        reports_search_filter:props.datadepartment.reports_search_filter,
        reports_search_filter:props.datadepartment.reports_search_filter,
        is_active:props.datadepartment.is_active,
        } 
        
       
      },{'headers': { Authorization: token()}, })
      .then((response) => {
        // console.log(response.data.data);
        // let data = response.data.data
        emit('datadepartment', {
              status:'success',
            data:{
            id: props.datadepartment.id,       
            department_description:props.datadepartment.department_description,
            department_short_code:props.datadepartment.department_short_code,
            reports_search_filter:props.datadepartment.reports_search_filter,
            reports_search_filter:props.datadepartment.reports_search_filter,
            is_active:props.datadepartment.is_active,
          
          },
            message:'Location Successfully Updated'     
          
          
          })
      })
      .catch((error) => {
          console.log(error)
          emit('datadepartment', {
      status:'failed',
      data:{
        id: props.datalocation.id,       
        department_description:props.datadepartment.department_description,
        department_short_code:props.datadepartment.department_short_code,
        reports_search_filter:props.datadepartment.reports_search_filter,
        reports_search_filter:props.datadepartment.reports_search_filter,
        is_active:props.datadepartment.is_active,
       
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

const flag=[
  {
    title:1,
    value:1,
  },
  {
    title:0,
    value:0,
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
     
      <h3 class="title-header">{{$t('Department - Update')}}</h3>

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
                  v-model="props.datadepartment.id"
                  :rules="[requiredValidator]"                 
                  
                />
                </VCol>
                <VCol cols="12">
              <VTextField
                  v-model="props.datadepartment.department_description"
                  label="Department"
                  :rules="[requiredValidator]"
                 
                />
              </VCol>
              <VCol cols="12">
              <VTextField
                  v-model="props.datadepartment.department_short_code"
                  label="Short Code"
                  :rules="[requiredValidator]"
                 
                />
              </VCol>
              <VCol cols="12">
              <VTextField
                  v-model="props.datadepartment.reports_search_filter"
                  label="Search Filter"
                  :rules="[requiredValidator]"
                 
                />
              </VCol>
           

              <VCol cols="12">
              
              <VSelect v-model="props.datadepartment.reports_search_filter"  :rules="[requiredValidator]" :items="flag"  label="Report Filter" />
            </VCol>

            <VCol cols="12">
             
              <VSelect v-model="props.datadepartment.report_display_flag"  :rules="[requiredValidator]" :items="flag"  label="Report Display Flag" />
            </VCol>

            <VCol cols="12">
           
            <VSelect v-model="props.datadepartment.is_active" label="Status" :rules="[requiredValidator]" :items="status" />
                          
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
