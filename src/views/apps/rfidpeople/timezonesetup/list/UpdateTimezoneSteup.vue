<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import axios from 'axios';

import {location} from '@/helpers/helper'
import {URL, token} from '@/helpers/token'


// import {
//   emailValidator,
//   requiredValidator,
// } from '@validators'
const show2 = ref(false)
const rules = {
required: (value) => !!value || 'Required.',
min: (v) => v.length >= 8 || 'Min 8 characters',
}
const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
   dataTimezone: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'dataTimezone',
  'controllerData',
])

const isFormValid = ref(false)
const refForm = ref()
const ip = ref('')
const devicename = ref('')
const port = ref('')
const password = ref('')
 const user_id = ref('')
  const device_no = ref('')
  const controllerid=ref('')
  
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
      axios.put(URL()+'/controller/'+props.dataTimezone.id, {
        'Authorization': token() ,
        device_name:props.dataTimezone.device_name,
        ip_address: props.dataTimezone.ip_address,
        port: props.dataTimezone.port,
        device_no:props.dataTimezone.device_no,
        device_type:props.dataTimezone.device_type,
        location: props.dataTimezone.location,
        device_enabled:props.dataTimezone.device_enabled,
        password:props.dataTimezone.password,
      
        
       
      },{'headers': { Authorization: token()}, })
      .then((response) => {
        console.log(response.data.data);
        let data = response.data.data
       
      })
      .catch((error) => {
          console.log(error)
      })

      emit('update:isDrawerOpen', false)
      emit('controllerData', {
        id: 0,       
        device_name:props.dataTimezone.device_name,
        ip_address: props.dataTimezone.ip_address,
        port: props.dataTimezone.port,
        device_no:props.dataTimezone.device_no,
        device_type:props.dataTimezone.device_type,
        device_status:props.dataTimezone.device_status,
        location: props.dataTimezone.location,
        password:props.dataTimezone.password,
      
      
      })
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


const devicetype =[
  {
    title: 'Standalone',
    value: 'Standalone',
  },
  {
    title: 'Two-Door',
    value: 'Two-Door',
  },
  {
    title: 'Three-Door',
    value: 'Three-Door',
  },
  
]

const status =[
  {
    title: 'UP',
    value: 'UP',
  },
  {
    title: 'DOWN',
    value: 'DOWN',
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
    <h3 class="title-header">Timezone - Update</h3>

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
                  v-model="props.dataTimezone.id"
                  :rules="[requiredValidator]"                 
                  
                />
                </VCol>
                <VCol cols="12">
                
                <VTextField
                  v-model="props.dataTimezone.ip_address"
                  :rules="[requiredValidator]"
                  label="IP"
                  
                />
              </VCol>

              <!-- ?? Email -->
              <VCol cols="12">
                <VTextField
                  v-model="props.dataTimezone.port"
                  :rules="[requiredValidator]"
                  label="Port"
                 
                />
              </VCol>
             



               <VCol cols="12">
              <VTextField
                  v-model="props.dataTimezone.device_name"
                  label="Device Name"
                  :rules="[requiredValidator]"
                 
                />
              
              </VCol>

              <VCol cols="12">
                <VTextField
                    v-model="props.dataTimezone.password"
                    :append-inner-icon="show2 ? 'tabler-eye' : 'tabler-eye-off'"
                    :rules="[rules.required, rules.min]"
                    :type="show2 ? 'text' : 'password'"
                    name="input-10-2"
                    label="Password"
                    hint="At least 8 characters"
                    @click:append-inner="show2 = !show2"
                  />
            
              </VCol>
             
            
            
             
              <VCol cols="12">
              

                <VSelect
                  v-model="props.dataTimezone.device_type"
                  label="Device Type"
                  :rules="[requiredValidator]"
                  :items="devicetype"
                />
              </VCol>
              <VCol cols="12">
              <VSelect
                  v-model="props.dataTimezone.location"
                  label="Select Location"
                  :rules="[requiredValidator]"
                  :items="locationList"
                />
              </VCol>
           

              <VCol cols="12">
              <VSelect
                  v-model="props.dataTimezone.device_enabled"
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
                  Update
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
