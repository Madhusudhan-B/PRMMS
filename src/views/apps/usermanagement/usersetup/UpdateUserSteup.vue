<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import axios from 'axios';

import {location,departmentlist,rolelist} from '@/helpers/helper'
import {URL, token} from '@/helpers/token'


import {
  emailValidator,
  requiredValidator,
} from '@validators'

// const rules = {
// required: (value) => !!value || 'Required.',
// min: (v) => v.length >= 8 || 'Min 8 characters',
// }
const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
   dataUser: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'dataUser',
  'userData',
])

const isFormValid = ref(false)
const refForm = ref()
const selectedDepartment=ref()
  const userid=ref('')
  const department=departmentlist()
  const accessdepartments=ref([])
// ?? drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
  // nextTick(() => {
  //   refForm.value?.reset()
  //   refForm.value?.resetValidation()
  // })
}


const role_id=ref('')
  const department_id=ref('')
  const photo=ref('')
  const access_department_ids=ref([])
  
  
    const show=ref(true)
  
  


const show2 = ref(false)

const  onFileChange = (event)=>{
                  
                  const file = event.target.files[0];
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = () => {
                    props.dataUser.image_data= reader.result;
                  };
                }
const onUpdate = () => {
 
 refForm.value?.validate().then(({ valid }) => {
  axios.defaults.xsrfCookieName = 'csrftoken';
      axios.defaults.xsrfHeaderName = 'X-CSRFToken';
   if (valid) {
     axios.post(URL()+'/user_management', {
       'requestType':'update',
       'userData':{
        id:props.dataUser.id,
        login_name: props.dataUser.login_name,
        user_name:props.dataUser.user_name,
        email: props.dataUser.email,
        phone_number: props.dataUser.phone_number,
        photo:props.dataUser.photo ? props.dataUser.photo : null,
         role:props.dataUser.rid, 
         image_data:props.dataUser.image_data,
        department: props.dataUser.department.id,
        is_active:true,
        access_type:props.dataUser.access_type,
       } ,
       accessDepartments: props.dataUser.access,
     },{'headers': { Authorization: token()}, })
     .then((response) => {
       console.log(response.data.data);
       let data = response.data.data
       emit('userData', {
       status:'success',
       data:{
        id: 0,       
          
        login_name: props.dataUser.login_name,
        user_name:props.dataUser.user_name,
        email: props.dataUser.email,
        phone_number: props.dataUser.phone_number,
        photo:props.dataUser.photo,
        role:role_id.value, 
         image_data:props.dataUser.image_data,
        department: props.dataUser.department.id,
        is_active:true,
        access_type:props.dataUser.access_type,
        accessDepartments: props.dataUser.access,
       },
     
       message:'User Successfully Updated'      
     
     
     })
      
     })
     .catch((error) => {
       console.log(error)
       
       emit('userData', {
     status:'failed',
     data:{
       id: 0,       
       login_name: props.dataUser.login_name,
        user_name:props.dataUser.user_name,
        email: props.dataUser.email,
        phone_number: props.dataUser.phone_number,
        photo:props.dataUser.photo,
         role:role_id.value, 
         image_data:props.dataUser.image_data,
        department: props.dataUser.department.id,
        is_active:true,
        access_type:props.dataUser.access_type,
        accessDepartments: props.dataUser.access,
       
     },
    
     message:error
    
   
   
   })
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

const roles=rolelist()

const showMessage = ()=>{

  if(props.dataUser.access_type=='role'){
    show.value=true
    role_id.value=props.dataUser.role.id
    document.getElementById('roleid').style.display='block'
  }


  access_department_ids.value=[]
  if(props.dataUser.access_departments){
  props.dataUser.access_departments.forEach(item =>{
    console.log(item)
    access_department_ids.value.push(item.department.id)
  })
 
}

    // Display your desired message based on the selectedRadio value
    switch (props.dataUser.access_type) {
      case 'role':
      show.value=true
      
       document.getElementById('roleid').style.display='block'
        break;
      case 'user':
      show.value=false
      document.getElementById('roleid').style.display='none'
        break;
      // Add more cases for other radio button values
    }
   
  }



  if(props.dataUser.role){
    show.value=true
    role_id.value=props.dataUser.role.id
    document.getElementById('roleid').style.display='block'
  }


  access_department_ids.value=[]
  if(props.dataUser.access_departments){
  props.dataUser.access_departments.forEach(item =>{
    console.log(item)
    access_department_ids.value.push(item.department.id)
  })
 
}

if(props.isDrawerOpen){
  showMessage()
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
    <h3 style="color: #2f2774;">{{$t('User - Update')}}</h3>

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
            @submit.prevent="onUpdate"
          >
            <VRow>
              <!-- ?? Full name -->
              <VCol cols="12" >
               <VTextField disabled 
                  v-model="props.dataUser.login_name"
                  :rules="[requiredValidator]" 
                  label="LoginID"                
                  
                />
                </VCol>
                <VCol cols="12">
                
                <VTextField
                  v-model="props.dataUser.user_name"
                  :rules="[requiredValidator]"
                  label="Name"
                  
                />
              </VCol>

              <!-- ?? Email -->
              <VCol cols="12">
                <VTextField
                  v-model="props.dataUser.email"
                  :rules="[requiredValidator]"
                  label="Email"
                 
                />
              </VCol>
             



               <VCol cols="12">
              <VTextField
                  v-model="props.dataUser.phone_number"
                  label="Phone Number"
                  :rules="[requiredValidator]"
                 
                />
              
              </VCol>

              <VCol cols="12">
              <VFileInput
                  :rules="rules"
                  label="Photo"
                  accept="image/png, image/jpeg, image/bmp"
                  placeholder="Pick an Photo"
                  prepend-icon="tabler-camera"
                  @change="onFileChange"
                />
                <img :src="props.dataUser.image_data" width="200" height="200" />
              </VCol>
             
              <VCol cols="12">
                <VSelect
                    v-model="props.dataUser.department.id"
                    label="User Department"
                    :rules="[requiredValidator]"
                    :items="department"
                    :menu-props="{ maxHeight: '150px' }"
                  />
                </VCol>
  
                <VCol cols="12">Access Type</VCol>
               
                <VCol cols="12">
  
                  <VRadioGroup
                        v-model="props.dataUser.access_type"
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
  
                  
                <VCol cols="12" id="roleid"  v-show="show">
                  <div v-if="props.dataUser.rid" >
                    <VSelect
                      v-model="props.dataUser.rid"
                      label="Role"
                    
                      :items="roles"
                    />
                  </div>
                  <div v-else>
                    <VSelect
                      v-model="props.dataUser.rid"
                      label="Role"
                     
                      :items="roles"
                    />
                  </div>

                   
                 
                </VCol>
                  
           <VCol cols="12" >
                      <VAutocomplete 
                          v-model="props.dataUser.access"
                    :items="department"
                    chips
                    multiple
                    label="Access Departments"

                    :menu-props="{ maxHeight: '100px' }"
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
               
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
