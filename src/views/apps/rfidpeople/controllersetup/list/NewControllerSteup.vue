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
  'controllerData',
])

const isFormValid = ref(false)
const refForm = ref()
const ip = ref('')
const devicename = ref('')
const port = ref('')
const selectedLocation = ref()
const password = ref('')
const device_type=ref()
const device_status = ref()
const device_enabled = ref()
const locationList=location()
const show2 = ref(false)
const rules = {
required: (value) => !!value || 'Required.',
min: (v) => v.length >= 8 || 'Min 8 characters',
}

// ?? drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
  // nextTick(() => {
  //   refForm.value?.reset()
  //   refForm.value?.resetValidation()
  // })
}
const onSubmit = () => {
 
 refForm.value?.validate().then(({ valid }) => {
   if (valid) {
    axios
            .post(
                URL() + `/controller`,
                {    
                          requestType: "create",
                           controller_data: {
                            device_name:devicename.value,
                            ip_address: ip.value,
                            port: port.value,
                            communication_password:password.value,
                            device_type:device_type.value,
                            device_status:1,
                            device_enabled:device_enabled.value,
                           
                            },
                            location: selectedLocation.value,
                        },
                { headers: { Authorization: token() } }
            )
    .then((response) => {
       console.log(response.data);
       emit("conrtollerData", {
                            status: "success",
                            data: {
                              id: response.data.id,
                              device_name:devicename.value,
                              ip_address: ip.value,
                              port: port.value,
                              communication_password:password.value,
                              device_type:device_type.value,
                              device_status:1,
                              device_enabled:device_enabled.value,
                              location: selectedLocation.value,
                            },
                            message: "Blood Group Successfully Created",
                        });
      
     })
     .catch((error) => {
      console.log(error);
                        emit("controllerData", {
                            status: "failed",
                            data: {
                                id: 0,
                                device_name:devicename.value,
                                ip_address: ip.value,
                                port: port.value,
                                communication_password:password.value,
                                device_type:device_type.value,
                                device_status:1,
                                device_enabled:device_enabled.value,
                                location: selectedLocation.value,
                            },
                            message: error,
                        });
     })
    //  emit('bloodgroupData', {
    //    id: 0,       
    //    blood_group_name:blood_group_name.value,
       
      
     
    //  })
     
     emit('update:isDrawerOpen', false)
    //  nextTick(() => {
    //    refForm.value?.reset()
    //    refForm.value?.resetValidation()
    //  })
   }
 })
}


const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}

const status =[
  {
    title: 'UP',
    value: 1,
  },
  {
    title: 'DOWN',
    value: 0,
  },
]

const enabled =[
  {
    title: 'YES',
    value: 1,
  },
  {
    title: 'NO',
    value: 0,
  },
]

const devicetype =[
  {
    title: 'Standalone',
    value: '1',
  },
  {
    title: 'Two-Door',
    value: '2',
  },
  {
    title: 'Four-Door',
    value: '4',
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
      <h6 class="text-h6">
      New Controller
      </h6>

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
                  v-model="ip"
                  :rules="[requiredValidator]"
                  label="IP"
                />
              </VCol>

              <!-- ?? Email -->
              <VCol cols="12">
                <VTextField
                  v-model="port"
                  :rules="[requiredValidator]"
                  label="Port"
                />
              </VCol>
             

              
              <!-- ?? company -->
              <!-- <VCol cols="12">
                <VTextField
                  v-model="rs_type"
                  :rules="[requiredValidator]"
                  label="RS Type"
                />
              </VCol> -->
              

             
              <VCol cols="12">
           

                <VSelect
                  v-model="device_type"
                  label="Device Type"
                  :rules="[requiredValidator]"
                  :items="devicetype"
                />
              </VCol>
             

               <VCol cols="12">
              <VTextField
                  v-model="devicename"
                  label="Device Name"
                  :rules="[requiredValidator]"
                 
                />
              </VCol>

              <VCol cols="12">
              <VSelect
                  v-model="selectedLocation"
                  label="Select Location"
                  :rules="[requiredValidator]"
                  :items="locationList"
                />
              </VCol>
             

              <VCol cols="12">
              <VSelect
                  v-model="device_enabled"
                  label="Select Enabled"
                  :rules="[requiredValidator]"
                  :items="enabled"
                />
              </VCol>
            
              <!-- ?? Submit and Cancel -->
              <VCol cols="12">
                <VBtn
                  type="submit"
                  class="me-3"
                >
                  Submit
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
