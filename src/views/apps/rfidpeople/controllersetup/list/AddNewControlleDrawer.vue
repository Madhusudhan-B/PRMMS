<script setup>
import { ref, defineProps, defineEmits, nextTick } from 'vue'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import axios from 'axios'

import { location } from '@/helpers/helper'
import { URL, token } from '@/helpers/token'
import { emailValidator, requiredValidator } from '@validators'

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:isDrawerOpen', 'controllerData'])

const isFormValid = ref(false)
const refForm = ref()
const ip = ref('')
const devicename = ref('')
const port = ref('')
const selectedLocation = ref()
const password = ref('')
const device_type = ref()
const device_enabled = ref()

const locationList = location()

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
      axios
        .post(
          URL() + `/devices/controller`,
          {
            requestType: 'create',
            controller_data: {
              device_name: devicename.value,
              ip_address: ip.value,
              port: port.value,
              communication_password: password.value,
              device_type: device_type.value,
              device_status: 1,
              device_enabled: device_enabled.value,
              location: selectedLocation.value,
            },
            subsystem_id: 1,
          },
          { headers: { Authorization: token() } }
        )
        .then((response) => {
          console.log(response.data)
          emit('controllerData', {
            status: 'success',
            data: {
              id: 0,
              device_name: devicename.value,
              ip_address: ip.value,
              port: port.value,
              communication_password: password.value,
              device_type: device_type.value,
              device_status: 1,
              device_enabled: device_enabled.value,
              location: selectedLocation.value,
            },
            subsystem_id: 1,
            message: 'Controller Successfully Created',
          })
        })
        .catch((error) => {
          console.error(error)
          emit('controllerData', {
            status: 'failed',
            data: {
              id: 0,
              device_name: devicename.value,
              ip_address: ip.value,
              port: port.value,
              communication_password: password.value,
              device_type: device_type.value,
              device_status: 1,
              device_enabled: device_enabled.value,
              location: selectedLocation.value,
            },
            subsystem_id: 1,
            message: error.message || 'Error creating controller',
          })
        })

      emit('update:isDrawerOpen', false)
    }
  })
}

const handleDrawerModelValueUpdate = (val) => {
  emit('update:isDrawerOpen', val)
}

const status = [
  {
    title: 'UP',
    value: 1,
  },
  {
    title: 'DOWN',
    value: 0,
  },
]

const enabled = [
  {
    title: 'YES',
    value: true,
  },
  {
    title: 'NO',
    value: false,
  },
]

const devicetype = [
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
    <h3 class="title-header">Controller - Create</h3>

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
                  type="number"
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
                 
                  :items="enabled"
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
