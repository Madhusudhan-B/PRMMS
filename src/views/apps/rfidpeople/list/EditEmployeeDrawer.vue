<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import axios from 'axios';

import {location,departmentlist,nationalities,bloodgroups,shifttypes, shifts} from '@/helpers/helper'
import {URL, token} from '@/helpers/token'




const departmentList=departmentlist()
 const bloodgroupList=bloodgroups()
 
 const nationalityList=nationalities()
 const shifttypeList=shifttypes()
 const shiftsList=shifts()
 const staffcategoryList=[
 {
      title: 'Permanent',
      value: '1',
    },
    {
      title: 'Contract',
      value: '2',
    },
    {
      title: 'Visitors',
      value: '3',
    },
   


 ]
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
   dataemployee: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'dataemployee',
  'employeeData'
])

const isFormValid = ref(false)
const refForm = ref()

  const controllerid=ref('')
  const locationList=location()
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
      axios.put(URL()+'/employee/'+props.dataemployee.id, {
        'Authorization': token() ,
        employee_id:props.dataemployee.employee_id,
         first_name: props.dataemployee.first_name,
         last_name: props.dataemployee.last_name,
         email:props.dataemployee.email,
         phone_number: props.dataemployee.phone_number,
         is_active: props.dataemployee.is_active,
         access_card_no: props.dataemployee.access_card_no,
         photo_path:null,
         blood_group: props.dataemployee.blood_group,
         nationality:props.dataemployee.nationality,
         location: props.dataemployee.selectedLocation,
         staff_category:props.dataemployee.staff_category,
         department:props.dataemployee.department,
         shift_type:props.dataemployee.shift_type,
         shift:[shift.value]
        
       
       
      },{'headers': { Authorization: token()}, })
      .then((response) => {
        console.log(response.data.data);
        let data = response.data.data
       
      })
      .catch((error) => {
          console.log(error)
      })

      emit('update:isDrawerOpen', false)
      emit('employeeData', {
        id: 0,       
        employee_id:props.dataemployee.employee_id,
         first_name: props.dataemployee.first_name,
         last_name: props.dataemployee.last_name,
         email:props.dataemployee.email,
         phone_number: props.dataemployee.phone_number,
         is_active: props.dataemployee.is_active,
         access_card_no: props.dataemployee.access_card_no,
         photo_path:null,
         blood_group: props.dataemployee.blood_group,
         nationality:props.dataemployee.nationality,
         location: props.dataemployee.selectedLocation,
         staff_category:props.dataemployee.staff_category,
         department:props.dataemployee.department,
         shift_type:props.dataemployee.shift_type,
         shift:[shift.value]
        
       
      
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
      Update Controller Setup
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
            @submit.prevent="onUpdate"
          >
          <VRow>
            <VCol cols="12" hidden>
               <VTextField 
                  v-model="props.dataemployee.id"
                  :rules="[requiredValidator]"                 
                  
                />
                </VCol>
              <!-- ?? Full name -->
              <VCol cols="12">
                <VTextField
                  v-model="props.dataemployee.employee_id"
                  :rules="[requiredValidator]"
                  label="Employee ID"
                />
              </VCol>

              <!-- ?? Email -->
              <VCol cols="12">
                <VTextField
                  v-model="props.dataemployee.first_name"
                  :rules="[requiredValidator]"
                  label="First Name"
                />
              </VCol>
             

              <!-- ?? company -->
              <VCol cols="12">
                <VTextField
                  v-model="props.dataemployee.last_name"
                  :rules="[requiredValidator]"
                  label="Last Name"
                />
              </VCol>


               <VCol cols="12">
              <VTextField
                  v-model="props.dataemployee.email"
                  label="Email"
                  :rules="[requiredValidator, emailValidator]"
                  type='email'
                />
                </VCol>

                <VCol cols="12">
                <VTextField
                  v-model="props.dataemployee.phone_number"
                  :rules="[requiredValidator]"
                  label="Phone Number"
                />
              </VCol>
             
              <VCol cols="12">
                <VTextField
                  v-model="props.dataemployee.access_card_no"
                  :rules="[requiredValidator]"
                  label="ID Card Number"
                />
              </VCol>
             
              <VCol cols="12">
                <VFileInput
                  :rules="rules"
                  label="Avatar"
                  accept="image/png, image/jpeg, image/bmp"
                  placeholder="Pick an avatar"
                  prepend-icon="tabler-camera"
                />
                <h3 style="text-align:center">OR</h3>
                <div id="my_camera"></div>
                <VTextField
                  v-model="cam_photo"
                  :rules="[requiredValidator]"
                  type="hidden"
                />
                <VBtn color="primary" @Click="configure" class="me-3"> Configure</VBtn>
                <VBtn  color="primary" @Click="take_snapshot" class="me-3">Take Snapshot</VBtn>
                <!--VBtn color="primary"  @Click="saveSnap" class="me-3">Save Snapshot</VBtn -->
	
                <div id="results"  ></div>
                          </VCol>
              
            
              <VCol cols="12">
                <VSelect
                    v-model="props.dataemployee.is_active"
                    label="Select One"
                    :rules="[requiredValidator]"
                    :items="['true', 'false']"
                  />
                </VCol>
                <VCol cols="12">
                  <VSelect
                    v-model="props.dataemployee.location"
                    label="Select Location"
                    :rules="[requiredValidator]"
                    :items="locationList"
                  />
            
              </VCol>
              <VCol cols="12">
                <VSelect
                  v-model="props.dataemployee.nationality"
                  label="Select Nationality"
                  :rules="[requiredValidator]"
                  :items="nationalityList"
                />
            
              </VCol>
              <VCol cols="12">
               
               <VSelect
                 v-model="props.dataemployee.blood_group"
                 label="Select Blood Group"
                 :rules="[requiredValidator]"
                 :items="bloodgroupList"
               />
             </VCol>
              
             
              <VCol cols="12">
             
                <VSelect
                  v-model="props.dataemployee.staff_category"
                  label="Select Staff Category"
                  :rules="[requiredValidator]"
                  :items="staffcategoryList"
                />
            
              </VCol>
             
              <VCol cols="12">
               
                <VSelect
                  v-model="props.dataemployee.department"
                  label="Select Department"
                  :rules="[requiredValidator]"
                  :items="departmentList"
                />
              </VCol>
             
              <VCol cols="12">
               

                <VSelect
                  v-model="props.dataemployee.shift_type"
                  label="Select Shift Type"
                  :rules="[requiredValidator]"
                  :items="shifttypeList"
                />
              </VCol>
             
              <VCol cols="12">
               
                <VSelect
                  v-model="props.dataemployee.shift"
                  label="Select Shift "
                  :rules="[requiredValidator]"
                  :items="shiftList"
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
              
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
