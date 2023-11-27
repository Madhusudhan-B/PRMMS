<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import {requiredValidator } from '@validators'
import axios from 'axios';
import {URL, token} from '@/helpers/token'
import {location} from '@/helpers/helper'


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
  'deviceData',
])

const isFormValid = ref(false)
const refForm = ref()


const device_name = ref('')
 const ip_address = ref('')
 const subsystem_id = ref('')
 const port = ref('')
 
 // const location = ref('')
 //const session = ref()
// const plan = ref()
// const status = ref()

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

      axios.post(URL()+'/devices/pids_device',{
                                  requestType: "create",
                                  pids_device_data: {
                                    device_name: device_name.value,
                                  ip_address: ip_address.value,
                                  port: port.value,
      
                            },
                            subsystem_id: subsystem_id.value,
      
      },{'headers': { Authorization: token()}, }).then((response) => {
        let data = response.data
        emit("deviceData", {
                            status: "success",
                            data: {
                                id: data.pids_device_id,
                                device_name: device_name.value,
                                ip_address: ip_address.value,
                                port: port.value,
       
                            },
                            subsystem_id: subsystem_id.value,
                            message: "Device Successfully Created",
                        });
      })
      .catch((error) => {
        emit("deviceData", {
                            status: "failed",
                            data: {
                                id: 0,
                                device_name:device_name.value,
                                device_name: device_name.value,
                                ip_address: ip_address.value,
                                port: port.value,
                            },
                            subsystem_id: subsystem_id.value,
                            message: error,
                        });
      
      })
      // emit('deviceData', {
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
      {{$t('Device - Create')}}
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
             

              <!-- ?? Email -->
              <VCol cols="12">
                <VTextField
                  v-model="device_name"
                  :rules="[requiredValidator, emailValidator]"
                  label="Device Name"
                />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="ip_address"
                  :rules="[requiredValidator]"
                  label="IP Address"
                />
              </VCol>
            
              <VCol cols="12" >
                <VTextField
                  v-model="port"
                  :rules="[requiredValidator]"
                  label="Port"
                 
                />
              </VCol>
              <VCol cols="12">
              <VTextField
                  v-model="subsystem_id"
                  label="SubSystem ID"
                  :rules="[requiredValidator]"
                 
                />
              </VCol>
              

              <!-- <VCol cols="12">
              <VSelect
                  v-model="location"
                  label="Select Location"
                  :rules="[requiredValidator]"
                  :items="['location_short_code', 'location_description']"
                />
              </VCol> -->
              
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
