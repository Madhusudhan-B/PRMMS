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
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'nvrData',
])

const isFormValid = ref(false)
const refForm = ref()

const epc = ref('')

 const tid = ref('')
 

// ?? drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
  nextTick(() => {
    refForm.value?.reset()
    refForm.value?.resetValidation()
  })
}
const user=localStorage.getItem('userData')

const onSubmit = () => {
 
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      axios.post(URL()+'/tag_inventory',{
        
        
        requestType: "create",
        tag_inventory_data: {
                              epc:epc.value,
                             
                              tid: tid.value,
                              is_active:true,
                              created_by_device:'web',
                              created_by_user:user.user_name
      
                            },
      },{'headers': { Authorization: token()}, }).then((response) => {
        console.log(response.data.data);
        let data = response.data
        emit("nvrData", {
                            status: "success",
                            data: {
                                id: 0,
                                epc:epc.value,
                              created_by_user:user.user_name,  
                              tid: tid.value,
                              is_active:true,
       
                            },
                            message: "Tag Inventory Successfully Created",
                        });
      })
      .catch((error) => {
          console.log(error)
          emit("nvrData", {
                            status: "failed",
                            data: {
                                id: 0,
                                epc:epc.value,
                              created_by_user:user.user_name,  
                              tid: tid.value,
                              is_active:true,
       
                            },
                            message: error,
                        });
      })
      // emit('nvrData', {
      //   id: 0,       
      //   device_name:epc.value,
      //   ip_address: ip.value,
      //   port: port.value,
      //   device_no:device_no.value,
      //   //location: selectedLocation.value,
      //   user_name: tid.value,
      //   password: password.value,
      
      // })
      
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
      <h3 class="title-header">
       {{$t('Tag - Create')}}
      </h3>

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
            
              <!-- ?? company -->
              <!-- <VCol cols="12">
                <VTextField
                  v-model="rs_type"
                  :rules="[requiredValidator]"
                  label="RS Type"
                />
              </VCol> -->
              

               <VCol cols="12">
              <VTextField
                  v-model="epc"
                  label="EPC"
                  :rules="[requiredValidator]"
                 
                />
              </VCol>
             
           
               <VCol cols="12">
                <VTextField
                  v-model="tid"
                  :rules="[requiredValidator]"
                  label="TID"
                />
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
