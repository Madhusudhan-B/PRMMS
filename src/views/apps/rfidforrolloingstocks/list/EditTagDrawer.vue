<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import axios from 'axios';

//import {location} from '@/helpers/helper'
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
  editData:{
    type:String,
    required:true,
  }
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'editData',
  'tagData'
])



const isFormValid = ref(false)
const refForm = ref()
const epc = ref('')
const tid = ref('')
const rs_type = ref('')
const rs_id = ref('')
const photo = ref('')
// const created_time = ref('')
// const created_by_user = ref('')
// const created_by_device = ref('')
 
const onUpdate = () => {
 
 refForm.value?.validate().then(({ valid }) => {
   if (valid) {
     axios.post(URL()+'/reader', {       
       
       'requestType':'update',
       
       tag_data: {
        id:props.editData.id,
                            epc: props.editData.epc,
                            tid: props.editData.tid,
                            rs_type: props.editData.rs_type,
                            rs_id: props.editData.rs_id,
                            photo: props.editData.photo,
                           }
       
     
       
      
     },{'headers': { Authorization: token()}, })
     
     .then((response) => {
       emit('tagData', {
             status:'success',
             data:{
               id:response.data.id,
               epc: props.editData.epc,
                            tid: props.editData.tid,
                            rs_type: props.editData.rs_type,
                            rs_id: props.editData.rs_id,
                            photo: props.editData.photo,

       epc: epc.value,
                            tid: tid.value,
                            rs_type: rs_type.value,
                            rs_id: rs_id.value,
                            photo: photo.value,
              
       
         },
         location: props.editData.location.location_short_code,
           message:'Tag Successfully Updated'     
         
         
         })
      
     })
     .catch((error) => {
         console.log(error)
         emit('tagData', {
               status:'failed',
               data:{
                 id:props.editData.id,
                 epc: props.editData.epc,
                            tid: props.editData.tid,
                            rs_type: props.editData.rs_type,
                            rs_id: props.editData.rs_id,
                            photo: props.editData.photo,
       
         },
         location: props.editData.location.location_short_code,
               message:error
             
               })
    //  nextTick(() => {
    //    refForm.value?.reset()
    //    refForm.value?.resetValidation()
    //  })
   })

     emit('update:isDrawerOpen', false)
     // emit('databloodgroup', {
     //   id: 0,       
     //   blood_group_name:props.databloodgroup.blood_group_name,
      
     
     // })
     // nextTick(() => {
     //   refForm.value?.reset()
     //   refForm.value?.resetValidation()
     // })
   }
 })
}



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
     
      <h3 class="title-header"> {{$t('Tag - Update')}}</h3>
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
           
          >
            <VRow>
              <!-- ?? Full name -->
              <VCol cols="12">
              
                      <VTextField
                      :model-value="props.editData.epc"
                      @update:model-value="handleDeviceNameValueUpdate"
                      counter="25"
                      label="EPC"
                      />

              </VCol>

              
               

                <VCol cols="12">
                    <VTextField
                    :model-value="props.editData.tid"
                    @update:model-value="handleIpAddressValueUpdate"
                    counter="25"
                    label="Tag ID"
                    />

                </VCol>

                <VCol cols="12">
                    <VTextField
                    :model-value="props.editData.rs_type"
                    @update:model-value="handlePortValueUpdate"
                    counter="25"
                    label="RS Type"
                    />

                </VCol>

                <VCol cols="12">
                    <VTextField
                    :model-value="props.editData.rs_id"
                    @update:model-value="handlePortValueUpdate"
                    counter="25"
                    label="RS ID"
                    />

                </VCol>

                <VCol cols="12">
                    <VTextField
                    :model-value="props.editData.photo"
                    @update:model-value="handlePortValueUpdate"
                    counter="25"
                    label="Photo"
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
                <!-- <VBtn
                  type="reset"
                  variant="tonal"
                  color="secondary"
                  @click="closeNavigationDrawer"
                >
                  Cancel
                </VBtn> -->
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
