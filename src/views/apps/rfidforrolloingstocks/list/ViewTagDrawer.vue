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
  getData:{
    type:String,
    required:true,
  }
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'getData',
])



const isFormValid = ref(false)
const refForm = ref()
const epc = ref('')
const tid = ref('')
const rs_type = ref('')
const rs_id = ref('')
const photo = ref('')
const created_time = ref('')
const created_by_user = ref('')
const created_by_device = ref('')
 
 

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


const fetchTagByID = () => {
  
  axios.get(URL()+`/tag/`+id, { 'headers': { 'Authorization': token() } })
      .then((response) => {
       
       //   this.listings = response.data;       
       console.log(response.data.data);
       data=response.data.data
       ip.value=data.ip_address
        
      })
      .catch((error) => {
          console.log(error)
      })
      
      
     
}


</script>

<template>
  <VNavigationDrawer
    temporary
    :width="400"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
   
  >
    <!-- ?? Title -->
    <div class="d-flex align-center pa-6 pb-1">
   
      <h3 class="title-header">{{$t('Tag - View')}}</h3>
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
      </VBtn>
    </div>

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- ?? Form -->
          <VForm
            ref="refForm"
            v-model="isFormValid"
           
          >
            <VRow>
              <!-- ?? Full name -->
             
               <VCol cols="12">
               RS Type: <b>{{props.getData.rolling_stock_type.rolling_stock_name}}</b>
              </VCol>
              
              <VCol cols="12">
               RS ID: <b>{{props.getData.rolling_stock_id }}</b>
              </VCol>
              <VCol cols="12">
               Photo: <img :src="props.getData.image_data" />
              </VCol>
              <VCol cols="12" v-if="props.getData.tags[0]">
              EPC ID 1: <b>{{props.getData.tags[0].epc }}</b>
              </VCol>

              <!-- ?? Email -->
              <VCol cols="12" v-if="props.getData.tags[0]">
              Tag ID 1: <b>{{props.getData.tags[0].tid}}</b>
              </VCol>

              <VCol cols="12" v-if="props.getData.tags[0]">
              Image: <img :src="props.getData.tags[0].image_data" />
              </VCol>

              <VCol cols="12" v-if="props.getData.tags[1]">
              EPC ID 1: <b>{{props.getData.tags[1].epc }}</b>
              </VCol>

              <!-- ?? Email -->
              <VCol cols="12" v-if="props.getData.tags[1]">
              Tag ID 1: <b>{{props.getData.tags[1].tid}}</b>
              </VCol>
              <VCol cols="12" v-if="props.getData.tags[1]">
              Image: <img :src="props.getData.tags[1].image_data"/>
              </VCol>
            
              <!-- ?? Submit and Cancel -->
             
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
