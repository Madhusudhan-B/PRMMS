<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import axios from 'axios';
import defaultimage from '@images/avatars/default.jpg'
import {departmentlist,rolelist} from '@/helpers/helper'
import {URL, token} from '@/helpers/token'
import Azureconfig from '../../../config/Azureconfig.js'

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'

const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content')


const radioGroup = ref('role')
// imemail {
//   emailValidator,
//   requiredValidator,
// } from '@validators'

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

photo.value=defaultimage
console.log(roles)
// ?? drawer close


const  onFileChange = (event)=>{
                  
                    const file = event.target.files[0];
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                      photo.value= reader.result;
                      
                    };
                  }

const resetform = () =>{
    refForm.value?.reset()
   refForm.value?.resetValidation()
}

const onSubmit = () => {
 
  refForm.value?.validate().then(({ valid }) => {
    // axios.defaults.xsrfCookieName = 'csrftoken';
    //   axios.defaults.xsrfHeaderName = 'X-CSRFToken';
    if (valid) {
      axios.post(URL()+'/user_management',{
        'requestType':'create',
        'userData':{
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
        accessDepartments: accessDepartment.value,
      
      },{'headers': { Authorization: token()}, }).then((response) => {
        console.log(response.data.data);
        let data = response.data.data

        var msg = data.message.split(':')
        uuid=msg[1].split('(')
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
    //     emit('userData', {
    //     status:'success',
    //     data:{
    //       id: 0,       
    //       login_name: LoginId.value,
    //     user_name: name.value,
    //     email: email.value,
    //     phone_number:phone_number.value,
    //     role:role.value,       
    //     image_data:photo.value,
    //     department: userDepartment.value,
    //     is_active:true,
    //     access_type:radioGroup.value, 
    //     },
    //     message:'User Successfully Created'      
      
      
    //   })

    router.push({
                        name: 'usermanagement-user-management',
                        query: { message_type:'success',message: 'User Added Successfully' }
                        })
       
      })
      .catch((error) => {
          console.log(error)
    //       emit('userData', {
    //     status:'failed',
    //     data:{
    //       id: 0,       
    //     name: name.value,
    //     email: email.value,
    //     phone_number:phone_number.value,
    //     role:role.value,       
    //     photo:photo.value,
    //     department: userDepartment.value,
    //     },
    //     message:error
       
      
      
    //   })

    router.push({
                        name: 'usermanagement-user-management',
                        query: { message_type:'failed',message: 'Add User failed' }
                        })
      })
     
      
      emit('update:isDrawerOpen', false)
    //   nextTick(() => {
    //     refForm.value?.reset()
    //     refForm.value?.resetValidation()
    //   })
    }
  })
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
  
   


   
      <VCard >
            <VCardText>
                <h3 class="title-header">User - Create</h3>
            </VCardText>
            <VSpacer />
        <VCardText>
          <!-- ?? Form -->
          <VForm
            ref="refForm"
            v-model="isFormValid"
            @submit.prevent="onSubmit"
          >
             <VRow>

                <VCol cols="5">
                <v-card>
                  <!-- Content for the first v-card -->
                  <VCol cols="12">
                  
                      <div id="" style="text-align: center;">
                        <img :src="photo" width="250" height="250" class="user"  />
                      </div>


                    
                        <VFileInput
                        :rules="rules"
                        label="Select File"
                        accept="image/png, image/jpeg, image/bmp"
                        placeholder="Select File"
                        prepend-icon="tabler-camera"
                        @change="onFileChange"
                        />
              
                  </VCol>


                  <!-- ?? Email -->
                  <VCol cols="12" class="think" style="text-align:center; font-style: italic; color:rgb(47 39 116);line-height:0px; font-size:25px">
                    {{first_name}}  {{last_name}}
                  </VCol>

                  <VCol cols="12" class="think" style="text-align:center; color:rgb(47 39 116);line-height:0p; font-size:15px">
                      {{designation}}
                </VCol>                    

                </v-card>
              </VCol>
              <VCol cols="7">
                <VRow>

               <!-- ?? Full name -->
               <VCol cols="12" md="6">
                <VTextField
                  v-model="LoginId"
                  :rules="[requiredValidator]"
                  label="AD LoginId"
                />
              </VCol>
              <!-- ?? Full name -->
              <VCol cols="12" md="6">
                <VTextField
                  v-model="name"
                  :rules="[requiredValidator]"
                  label="Name"
                />
              </VCol>

              <!-- ?? Email -->
              <VCol cols="12" md="6">
                <VTextField
                  v-model="email"
                  :rules="[requiredValidator]"
                  label="email"
                />
              </VCol>
             

               <!-- ?? Email -->
               <VCol cols="12" md="6">
                <VTextField
                  v-model="phone_number"
                  :rules="[requiredValidator]"
                  label="Phone number"
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
              

           
            

              <VCol cols="12" md="6">
              <VSelect
                  v-model="userDepartment"
                  label="User Department"
                  :rules="[requiredValidator]"
                  :items="department"
                />
              </VCol>

              <VCol cols="12" md="6">
              <VSelect
                  v-model="accessDepartment"
                  label="Access Department"
                  :rules="[requiredValidator]"
                  :items="department"
                  multiple
                />
              </VCol>
             
              <VCol cols="12" md="6">
                Access Type:
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

                
              <VCol cols="12" id="roleid" v-show="show" md="6">
           

                  <VSelect
                    v-model="role"
                    label="Role"
                  
                    :items="roles"
                  />
             </VCol>

        
            </VRow>

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
                  type="submit"
                  class="me-3"
                  href="https://omp.mudunuru.com/usermanagement/user-management"
                >
                 Back 
                </VBtn>
                
                <VBtn
                  type="submit"
                  class="me-3"
                  @click="resetform"
                >
                  Reset
                </VBtn>
                
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
   
</template>
<style>
.user {
  display: inline-block;
  width: 200px;
  height: 200px;
  border-radius: 50%;

  object-fit: cover;
}
</style>

<route lang="yaml">
  meta:
    action: create
    subject: UM_USERS
  </route>

