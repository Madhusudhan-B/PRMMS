<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import axios from 'axios';

import {location,departmentlist,nationalities,bloodgroups,shifttypes, shifts,databyid} from '@/helpers/helper'
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
  dataemployee:{
    type:String,
    required:true,
  }
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'dataemployee',
])



const isFormValid = ref(false)
const refForm = ref()

const departmentList=departmentlist()
 //const bloodgroup=databyid('blood_group',props.dataemployee.blood_group)
 
 const nationalityList=nationalities()
 const shifttypeList=shifttypes()
 const shiftsList=shifts()
//console.log(bloodgroup)

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
 const id=props.dataemployee

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
  
    <!-- ?? Title -->
    <div class="d-flex align-center pa-6 pb-1">
      <h6 class="text-h6">
      View Employee
      </h6>

      <VSpacer />

     
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
      <!-- 👉 First Name -->
      <VCol
        cols="12"
        md="6"
      >
                <VTextField
                  v-model="props.dataemployee.employee_id"
                  :rules="[requiredValidator]"
                  label="Employee ID"
                  disabled
                />
              </VCol>

              <!-- ?? Email -->
               <VCol
        cols="12"
        md="6"
      >
                <VTextField
                  v-model="props.dataemployee.first_name"
                  :rules="[requiredValidator]"
                  label="First Name"
                  disabled
                />
              </VCol>
             

              <!-- ?? company -->
               <VCol
        cols="12"
        md="6"
      >
                <VTextField
                  v-model="props.dataemployee.last_name"
                  :rules="[requiredValidator]"
                  label="Last Name"
                  disabled
                />
              </VCol>


                <VCol
        cols="12"
        md="6"
      >
              <VTextField
                  v-model="props.dataemployee.email"
                  label="Email"
                  :rules="[requiredValidator, emailValidator]"
                  type='email'
                  disabled
                />
                </VCol>
                 <VCol
        cols="12"
        md="6"
      >
              <VTextField
                  v-model="props.dataemployee.access_card_no"
                  label="ID Card Number"
                  :rules="[requiredValidator, emailValidator]"
                
                  disabled
                />
                </VCol>

                 <VCol
        cols="12"
        md="6"
      >
                <VTextField
                  v-model="props.dataemployee.phone_number"
                  :rules="[requiredValidator]"
                  label="Phone Number"
                  disabled

                />
              </VCol>
             
              
               <VCol
        cols="12"
        md="6"
      >
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
              
            
               <VCol
        cols="12"
        md="6"
      >
                <VSelect
                    v-model="props.dataemployee.is_active"
                    label="Select One"
                    :rules="[requiredValidator]"
                    :items="['true', 'false']"
                    disabled
                  />
                </VCol>
                 <VCol
        cols="12"
        md="6"
      >
                  <VSelect
                    v-model="props.dataemployee.location"
                    label="Select Location"
                    :rules="[requiredValidator]"
                    :items="locationList"
                    disabled
                  />
            
              </VCol>
               <VCol
        cols="12"
        md="6"
      >
                <VSelect
                  v-model="props.dataemployee.nationality"
                  label="Select Nationality"
                  :rules="[requiredValidator]"
                  :items="nationalityList"
                  disabled
                />
            
              </VCol>
               <VCol
        cols="12"
        md="6"
      >
               
               <VSelect
                 v-model="props.dataemployee.blood_group"
                 label="Select Blood Group"
                 :rules="[requiredValidator]"
                 :items="bloodgroupList"
                 disabled
               />
             </VCol>
              
             
               <VCol
        cols="12"
        md="6"
      >
             
                <VSelect
                  v-model="props.dataemployee.staff_category"
                  label="Select Staff Category"
                  :rules="[requiredValidator]"
                  :items="staffcategoryList"
                  disabled
                />
            
              </VCol>
             
               <VCol
        cols="12"
        md="6"
      >
               
                <VSelect
                  v-model="props.dataemployee.department"
                  label="Select Department"
                  :rules="[requiredValidator]"
                  :items="departmentList"
                  disabled
                />
              </VCol>
             
               <VCol
        cols="12"
        md="6"
      >
               

                <VSelect
                  v-model="props.dataemployee.shift_type"
                  label="Select Shift Type"
                  :rules="[requiredValidator]"
                  :items="shifttypeList"
                  disabled
                />
              </VCol>
             
               <VCol
        cols="12"
        md="6"
      >
               
                <VSelect
                  v-model="props.dataemployee.shift"
                  label="Select Shift "
                  :rules="[requiredValidator]"
                  :items="shiftList"
                  disabled
                />
              </VCol>
             
            </VRow>
           
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  
</template>
