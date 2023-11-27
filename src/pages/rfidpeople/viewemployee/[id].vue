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
    const staff_id = ref("");
    const first_name = ref("");
    const last_name = ref("");
    const email = ref("");
    const phone_number = ref("");
    const is_active = ref(false);
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
    const croped_image = ref('');
    const crop_button = ref(false);

    const departmentList = departmentlist();
    const bloodgroupList = bloodgroups();

    const nationalityList = nationalities();

    

    const fetchEmployee = (id) => {

axios.post(URL()+`/employee`,{
      
      'requestType':'view',
      'staff_id': id,
     
    
    }, { 'headers': { Authorization: token() } }) 

  .then((response) => {

    //   this.listings = response.data;       
    console.log(response.data.data);
    const emp = response.data.data;

    first_name.value = emp.first_name 
    last_name.value =  emp.last_name
    staff_id.value = emp.staff_id
    
    
  designation.value = emp.designation
  email.value = emp.email
  phone_number.value = emp.phone_number
  access_card_no.value = emp.access_card_no
  nationality.value = emp.nationality.nationality_name
  blood_group.value = emp.blood_group.blood_group_name
  department.value = emp.department.department_description
  is_active.value = emp.is_active
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

const resolveUserStatusVariant = (stat) => {
       // if (stat === false) return "warning";
        if (stat === true) return "success"
        if (stat === false) return "secondary"

        return "primary"
    };
    
</script>

<template>
  <VCard>
    <VCardText>
    <h3 class="title-header">{{$t('Staff - View')}}</h3>
    </VCardText>
    <VSpacer />
    <VCardText>
        <!-- ?? Form -->
        <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
            <VRow>
              <VCol cols="5">
                <v-card>
                  <!-- Content for the first v-card -->
                  <VCol cols="12">
                  
                      <div id="cropped_result" style="text-align: center;">
                        <img :src="cam_photo" width="250" height="250" style="object-fit:contain" />
                      </div>
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
              <VCard flat>
        



<VCardText>
          <!-- ?? Form -->
          <VForm
            ref="refForm"
            v-model="isFormValid"
           
          >
            <VRow>
            <VCol cols="5">
            Staff ID
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
             {{staff_id}}
              </VCol>

              <VCol cols="5">
              Email
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{email}}
              </VCol>

              <VCol cols="5">
             Phone Number
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{phone_number}}
              </VCol>

              <VCol cols="5">
              Access Card No
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{access_card_no}}
              </VCol>

              <VCol cols="5">
              Status
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              <VChip label :color="resolveUserStatusVariant(is_active)" size="small" class="text-capitalize">
                                    {{ is_active ? 'Active' : 'Inactive'}}
                                    </VChip>
              </VCol>

              <VCol cols="5">
               Nationality
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{nationality}}
              </VCol>

              <VCol cols="5">
              Blood Group
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
             
              {{blood_group}}
              </VCol>

              <VCol cols="5">
              Department
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              
              {{department}}
              </VCol>
              
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
      <VCardText>
      <VBtn
                 
                 :to="{ name: 'rfidpeople-employee-setup' }"
                 color="secondary"
                
               >
               Back
               </VBtn>
                
              </VCardText>
              </VCol>

            </VRow>
        </VForm>
    </VCardText>
  </VCard>
</template>
<style>
  .think{
  font-weight: bold;
}
  </style>
<route lang="yaml">
  meta:
    action: read
    subject: PEOPLE_EMPLOYEE
  </route>

