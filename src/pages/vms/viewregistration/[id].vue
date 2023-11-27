<script setup>
    import axios from "axios";
    import { URL, token } from "@/helpers/token";
    import { location, departmentlist, nationalities, bloodgroups, shifttypes, shifts } from "@/helpers/helper";
    import { emailValidator, requiredValidator } from "@validators";
    import { Cropper } from "vue-advanced-cropper";
    import "vue-advanced-cropper/dist/style.css";
    import moment from "moment" 
    const route = useRoute()
    const router = useRouter()
    const rowid = route.params.id
    const getimage = ref("")
   
    const isFormValid = ref(false)
    const refForm = ref()
    const pass_valid_from = ref('')
    const pass_valid_to = ref('')
    const visitor_no = ref("")
    const visitor_name = ref("")
    const organization_name = ref("")
    const card_issued = ref("")
    const mobile_number = ref("")
     const is_active = ref("")
    const host_name = ref("")
     const accessories = ref("")
     const nationality = ref()
     const access_locations = ref()
     const card_number_uuid=ref("  ")
   const host_department = ref()
   
     const cam_photo = ref("")
    
     const image_data = ref("")
    // const imageUrl = ref("")
    // const crop_button = ref(false)

    // const selectedLocation = ref()
    // const departmentList = departmentlist()
     const nationalityList = nationalities()
    // const locationList = location()

    

    const fetchEmployee = (id) => {

axios.post(URL()+`/vms`,{
      
      'requestType':'view',
      'id': id,
     
    
    }, { 'headers': { Authorization: token() } }) 

  .then((response) => {

    //   this.listings = response.data;       
    console.log(response.data.data);
    const emp = response.data.data;
   //accessLocations_ids.value=[]
   access_locations.value = ''
  if( emp.access_locations){
    emp.access_locations.forEach(item =>{
      if(item.location.location_description){
    console.log(item)
    access_locations.value +=' '+item.location.location_description+',';
  }
  })
 
}

    visitor_no.value = emp.visitor_no 
    visitor_name.value =  emp.visitor_name
    organization_name.value = emp.organization_name
    card_issued.value = emp.card_issued
    mobile_number.value = emp.mobile_number
    card_number_uuid.value = emp.card_number_uuid
  nationality.value = emp.nationality.inationality_name
  pass_valid_from.value = emp.pass_valid_from
  pass_valid_to.value = emp.pass_valid_to
  host_name.value = emp.host_name
  host_department.value = emp.host_department.department_description
  
  //
 
  accessories.value = emp.accessories
  // selectedLocation.value = emp.selectedLocation
  is_active.value = emp.is_active ? 'active' : 'inactive'
  image_data.value=emp.image_data
  cam_photo.value=emp.image_data
  croped_image.value=emp.image_data
  document.getElementById('img_type').innerHTML="web"
console.log(emp.access_locations.location.location_description)
console.log(emp.image_data)
console.log(emp.accessories)
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
    <h3 class="title-header">{{$t('Visitor - View')}}</h3>
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
                    {{visitor_name}} 
                  </VCol>
<!-- 
                  <VCol cols="12" class="think" style="text-align:center; color:rgb(47 39 116);line-height:0p; font-size:15px">
                      {{visitor_no}}
                </VCol>                     -->

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
            Visitor Number
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{visitor_no}}
              </VCol>

              <VCol cols="5">
              Visitor Name
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{visitor_name}}
              </VCol>

              <VCol cols="5">
              Organization
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{organization_name}}
              </VCol>

              <VCol cols="5">
              Card Issued
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{card_issued}}
              </VCol>

              <VCol cols="5">
              Phone Number
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{mobile_number}}
              </VCol>

              <VCol cols="5">
              Card UUID
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{card_number_uuid}}
              </VCol>

              <VCol cols="5">
              Pass Valid From
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
             
              {{moment(pass_valid_from , 'YYYY-MM-DD').format('YYYY-MM-DD')}}
              </VCol>

              <VCol cols="5">
              Pass Valid To
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              
              {{moment(pass_valid_to , 'YYYY-MM-DD').format('YYYY-MM-DD')}}
              </VCol>

              <VCol cols="5">
              Host Name
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{host_name}}
              </VCol>

              <VCol cols="5">
              Host Department
              </VCol>
              <VCol cols="1">
               :
               </VCol>
              <VCol cols="6"  class="think">
              {{host_department}}
              </VCol> 

              <VCol cols="5">
              Location Access
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{access_locations}}
              </VCol>

              <VCol cols="5">
              Accessories
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{accessories}}
              </VCol>

              <!-- <VCol cols="5">
              Nationality
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{nationality}}
              </VCol> -->


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

             
              

            
             
              
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
      <VCardText>
      <VBtn
                 
                 :to="{ name: 'vms-registration-process' }"
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
    subject: VISITOR
  </route>

