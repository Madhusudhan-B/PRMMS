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
const rs_type = ref('')

 const photo = ref('')
  const rs_number = ref(1)
  const created_by_user=ref('')
 


// ?? drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
  nextTick(() => {
    refForm.value?.reset()
    refForm.value?.resetValidation()
  })
}


const  onFileChange = (event)=>{
                  
                  const file = event.target.files[0];
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = () => {
                    photo.value= reader.result;
                  };
                }


                const user=localStorage.getItem('userData')

const onSubmit = () => {
 
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      axios.post(URL()+'/rs',{
        
        
        requestType: "create",
        rs_data: {
          rolling_stock_type:rs_type.value,
                              created_by_user:user.user_name,
                              rs_number:rs_number.value,     
                              is_active:true,
                             // image_data: photo.value,
                              created_by_device:'web'
      
                            },
      },{'headers': { Authorization: token()}, }).then((response) => {
        console.log(response.data.data);
        let data = response.data
        emit("nvrData", {
                            status: "success",
                            data: {
                                id: data.rs_id,
                                rs_type:rs_type.value,
                              created_by_user:user.user_name,
                              rs_number:rs_number.value,     
                              is_active:true,
                             // image_data: photo.value,
                              created_by_device:'web'
       
                            },
                            message: "RS Inventory Successfully Created",
                        });
      })
      .catch((error) => {
          console.log(error)
          emit("nvrData", {
                            status: "failed",
                            data: {
                                id: 0,
                                rs_type:rs_type.value,
                              created_by_user:user.user_name,
                              rs_number:rs_number.value,     
                              is_active:true,
                           //   image_data: photo.value,
                            },
                            message: error,
                        });
      })

      // emit('nvrData', {
      //   id: 0,       
      //   device_name:devicename.value,
      //   ip_address: ip.value,
      //   port: port.value,
      //   rs_number:rs_number.value,
      //   //location: selectedLocation.value,
      //   user_name: user_id.value,
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

const rslist=[
  {
    title:'Wagon',
    value:2,
  },
  {
    title:'Locomotive',
    value:1,
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
      <h3 class="title-header">
        {{$t('Rolling Stock - Create')}}
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
              <!-- ?? Full name -->
              <VCol cols="12">
              <VSelect
                  v-model="rs_type"
                  label="Select RS Type"
                  :rules="[requiredValidator]"
                  :items="rslist"
                />
              </VCol>

            

            
              <VCol cols="12">
              <VTextField
                  v-model="rs_number"
                  label="RS Number"
                  :rules="[requiredValidator]"
                  
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
