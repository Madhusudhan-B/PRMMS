<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import axios from 'axios';

import { location,getnvrList,getsegmentList,cctvzoneList} from '@/helpers/helper'
import {URL, token} from '@/helpers/token'


import {
  //emailValidator,
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
  'cctvData',
])

const isFormValid = ref(false)
const refForm = ref()
const ip = ref('')
const devicename = ref('')
const port = ref('')
const password = ref('')
 const user_id = ref('')
  const nvr = ref('')
  const segment=ref('')
  const selectedLocation = ref()
 const selectedSegment = ref()
 const selectedStatus = ref()

 const locationList=location()
 const nvrList=getnvrList()
 const segmentList=getsegmentList()
 const zonelist=cctvzoneList()

 const  subsystem_id= ref('')
 const subsystem = ref('')

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

     axios.post(URL()+'/devices/cctv',{
       requestType: "create",
       cctv_data: {
        device_name:devicename.value,
        ip_address: ip.value,
        port: port.value,
        devicename:devicename.value,
        location: selectedLocation.value,
        user_name: 'admin',
        password: 'password',
        nvr:nvr.value,
        cctv_zone_id:subsystem.value,
        segment:segment.value
        
      },
      subsystem_id: subsystem_id.value,

     
     },{'headers': { Authorization: token()}, }).then((response) => {
       let data = response.data
       emit("cctvData", {
                           status: "success",
                           data: {
                               id: devicename.cctv_id,
                               device_name:devicename.value,
                            ip_address: ip.value,
                            port: port.value,
                            devicename:devicename.value,
                            location: selectedLocation.value,
                            user_name: 'admin',
                            password: 'password',
                            nvr:nvr.value,
                            segment:segment.value
        
      
                      },
                      subsystem_id: subsystem_id.value,

                           message: "CCTV Successfully Created",
                       });
     })
     .catch((error) => {
       emit("cctvData", {
                           status: "failed",
                           data: {
                               id: 0,
                               id: data.cctv_id,
                               device_name:devicename.value,
                              ip_address: ip.value,
                              port: port.value,
                              devicename:devicename.value,
                              location: selectedLocation.value,
                              user_name: 'admin',
                              password: 'password',
                              nvr:nvr.value,
                              segment:segment.value
        
      
                           },
                           subsystem_id: subsystem_id.value,

                           message: error,
                       });
     
     })
     // emit('cctvData', {
     //   id: 0,       
     //   device_name: device_name.value,
     //   ip_address: ip_address.value,
     //   port: port.value,
      
     
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
     
      <h3 class="title-header" >
        {{$t('CCTV - Create')}}
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
               <!--VCol cols="12">
                <VTextField
                  v-model="user_id"
                  :rules="[requiredValidator]"
                  label="User ID"
                />
              </VCol>
             
              <VCol cols="12">
                <VTextField
                  v-model="password"
                  :rules="[requiredValidator]"
                  label="Password"
                />
              </VCol  -->
             
              <VCol cols="12">
              <VSelect
                  v-model="nvr"
                  label="Select NVR"
                  :rules="[requiredValidator]"
                  :items="nvrList"
                />
              </VCol>
              <VCol cols="12">
              <VSelect
                  v-model="subsystem"
                  label="Select Subsystem"
                  :rules="[requiredValidator]"
                  :items="zonelist"
                />
              </VCol>

              <VCol cols="12">
              <VSelect
                  v-model="segment"
                  label="Select Segment"
                  :rules="[requiredValidator]"
                  :items="segmentList"
                />
              </VCol>
              <VCol cols="12">
              <VTextField
                  v-model="subsystem_id"
                  label="SubSystem ID"
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
