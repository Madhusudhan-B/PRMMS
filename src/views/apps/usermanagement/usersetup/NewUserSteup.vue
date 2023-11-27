<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import axios from 'axios';

import {departmentlist,rolelist} from '@/helpers/helper'
import {URL, token} from '@/helpers/token'
import { 
      emailValidator, 
      requiredValidator,
      lengthValidator,
      alphaValidator,
      regexValidator,
      betweenValidator
     } from "@validators"
import Azureconfig from '@/config/Azureconfig'

const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content')


const radioGroup = ref('role')

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
const name = ref('')

const LoginId=ref('')
const email = ref('')
const userDepartment = ref()
const accessDepartment = ref()
const phone_number = ref('')
const role=ref()
const photo = ref('')
const show=ref(true)
const department=departmentlist()
const roles=rolelist()
const show2 = ref(false)

console.log(roles)
// ?? drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
  nextTick(() => {
    refForm.value?.reset()
    refForm.value?.resetValidation()
  })
}

const  onFileChange = (event)=>{
                  
                    const file = event.target.files[0];
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                      photo.value= reader.result;
                    };
                  }

const onSubmit = () => {
  if(radioGroup.value=='role' && role.value ==''){
            alert(' Role is empty')
            return false
          }
 
  refForm.value?.validate().then(({ valid }) => {
    axios.defaults.xsrfCookieName = 'csrftoken';
      axios.defaults.xsrfHeaderName = 'X-CSRFToken';
    if (valid) {
      axios.post(URL()+'/user_management',{
        'requestType':'create',
        'userData':{
        login_name: LoginId.value,
        user_name: name.value,
        email: email.value,
        phone_number:phone_number.value,
        role:role.value,       
        image_data:photo.value ? photo.value: null,
        department: userDepartment.value,
        is_active:true,
        access_type:radioGroup.value, 
        },
        accessDepartments: accessDepartment.value,
      
      },{'headers': { Authorization: token()}, }).then((response) => {
        console.log(response.data.data);
        let data = response.data
         
        var msg = data.message.split(':')
        var uuid=msg[1].split('(')
        console.log(uuid[1])
        
        const url = Azureconfig.url.server_url+Azureconfig.url.create_queue
        axios.post(
              url,{
                userId:uuid[1]
              },
              
                { headers: { Authorization: token() } }
            )
            .then((response) => {
                  //   console.log('Check user status')
                    console.log(response.data);
                    let data = response.data
                    
                    // notificationlist.value=data
                    //props.notifications=data
                      })
                      .catch((error) => {
                          console.log(error)
                      
                        console.log(error.response)
                        
                        
                      })
        emit('userData', {
        status:'success',
        data:{
          id: 0,       
          login_name: LoginId.value,
        user_name: name.value,
        email: email.value,
        phone_number:phone_number.value,
        role:role.value,       
        image_data:photo.value,
        department: userDepartment.value,
        is_active:true,
        access_type:radioGroup.value, 
        },
        message:'User Successfully Created'      
      
      
      })
       
      })
      .catch((error) => {
          console.log(error)
          emit('userData', {
        status:'failed',
        data:{
          id: 0,       
        name: name.value,
        email: email.value,
        phone_number:phone_number.value,
        role:role.value,       
        photo:photo.value,
        department: userDepartment.value,
        },
        message:error
       
      
      
      })
      })
     
      
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

const showMessage = ()=>{
    // Display your desired message based on the selectedRadio value
    switch (radioGroup.value) {
      case 'role':
      show.value=true
       document.getElementById('roleid').style.display='block'
        break;
      case 'user':
      show.value=false
        break;
      // Add more cases for other radio button values
    }
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
    <h3 class="title-header">{{$t('User - Create')}}</h3>

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
                  v-model="LoginId"
                  :rules="[requiredValidator]"
                  label="AD LoginId"
                  type="email"
                />
              </VCol>
              <!-- ?? Full name -->
              <VCol cols="12">
                <VTextField
                  v-model="name"
                  :rules="[requiredValidator,alphaValidator,  regexValidator(name, '^.{1,25}$')]"
                  label="Name"
                />
              </VCol>

              <!-- ?? Email -->
              <VCol cols="12">
                <VTextField
                  v-model="email"
                  :rules="[requiredValidator]"
                  label="Email"
                  type="email"
                />
              </VCol>
             

               <!-- ?? Email -->
               <VCol cols="12">
                <VTextField
                  v-model="phone_number"
                  :rules="[requiredValidator, regexValidator(phone_number, '^.{1,10}$')]"
                  label="Phone Number"
                />
              </VCol>
              <VCol cols="12">
                <VFileInput
                  :rules="rules"
                  label="Select File"
                  accept="image/png, image/jpeg, image/bmp"
                  placeholder="Select File"
                  prepend-icon="tabler-camera"
                  @change="onFileChange"
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
                  v-model="userDepartment"
                  label="User Department"
                  :rules="[requiredValidator]"
                  :items="department"
                  :menu-props="{ maxHeight: '150px' }"
                />
              </VCol>

              <VCol cols="12">Access Type</VCol>
             
              <VCol cols="12">

                <VRadioGroup
                      v-model="radioGroup"
                      inline
                      @change="showMessage"
                    >
                      <VRadio
                        label="Role"
                        value="role"
                        density="compact"
                      />
                      <VRadio
                        label="User"
                        value="user"
                        density="compact"
                      />
                    </VRadioGroup>


             

              </VCol>

                
              <VCol cols="12" id="roleid" v-show="show">
           

                  <VSelect
                    v-model="role"
                    label="Role"
                    :rules="[requiredValidator]"
                    :items="roles"
                  />
         </VCol>

         <VCol cols="12">
              <!--VSelect
                  v-model="accessDepartment"
                  label="Access Department"
                  :rules="[requiredValidator]"
                  :items="department"
                  multiple
                  :menu-props="{ maxHeight: '100px' }"
                /-->

                <VAutocomplete
                v-model="accessDepartment"
          :items="department"
          chips
          multiple
          label="Access department"
          :rules="[requiredValidator]"
          :menu-props="{ maxHeight: '100px' }"
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
