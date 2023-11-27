<script setup>
    import axios from "axios";
    import { URL, token } from "@/helpers/token";
    import { location, departmentlist, nationalities, bloodgroups, shifttypes, shifts } from "@/helpers/helper";
    import { emailValidator, requiredValidator } from "@validators";
    import { Cropper } from "vue-advanced-cropper";
    import "vue-advanced-cropper/dist/style.css";
    const route = useRoute()
    const router = useRouter()
    const rowid = route.params.id

    const getimage = ref("");

    const isFormValid = ref(false);
    const refForm = ref();
    const employee_id = ref("");
    const first_name = ref("");
    const last_name = ref("");
    const email = ref("");
    const phone_number = ref("");
    const is_active = ref("");
    const blood_group = ref("");
    const nationality = ref();
    const access_card_no = ref();
    // const staff_category = ref()
    const department = ref();
    const shift_type = ref();
    const shift = ref();
    const cam_photo = ref("");
    const designation = ref("");
    const image_data = ref("");
    const imageUrl = ref("");
    
    const crop_button = ref(false);

    const departmentList = departmentlist();
    const bloodgroupList = bloodgroups();

    const nationalityList = nationalities();

    

    const fetchEmployee = (id) => {

axios.post(URL()+`/employee`,{
      
      'requestType':'view',
      'employee_id': id,
     
    
    }, { 'headers': { Authorization: token() } }) 

  .then((response) => {

    //   this.listings = response.data;       
    console.log(response.data.data);
    const emp = response.data.data;

    first_name.value = emp.first_name 
    last_name.value =  emp.last_name
    employee_id.value = emp.employee_id
    
    
  designation.value = emp.designation
  email.value = emp.email
  phone_number.value = emp.phone_number
  access_card_no.value = emp.access_card_no
  nationality.value = emp.nationality.nationality_name
  blood_group.value = emp.blood_group.blood_group_name
  department.value = emp.department.department_description
  is_active.value = emp.department.is_active
  image_data.value=emp.image_data
  cam_photo.value=emp.image_data
  croped_image.value=emp.image_data
  document.getElementById('img_type').innerHTML="web"

  })
  .catch((error) => {
    console.log(error)
  })



}



fetchEmployee(rowid)


    
</script>

<template>
    <VCard>
        <VCardText>
            <h6 class="text-h6">
                Update Employee Setup
            </h6>
        </VCardText>
        <VSpacer />
        <VCardText>
            <!-- ?? Form -->
            <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
                <VRow>
                    <!-- 👉 First Name -->
                    <VCol cols="12" md="4">
                      Employded ID: {{employee_id}}
                    </VCol>

                    <!-- ?? Email -->
                    <VCol cols="12" md="4">
                       First Name: {{first_name}}
                                       </VCol>

                    <!-- ?? company -->
                    <VCol cols="12" md="4">
                      Last Name : {{last_name}}
                        </VCol>

                    <VCol cols="12" md="4">
                      Email: {{email}}
                    </VCol>

                    <VCol cols="12" md="4">
                      Phone Number : {{phone_number}}
                    </VCol>
                    <VCol cols="12" md="4">
                    Designation: {{designation}}
                    </VCol>
                    <VCol cols="12" md="4">
                      Access Card No. : {{access_card_no}}
                    </VCol>
                    <VCol cols="12" md="4">
                      Status: {{is_active? 'Active': 'Inactive'}}
                      </VCol>

                    <VCol cols="12" md="4">
                      Nationality:  {{nationality}}
                     </VCol>
                    <VCol cols="12" md="4">
                      Blood Group: {{blood_group}}
                     </VCol>

                    <VCol cols="12" md="4">
                      Department: {{department}}
                      </VCol>

                
                    <VCol cols="12" md="4">
                     
                        <div id="cropped_result">
                          <img :src="cam_photo" width="250" height="250" />
                        </div>
                    </VCol>

                    <!-- ?? Submit and Cancel -->
                    <VCol cols="12" md="6">
                       
                    </VCol>
                </VRow>
            </VForm>
        </VCardText>
    </VCard>
</template>

<route lang="yaml">
  meta:
    action: read
    subject: PEOPLE_EMPLOYEE
  </route>

