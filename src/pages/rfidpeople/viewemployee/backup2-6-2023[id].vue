<script setup>
import avatar1 from '@images/avatars/idcard-photo.png'
import axios from '@axios'
import { URL, token } from '@/helpers/token'
import VueQrcode from 'vue-qrcode'


const route = useRoute()
console.log("id")
console.log(route.params.id)
console.log(route.params.employee_id)
const EmpId = ref("")
const FirstName = ref("")
const LastName = ref("")
const Designation = ref("")
const Email = ref("")
const PhoneNumber=ref("")
const rowid = route.params.id
const AccessCard = ref("")
const nationality = ref('')
const blood_group=ref('')
const department = ref("")
const is_active = ref("")
const image_data=ref("")

const fetchEmployee = (id) => {

  axios.post(URL()+`/employee`,{
        
        'requestType':'view',
        'employee_id': id,
      
      }, { 'headers': { Authorization: token() } }) 
  
    .then((response) => {
      console.log(response.data.data);
      const emp = response.data.data;
      FirstName.value = emp.first_name 
      LastName.value =  emp.last_name
      EmpId.value = emp.employee_id
      Designation.value = emp.designation
      Email.value = emp.email
      PhoneNumber.value = emp.phone_number
      AccessCard.value = emp.access_card_no
      nationality.value = emp.nationality.nationality_name
      blood_group.value = emp.blood_group.blood_group_name
      department.value = emp.department.department_description
      is_active.value = emp.department.is_active
      image_data.value=emp.image_data

    })
    .catch((error) => {
      console.log(error)
    })
}

fetchEmployee(rowid)
</script>

<template>
  
    <!-- ?? Title -->
    <div class="d-flex align-center pa-6 pb-1">
      <h6 class="text-h6">
      View Employee
      </h6>
     
      <VSpacer />
    </div>

   
      <VCard flat>
        <VCardText>
        
          <VForm
            ref="refForm"
            v-model="isFormValid"
           
          >
          <VRow>
     
      <VCol
        cols="12"
        md="6"
      > <VTextField
                style="color:#020202"
               
                  v-model="EmpId"
                  :rules="[requiredValidator]"
                  label="Employee ID"
                  disabled
                />
              </VCol>

           <VCol
        cols="12"
        md="6"
      >
     
                  <VTextField
                style="color:#020202"
               
                  v-model="FirstName"
                  :rules="[requiredValidator]"
                  label="First Name"
                  disabled
                />
              </VCol>
             

             <VCol
        cols="12"
        md="6"
      >
                  <VTextField
                style="color:#020202"
                  v-model="LastName"
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
                style="color:#020202"
                  v-model="Designation"
                  label="Designation"
                  
                  disabled
                />
                </VCol>
                 <VCol
        cols="12"
        md="6"
      >
                <VTextField
                style="color:#020202"
                  v-model="Email"
                  label="Email"
                  :rules="[requiredValidator, emailValidator]"
                
                  disabled
                />
                </VCol>

                 <VCol
        cols="12"
        md="6"
      >
                  <VTextField
                style="color:#020202"
                  v-model="PhoneNumber"
                  :rules="[requiredValidator]"
                  label="Phone Number"
                  disabled

                />
              </VCol>
              <VCol
        cols="12"
        md="6"
      >
                  <VTextField
                style="color:#020202"
                  v-model="AccessCard"
                  :rules="[requiredValidator]"
                  label="Access Card Number"
                  disabled

                />
              </VCol>
             
              
               
               <VCol
        cols="12"
        md="6"
      >
                <VSelect
                style="color:#020202"
                  v-model="nationality"
                  label="Select Nationality"
                  :rules="[requiredValidator]"
                
                  disabled
                />
            
              </VCol>
               <VCol
        cols="12"
        md="6"
      >
               
               <VSelect
               style="color:#020202"
                 v-model="blood_group"
                 label="Select Blood Group"
                 :rules="[requiredValidator]"
               
                 disabled
               />
             </VCol>
            
               <VCol
        cols="12"
        md="6"
      >
               
                <VSelect
                style="color:#020202"
                  v-model="department"
                  label="Select Department"
                  :rules="[requiredValidator]"
                  
                  disabled
                />
              </VCol>
             
               <VCol
        cols="12"
        md="6"
      >
               
                <VSelect
                style="color:#020202"
                  v-model="is_active"
                  label="Status"
                  :rules="[requiredValidator]"
                 
                  disabled
                />
              </VCol>
              <VCol
        cols="12"
        md="6"
      >
          
      <img :src="image_data" alt="Dynamic Image" style="width: 78px; height: 58px;"/>
              </VCol>
             
            </VRow>
         
          </VForm>
        </VCardText>
      </VCard>
 
  
</template>
