<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import {  requiredValidator } from '@validators'
import axios from 'axios';


import {location} from '@/helpers/helper'
import {URL, token} from '@/helpers/token'
const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'userData',
])

const isFormValid = ref(false)
const refForm = ref()
const department_description = ref('')
const department_short_code = ref('')
const reports_search_filter = ref('')
const report_display_flag = ref('')
const is_active = ref('')


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
     axios.post(URL()+'/department',{
      
      
       requestType: "create",
                            department_data: {
                              department_description:department_description.value,
                              department_short_code:department_short_code.value,
                              reports_search_filter:reports_search_filter.value,
                              report_display_flag:report_display_flag.value,
                              is_active:is_active.value,
                            },
       
     },{'headers': { Authorization: token()}, }).then((response) => {
      //  console.log(response.data.data);
      //  let data = response.data.data
       emit("userData", {
                            status: "success",
                            data: {
                                id: 0,
                                department_description:department_description.value,
       department_short_code:department_short_code.value,
       reports_search_filter:reports_search_filter.value,
       report_display_flag:report_display_flag.value,
       is_active:is_active.value,
                            },
                            message: "Department Successfully Created",
                        });
     })
     .catch((error) => {
         console.log(error)
         emit("userData", {
                            status: "failed",
                            data: {
                                id: 0,
                                department_description:department_description.value,
       department_short_code:department_short_code.value,
       reports_search_filter:reports_search_filter.value,
       report_display_flag:report_display_flag.value,
       is_active:is_active.value,
                            },
                            message: error,
                        });
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
      
      <h3 class="title-header"> {{$t('Department - Create')}}</h3>

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
                  v-model="department_description"
                  :rules="[requiredValidator]"
                  label="Department"
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="department_short_code"
                  :rules="[requiredValidator]"
                  label="Short Code"
                />
              </VCol>

              <VCol cols="12">
              
                <VSelect v-model="reports_search_filter" :rules="[requiredValidator]" :items="flag"  label="Report Filter" />
              </VCol>

              <VCol cols="12">
               
                <VSelect v-model="report_display_flag"  :rules="[requiredValidator]" :items="flag"  label="Report Display Flag" />
              </VCol>

              <VCol cols="12">
             
              <VSelect v-model="is_active" label="Status" :rules="[requiredValidator]" :items="status" />
                            
              </VCol>



             
             

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
