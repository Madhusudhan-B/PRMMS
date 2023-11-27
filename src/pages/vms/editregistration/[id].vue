<script setup>
    import axios from "axios";
    import { URL, token } from "@/helpers/token";
    import { location, departmentlist, nationalities, bloodgroups, shifttypes, shifts } from "@/helpers/helper";
    import { 
      emailValidator, 
      requiredValidator,
      lengthValidator,
      alphaValidator,
      regexValidator,
      betweenValidator
     } from "@validators"
    import { Cropper } from "vue-advanced-cropper";
    import "vue-advanced-cropper/dist/style.css";

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
    const accessLocations = ref([])
    const mobile_number = ref("")
    const is_active = ref("")
    const host_name = ref("")
    const host_department = ref("")
    const accessories = ref("")
    const nationality = ref()
    const card_number_uuid = ref()
    const carduid=ref("  ")
    const department = ref()
   
    const cam_photo = ref("")
    const designation = ref("")
    const image_data = ref("")
    const imageUrl = ref("")
    const crop_button = ref(false)

    const selectedLocation = ref()
    const departmentList = departmentlist()
    const nationalityList = nationalities()
    const locationList = location()
    const accessLocations_ids = ref([])
    const onSubmit = () => {
       
       const src = document.getElementById('textimg').value
       //console.log('CROPPED IMAGE DATA'+src)
      
       refForm.value?.validate().then(({ valid }) => {
         if(valid){
           axios
                   .post(
                       URL() + "/tools/remove_bg",
                       {
                        
                           image_data: src
                           
                       },
                       { headers: { Authorization: token() } }
                   )
                   .then(( response) => {
                       console.log("Background removal")
                       console.log(response.data);
                       const img=response.data.data
                       // Inside your component or method
                       // router.push({
                       // name: 'rfidpeople-employee-setup',
                       // query: { message_type:'success',message: 'Employee Added Successfully' }
                       // })
                       
                        // return false 
                       axios
                           .post(
                               URL() + "/vms",
                               {
                                requestType: "update",
                            vms_data: {
                              id:rowid,
                              visitor_no: visitor_no.value,
                              visitor_name: visitor_name.value,
                              organization_name: organization_name.value,
                              card_issued: card_issued.value,
                              mobile_number: mobile_number.value,
                              pass_valid_from: pass_valid_from.value,
                              pass_valid_to: pass_valid_to.value,
                              
                                host_name: host_name.value,
                                host_department:host_department.value,
                                accessories: accessories.value,
                                is_active: is_active.value == 'active'? true : false,
                                card_number_uuid: card_number_uuid.value,
                                image_data: img,
                                nationality: nationality.value,
                                location: selectedLocation.value,
                              //   department: department.value,
                               
                              
                            },
                            accessLocations:accessLocations.value,
                        },
                        { headers: { Authorization: token() } }
                           )
                           .then((request, response) => {
                               console.log(request.body);
                               // Inside your component or method
                              
                                router.push({
                          name: 'vms-registration-process',
                        query: { message_type:'success',message: 'Visitor Updated Successfully' }
                               })

                           })
                           .catch((error) => {
                               console.log(error);

                               // Inside your component or method
                               router.push({
                                name: 'vms-registration-process',
                        query: { message_type:'failed',message: 'Updated Visitor failed' }
                               })
                           })

                        

                   })
                   .catch((error) => {
                       console.log(error);

                       // Inside your component or method
                       router.push({
                        name: 'vms-registration-process',
                        query: { message_type:'failed',message: 'Add Visitor failed' }
                       })
                   })
         
         
           }
       })
   }

   
    const fetchEmployee = (id) => {

axios.post(URL()+`/vms`,{
      
      'requestType':'view',
      'id': id,
     
    
    }, { 'headers': { Authorization: token() } }) 

  .then((response) => {

    
    //   this.listings = response.data;       
    console.log(response.data.data);
    const emp = response.data.data;
    accessLocations_ids.value=[]
  if( emp.access_locations){
    
    emp.access_locations.forEach(item =>{
    console.log(item)
    accessLocations_ids.value.push(item.location.id  )
  })
 
}


    visitor_no.value = emp.visitor_no
    visitor_name.value =  emp.visitor_name
    organization_name.value = emp.organization_name
    
    
    nationality.value = emp.nationality.id
    mobile_number.value = emp.mobile_number
    card_issued.value = emp.card_issued
    
    pass_valid_from.value = emp.pass_valid_from
    pass_valid_to.value = emp.pass_valid_to
    host_name.value = emp.host_name
    accessLocations.value = accessLocations_ids.value
    host_department.value = emp.host_department.id
    accessories.value = emp.accessories
    // card_printed_time.value = emp.card_printed_time
    // created_by.value = emp.created_by
    // created_time.value = emp.id_card_number
    // id_card_number.value = emp.id_card_number
 console.log(accessLocations.value)
 
  is_active.value = emp.host_department.is_active ? 'active' : 'inactive'
  image_data.value=emp.image_data
  cam_photo.value=emp.image_data
  document.getElementById('textimg').src= emp.image_data
  croped_image.value=emp.image_data
  document.getElementById('img_type').innerHTML="web"

  })
  .catch((error) => {
    console.log(error)
  })



}



fetchEmployee(rowid)


   // Configure a few settings and attach camera
  function configure() {
        Webcam.set({
            width: 243,
            height: 172,
            image_format: "png",
            jpeg_quality: 90,
        });
        //document.getElementById("my_camera").style.backgroundColor = "none"
        document.getElementById("final").style.display = "none";
        document.getElementById("livecam").style.display = "block";
        
        Webcam.attach("#my_camera")
    }
    // A button for taking snaps

    // preload shutter audio clip
    var shutter = new Audio()
    shutter.autoplay = false
    shutter.src = navigator.userAgent.match(/Firefox/) ? "shutter.ogg" : "shutter.mp3"

    const take_snapshot = () => {
        // play sound effect
        //shutter.play();
        crop_button.value = true;
        // take snapshot and get image data
        Webcam.snap(function (data_uri) {
            // display results in page

            getimage.value = data_uri
            cam_photo.value = data_uri
            imageUrl.value = data_uri
            document.getElementById("livecam").style.display = "none";
            document.getElementById("croppeddiv").style.display = "block";
            
            Webcam.reset()
        });
    };

    const close_cam = () => {
        Webcam.reset()

        document.getElementById("my_camera").style.backgroundColor = "rgba(var(--v-theme-primary),var(--v-activated-opacity))"
    }

    const saveSnap = () => {
        // Get base64 value from <img id='imageprev'> source
        var base64image = document.getElementById("imageprev").src

        Webcam.upload(base64image, "upload.php", function (code, text) {
            console.log("Save successfully")
            //console.log(text);
        })
    }
    

    const onFileChange = (event) => {
        crop_button.value = true;
        const file = event.target.files[0]
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            imageUrl.value = reader.result
            cam_photo.value = reader.result
            document.getElementById("croppeddiv").style.display = "block";
            document.getElementById("final").style.display = "none";
        }
    }
    const statuslist=[{
                title: "Active",
                value: "active",
            },
            {
                title: "Inactive",
                value: "inactive",
            },
        ]
    
</script>

<template>
  <VCard>
    <VCardText>
    <h3 class="title-header">{{$t('Visitor - Update')}}</h3>
    </VCardText>
    <VSpacer />
    <VCardText>
        <!-- ?? Form -->
        <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
            <VRow>
              <VCol cols="4">
              <div id="livecam" style="display:none;">  
              <VCardText id="my_camera" class="bg-light-primary ml-10 mb-5" variant="text"> </VCardText>
              <VBtn color="info" variant="outlined" @Click="take_snapshot" class="me-3" style="margin-left:27% !important">Take Snapshot</VBtn>
              </div>

                  <div class="example" id="croppeddiv" style="display:none;">
                            <div id="fileimg">
                                <cropper ref="cropper" class="example-cropper" :src="imageUrl" />
                            </div>
                            <drop-zone v-model="image" :label="upload" @uploaded="newImagesUploaded" class="pb-15" />

                            <div class="button-wrapper" v-if="crop_button">
                                <!-- <input type="file"   @change="onFileChange" > -->
                                <VBtn class="button" id="crop_button" @click="cropImage">Crop image</VBtn>
                            </div>

                        
                            <VTextField
                            v-model="croped_image"                  
                            type="hidden"
                            style="grid-template-areas:none !important;"
                          
                          />
                          <input type="hidden" id="textimg"  :value="cam_photo" />
                        </div>

                <v-card style="height:80%; overflow:unset !important" id="final">
                 
                <div class="profile-pic" id="cropped_result">
                <label class="-label" for="file">
                  <span class="glyphicon glyphicon-camera"></span>
                  <!-- <span>Upload Profile</span> -->
                  <div class="dropdown">
                  <span class="dropdown-btn">Change Profile</span>
                  <div class="dropdown-content">
                    <a href="#"  @click="configure">Take Photo</a>
                    <!-- <a href="#" ><VFileInput :rules="rules" label="Upload File" variant="Plain" accept="image/png, image/jpeg, image/bmp"   @change="onFileChange" /></a> -->
                    <a href="#" >
                    <VFileInput  @change="onFileChange" ref="fileInput" style="display: none"/>
                    <span @click="handleFileUpload">Upload File</span>
                    </a>
      
                </div>
              </div>
  </label>
  <!-- Dropdown Button -->
 
  <!-- <input id="file" type="file"/> -->
  <img :src="display_image ? display_image : cam_photo" id="output" width="200" />
</div>     
     

                </v-card>
              </VCol>
              <VCol cols="7">
              <VCard flat>
        <VCardText>
         
        <VRow>
            <VCol cols="6">
            <VTextField v-model="visitor_no" :rules="[requiredValidator]" label="Visitor Number" />
              </VCol>
             
              <VCol cols="6"  class="think">
              <VTextField v-model="visitor_name" :rules="[requiredValidator,alphaValidator,  regexValidator(visitor_name, '^.{1,25}$')]" label="Visitor Name" />
              </VCol>

              <VCol cols="6">
              <VTextField v-model="organization_name" :rules="[requiredValidator,alphaValidator, regexValidator(organization_name, '^.{1,25}$')]" label="Organization Name" />
              </VCol>
             
              <VCol cols="6"  class="think">
              <VTextField v-model="card_issued" label="Card Issued" :rules="[requiredValidator]"  />
              </VCol>

              <VCol cols="6"  class="think">
              <VTextField v-model="mobile_number" label="Mobile Number" :rules="[requiredValidator]"  />
              </VCol>

              <VCol cols="6"  class="think">
              <VSelect v-model="nationality" label=" Nationality" :rules="[requiredValidator]" :items="nationalityList" />
              </VCol>

              <VCol cols="6">
              <AppDateTimePicker
                  v-model="pass_valid_from"
                  label="Pass Valid date"
                  :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' }"
                />
              </VCol>
             
              <VCol cols="6"  class="think">
              <AppDateTimePicker
                  v-model="pass_valid_to"
                  label="Pass Expiry date"
                  :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' }"
                />
              </VCol>
             
              <VCol cols="6"  class="think">
              <VTextField v-model="host_name" :rules="[requiredValidator, regexValidator(host_name, '^.{1,10}$')]" label="Host Name" />
              </VCol>

              
              <VCol cols="6"  class="think">
              <VSelect v-model="host_department" label="Host Department" :rules="[requiredValidator]" :items="departmentList" />
              </VCol>

              <VCol cols="6"  class="think">
              <VAutocomplete v-model="accessLocations_ids" label="Select Location" :rules="[requiredValidator]" :items="locationList"  chips multiple :menu-props="{ maxHeight: '100px' }"/>
              </VCol>
              
              <VCol cols="6"  class="think">
              <VTextField v-model="accessories" :rules="[requiredValidator]" label="Accessories" />
              </VCol>

              <VCol cols="6">
              <VSelect v-model="is_active" label=" Status" :rules="[requiredValidator]" :items="statuslist" />
              </VCol>
              
             
              <!-- <VCol cols="6"  class="think">
              <VSelect v-model="department" label=" Department" :rules="[requiredValidator]" :items="departmentList" />
              </VCol> -->

              <!-- <VCol cols="6">
              <VSelect v-model="is_active" label=" Status" :rules="[requiredValidator]" :items="statuslist" />
              </VCol> -->

              
            
             
              
            </VRow>
         
          
        </VCardText>
      </VCard>
      <VCardText>
                <!-- <VBtn
                  type="submit"
                  class="me-3"
                  href="https://omp.mudunuru.com/rfidpeople/employee-setup"
                >
                 Back 
                </VBtn> -->
                <VCol cols="12" md="6">
                        <VBtn type="submit" class="me-3">
                            Update
                        </VBtn>
                        <VBtn
                 
                  :to="{ name: 'vms-registration-process' }"
                  color="secondary"
                 
                >
                Back
                </VBtn>
                           
                      
                    </VCol>

              </VCardText>
              </VCol>

            </VRow>
        </VForm>
    </VCardText>
  </VCard>
</template>

<script>
import sampleImage from '@/assets/images/avatars/default.jpg';
    export default {
        components: {
            Cropper,
        },
        data() {
        return {
            croped_image:null,
            display_image:null
            
        };
      },

        methods: {
            cropImage() {
                var result = this.$refs.cropper.getResult();
              
                if (result) {
                    var photo = result.canvas.toDataURL("image/png")                    
                    
                    this.croped_image = photo
                    console.log(this.croped_image)
                    document.getElementById('textimg').value=photo
                    this.display_image=photo
                    document.getElementById("croppeddiv").style.display = "none";
                    document.getElementById("final").style.display = "block";
                  // document.getElementById("cropped_result").innerHTML = `<img src="${photo}" style="height:172px" id="cropped_img"></img> `;
                }
            },

            handleFileUpload() {
      this.$refs.fileInput.click(); // Programmatically click the file input
    },

    onFileChange(event) {
      crop_button.value = true;
        const file = event.target.files[0]
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            imageUrl.value = reader.result
            cam_photo.value = reader.result
            document.getElementById("croppeddiv").style.display = "block";
            document.getElementById("final").style.display = "none";
        }
    }
        },
    };
</script>
<!-- CSS -->

<style>
  .think{
  font-weight: bold;
}
.profile-pic {
  color: transparent;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: all 0.3s ease;
}
.profile-pic input {
  display: none;
}
.profile-pic img {
  position: absolute;
  object-fit: cover;
  width: 300px;
  height: 390px;
  box-shadow: 0 0 10px 0 rgba(255, 255, 255, 0.35);
  /* border-radius: 100px; */
  z-index: 0;
}
.profile-pic .-label {
  cursor: pointer;
  height: 300px;
  width: 390px;
}
.profile-pic:hover .-label {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 10000;
  color: #fafafa;
  transition: background-color 0.2s ease-in-out;
  /* border-radius: 100px; */
  margin-bottom: 0;
}
.profile-pic span {
  display: inline-flex;
  padding: 0.2em;
  height: 2em;
}


body a:hover {
  text-decoration: none;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  z-index: 1;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown:hover .dropdown-content {
  display: block;
}
.vue-handler-wrapper__draggable{
  display:none !important;
}

/* #crop_button {
        display: none;
    } */
    #my_camera {
        width: 243px;
        height: 172px;
    }
    .example-cropper {
        border: solid 1px #eee;
        min-height: 50px;
        width: 50%;
        height: 20vh;
        left:27%;
        
    }

    .button-wrapper {
        display: flex;
        justify-content: center;
        margin-top: 17px;
    }

    .button {
        color: white;
        font-size: 16px;
        padding: 10px 20px;
        background: #35b392;
        cursor: pointer;
        transition: background 0.5s;
        font-family: Open Sans, Arial;
        margin: 0 10px;
    }

    .button:hover {
        background: #38d890;
    }

    .button input {
        display: none;
    }

    .vue-handler-wrapper--west {
        cursor: none !important;
    }
    .vue-simple-handler {
        display: block;
        background: none !important;
        height: 0px !important;
        width: 0px !important;
    }
    .vue-line-wrapper--west {
        left: 0;
        cursor: none !important;
    }
    .vue-line-wrapper--east {
        left: 0;
        cursor: none !important;
    }
    .vue-line-wrapper--north {
        left: 0;
        cursor: none !important;
    }
    .vue-line-wrapper--south {
        left: 0;
        cursor: none !important;
    }
    .bg-light-primary {
    background-color: #ffffff !important;
}
  </style>
<route lang="yaml">
    meta:
      action: update
      subject: VISITOR
    </route>
