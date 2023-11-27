<script setup>
  //import cropper from 'cropper.js'
  import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
  import axios from 'axios';
  import {URL, token} from '@/helpers/token'
  import {location,departmentlist,nationalities,bloodgroups,shifttypes, shifts} from '@/helpers/helper'
  import {
    emailValidator,
    requiredValidator,
  } from '@validators'
  import ImageCrop from '@/views/apps/rfidpeople/list/ImageCropperDialog.vue'

  const getimage=ref('')




  const rules = [
    (fileList) => !fileList || !fileList.length || fileList[0].size < 1000000 || 'Avatar size should be less than 1 MB!',
  ]


  const isFormValid = ref(false)
  const refForm = ref()
  const employee_id = ref('')
  const first_name = ref('')
  const last_name = ref('')
  const email = ref('')
  const phone_number = ref('')
  const is_active = ref('')
  const blood_group=ref('')
  const nationality = ref()
  const access_card_no = ref()
  const staff_category = ref()
  const department = ref()
  const shift_type = ref()
  const shift = ref()
  const cam_photo = ref('')
  const designation = ref('')
  const image_data = ref('')
  const selectedLocation = ref()
  const locationList=location()

  const departmentList=departmentlist()
  const bloodgroupList=bloodgroups()

  const nationalityList=nationalities()
  const shifttypeList=shifttypes()
  const shiftsList=shifts()
  console.log('shift list')
  console.log(shiftsList)
  
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


  const onSubmit = () => {
   
    const croppedImg = document.getElementById('cropped_img');
  const src = croppedImg.getAttribute('src');
  console.log(src);
    //uploadImage()
    refForm.value?.validate().then(({ valid }) => {
      if (valid) {
      
        axios.post(URL()+'/employee', {
          'Authorization': token(),
          employee_id:employee_id.value,
          first_name: first_name.value,
          last_name: last_name.value,
          email:email.value,
          phone_number: phone_number.value,
          designation: designation.value,
          is_active: is_active.value,
          access_card_no: access_card_no.value,
          image_data:src,
          blood_group: blood_group.value,
          nationality:nationality.value,
          location: selectedLocation.value,
          staff_category:staff_category.value,
          department:department.value,
          shift_type:shift_type.value,
          shift:shift.value   
        },{'headers': { Authorization: token()}, })

             
      }
    })
  }



  // Configure a few settings and attach camera
  function configure(){
    Webcam.set({
      width: 320,
      height: 240,
      image_format: 'jpeg',
      jpeg_quality: 90
    });
    Webcam.attach( '#my_camera' );
  }
  // A button for taking snaps


  // preload shutter audio clip
  var shutter = new Audio();
  shutter.autoplay = false;
  shutter.src = navigator.userAgent.match(/Firefox/) ? 'shutter.ogg' : 'shutter.mp3';

  const take_snapshot=()=>{
    // play sound effect
    shutter.play();
    document.getElementById('web').style.display="block"
    document.getElementById('fileimg').style.display="none"
    
    document.getElementById('img_type').innerHTML="web"
    // take snapshot and get image data
    Webcam.snap( function(data_uri) {
      // display results in page
      document.getElementById('results').innerHTML = 
        '<img id="imageprev" src="'+data_uri+'"/>';
        getimage.value=data_uri
        cam_photo.value=data_uri

    } );

    

    Webcam.reset();
  }

  const saveSnap = ()=>{
    // Get base64 value from <img id='imageprev'> source
    var base64image =  document.getElementById("imageprev").src;

      Webcam.upload( base64image, 'upload.php', function(code, text) {
        console.log('Save successfully');
        //console.log(text);
          });

  }

 

  
  
</script>

<template>
  
    <!-- ?? Title -->
    <div class="d-flex align-center pa-6 pb-1">
      <h6 class="text-h6">
      New Employee Setup
      </h6>
     

      
    </div>
 <VSpacer />
   
      <VCard flat>
        <VCardText>
          <!-- ?? Form -->
          <VForm
            ref="refForm"
            v-model="isFormValid"
            @submit.prevent="onSubmit"
          >
          <VRow>
                <!-- 👉 First Name -->
                <VCol
                  cols="12"
                  md="6"
                >
                <VTextField
                  v-model="employee_id"
                  :rules="[requiredValidator]"
                  label="Employee ID"
                />
              </VCol>

              <!-- ?? Email -->
               <VCol
                    cols="12"
                    md="6"
                  >
                <VTextField
                  v-model="first_name"
                  :rules="[requiredValidator]"
                  label="First Name"
                />
              </VCol>
             

              <!-- ?? company -->
               <VCol
                      cols="12"
                      md="6"
                    >
                <VTextField
                  v-model="last_name"
                  :rules="[requiredValidator]"
                  label="Last Name"
                />
              </VCol>


                <VCol
                      cols="12"
                      md="6"
                    >
              <VTextField
                  v-model="email"
                  label="Email"
                  :rules="[requiredValidator, emailValidator]"
                  type='email'
                />
                </VCol>

                 <VCol
                    cols="12"
                    md="6"
                  >
                <VTextField
                  v-model="phone_number"
                  :rules="[requiredValidator]"
                  label="Phone Number"
                />
              </VCol>
               <VCol
                    cols="12"
                    md="6"
                  >
                <VTextField
                  v-model="designation"
                  :rules="[requiredValidator]"
                  label="Designation"
                />
              </VCol>
               <VCol
                    cols="12"
                    md="6"
                  >
                <VTextField
                  v-model="access_card_no"
                  :rules="[requiredValidator]"
                  label="ID Card Number"
                />
              </VCol>  
             <VCol
                  cols="12"
                  md="6"
                >
              <VSelect
                  v-model="is_active"
                  label=" Status"
                  :rules="[requiredValidator]"
                  :items="['true', 'false']"
                />
              </VCol>
               <VCol
                      cols="12"
                      md="6"
                    >
                <VSelect
                  v-model="selectedLocation"
                  label=" Location"
                  :rules="[requiredValidator]"
                  :items="locationList"
                />
            
              </VCol>
             
               <VCol
                    cols="12"
                    md="6"
                  >
                <VSelect
                  v-model="nationality"
                  label=" Nationality"
                  :rules="[requiredValidator]"
                  :items="nationalityList"
                />
            
              </VCol>
               <VCol
                      cols="12"
                      md="6"
                    >
               
               <VSelect
                 v-model="blood_group"
                 label=" Blood Group"
                 :rules="[requiredValidator]"
                 :items="bloodgroupList"
               />
             </VCol>
              
             
               <VCol
                  cols="12"
                  md="6"
                >
             
                <VSelect
                  v-model="staff_category"
                  label=" Staff Category"
                  :rules="[requiredValidator]"
                  :items="staffcategoryList"
                />
            
              </VCol>
             
               <VCol
                    cols="12"
                    md="6"
                  >
               
                <VSelect
                  v-model="department"
                  label=" Department"
                  :rules="[requiredValidator]"
                  :items="departmentList"
                />
              </VCol>
             
               <VCol
                    cols="12"
                    md="6"
                >
               

                <VSelect
                  v-model="shift_type"
                  label=" Shift Type"
                  :rules="[requiredValidator]"
                  :items="shifttypeList"
                />
              </VCol>
             
                    <VCol
                    cols="12"
                    md="6"
                  >
               
                <VSelect
                  v-model="shift"
                  label=" Shift "
                  :rules="[requiredValidator]"
                  :items="shiftsList"
                />
              </VCol>
               
                   <VCol
                    cols="12"
                    md="6"
                  >

                <div id="my_camera"></div>
                <VTextField
                  v-model="cam_photo"                  
                  type="hidden"
                />
            
                <VBtn color="primary" @Click="configure" class="me-3"> Configure</VBtn>
                <VBtn  color="primary" @Click="take_snapshot" class="me-3" >Take Snapshot</VBtn> 
               
                <div id="results"></div>
              
            </VCol>
            <VCol
                  cols="12"
                  md="6"
                >

              <ImageCrop
              :value="cam_photo"
              
              @imagedata="addimage"
              />
              
              
            </VCol>
              <!-- ?? Submit and Cancel -->
               <VCol
                  cols="12"
                  md="6"
                >
                <VBtn
                  type="submit"
                  class="me-3"
                >
                  Submit
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
   
 
</template>
<script> 
//  Access Key: AKIA2IZ253G75HAYFLPT
// Secret Key: 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
export default {
  components: {
    ImageCrop
  },
  data() {
    return {
      crop_photo: ''
    };
  },
  methods:{
  addimage(imageData){

console.log('parent compenent retrieved data')
console.log(imageData)


}
 
}
}

</script>

