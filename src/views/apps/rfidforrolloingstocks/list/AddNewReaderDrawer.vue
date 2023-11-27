<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import axios from 'axios';
import {location} from '@/helpers/helper'
import {URL, token} from '@/helpers/token'


import {
  emailValidator,
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
  'userData',
])

const isFormValid = ref(false)
const refForm = ref()
const host_name = ref('')
const ip_address = ref('')
const reader_name = ref('')
const hardware_address = ref('')
const port = ref('')
const serial_number = ref('')
 const description = ref('')
 const selectedlocation = ref('')
 const locationList=location()
 const subsystem_id = ref(2)

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
      axios
            .post(
                URL() + `/devices/reader`,
                {    
                          requestType: "create",
                           reader_data: {
                                host_name: host_name.value,
                                port: port.value,
                                ip_address: ip_address.value,
                                reader_name: reader_name.value,
                                serial_number: serial_number.value,
                                description: description.value,
                                hardware_address: hardware_address.value,
                                location: selectedlocation.value,
                            },
                            subsystem_id: subsystem_id.value,
                           
                        },
                { headers: { Authorization: token() } }
            )
    .then((response) => {
       console.log(response.data);
       emit("userData", {
                            status: "success",
                            data: {
                              id: 0,
                              host_name: host_name.value,
                                port: port.value,
                                ip_address: ip_address.value,
                                reader_name: reader_name.value,
                                serial_number: serial_number.value,
                                description: description.value,
                                hardware_address: hardware_address.value,
                                location: selectedlocation.value,
                            },
                            subsystem_id: subsystem_id.value,
                            message: "Controller Successfully Created",
                        });
      
     })
     .catch((error) => {
      console.log(error);
                        emit("userData", {
                            status: "failed",
                            data: {
                                id: 0,
                                host_name: host_name.value,
                                port: port.value,
                                ip_address: ip_address.value,
                                reader_name: reader_name.value,
                                serial_number: serial_number.value,
                                description: description.value,
                                hardware_address: hardware_address.value,
                                location: selectedlocation.value,
                            },
                            subsystem_id: subsystem_id.value,
                            message: error,
                        });
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
  
    
      <h3 class="title-header"> {{$t('Reader - Create')}}</h3>
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
                  v-model="host_name"
                  :rules="[requiredValidator]"
                  label="Host Name"
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="description"
                  :rules="[requiredValidator]"
                  label="Description"
                />
              </VCol>
              
              <VCol cols="12">
                <VTextField
                  v-model="ip_address"
                  :rules="[requiredValidator]"
                  label="IP Address"
                />
              </VCol>


              <!-- ?? Email -->
              <VCol cols="12">
                <VTextField
                  v-model="port"
                  :rules="[requiredValidator]"
                  label="Port Number"
                />
              </VCol>
                <!-- ?? company -->
                <VCol cols="12">
                <VTextField
                  v-model="reader_name"
                  :rules="[requiredValidator]"
                  label="Reader Name"
                />
              </VCol>
               <!-- ?? company -->
               <VCol cols="12">
                <VTextField
                  v-model="hardware_address"
                  :rules="[requiredValidator]"
                  label="Hardware Address"
                />
              </VCol>
            

              <!-- ?? company -->
              <VCol cols="12">
                <VTextField
                  v-model="serial_number"
                  :rules="[requiredValidator]"
                  label="Serial Number"
                />
              </VCol>
            

              <VCol cols="12">
              <VSelect
                  v-model="selectedlocation"
                  label="Select Location"
                  :rules="[requiredValidator]"
                  :items="locationList"
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
