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
  dataReader: {
    type: String,
    required: true,
  },
 
})

const emit = defineEmits([
  'update:isDrawerOpen',
 
  'dataReader',
])

const isFormValid = ref(false)
const refForm = ref()
const host_name = ref('')
const port = ref('')
const serial_number = ref('')
 const description = ref('')
 const selectedlocation = ref('')
 const locationList=location()
 //const session = ref()
// const plan = ref()
// const status = ref()

// ?? drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
  // nextTick(() => {
  //   refForm.value?.reset()
  //   refForm.value?.resetValidation()
  // })
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
      <h3 class="title-header"> {{$t('Reader - View')}}</h3>

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
            <VCol cols="5">
              Host Name
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{props.dataReader.host_name}}
              </VCol>
              
              <VCol cols="5">
              Description
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{props.dataReader.description}}
              </VCol>

              <VCol cols="5">
             IP Adress
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{props.dataReader.ip_address}}
              </VCol>
              
              <VCol cols="5">
              Port
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{props.dataReader.port}}
              </VCol>


              <VCol cols="5">
              Reader Name
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{props.dataReader.reader_name}}
              </VCol>
              <VCol cols="5">
              Serial Number
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{props.dataReader.serial_number}}
              </VCol>

              <VCol cols="5">
             location
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{props.dataReader.location.location_short_code}}
              </VCol>
            
              <VCol cols="12">
               
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
