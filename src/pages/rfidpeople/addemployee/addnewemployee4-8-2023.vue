<script setup>
    import axios from "axios"
    import { URL, token } from "@/helpers/token"
    import { location, departmentlist, nationalities, bloodgroups, shifttypes, shifts } from "@/helpers/helper"
    import { 
      emailValidator, 
      requiredValidator,
      lengthValidator,
      alphaValidator,
      regexValidator,
      betweenValidator
     } from "@validators"
    import { Cropper } from "vue-advanced-cropper"
    import "vue-advanced-cropper/dist/style.css"
    import DemoDialogForm from '@/views/apps/rfidpeople/list/DemoDialogForm.vue'
    import {encrypt} from "@/helpers/utils"
    
    
    const route = useRoute()
    const router = useRouter()
   
    const getimage = ref("")
   
    const isFormValid = ref(false)
    const refForm = ref()
    const employee_id = ref("")
    const first_name = ref("")
    const last_name = ref("")
    const email = ref("")
    const phone_number = ref("")
    const is_active = ref("")
    const blood_group = ref("")
    const nationality = ref()
    const access_card_no = ref()
    const carduid=ref("  ")
    const department = ref()
    const shift_type = ref()
    const shift = ref()
    const cam_photo = ref("")
    const designation = ref("")
    const image_data = ref("")
    const imageUrl = ref("")
    const crop_button = ref(false)

    const departmentList = departmentlist()
    const bloodgroupList = bloodgroups()

    const nationalityList = nationalities()

    const onSubmit = () => {
       
        const src = document.getElementById('textimg').value
        console.log('CROPPED IMAGE DATA'+src)
        if(!src){
            //alert('Cropped image use for printing')
        }
        refForm.value?.validate().then(({ valid }) => {
            if (valid) {
           
                axios
                    .post(
                        URL() + "/employee",
                        {
                            requestType: "create",
                            emp_data: {
                                employee_id: employee_id.value,
                                first_name: first_name.value,
                                last_name: last_name.value,
                                email: email.value,
                                phone_number: phone_number.value,
                                designation: designation.value,
                                is_active: is_active.value == 'active'? true : false,
                                access_card_no: access_card_no.value,
                                image_data: src,
                                blood_group: blood_group.value,
                                nationality: nationality.value,
                                // location: selectedLocation.value,
                                // staff_category:staff_category.value,
                                department: department.value,
                                // shift_type:shift_type.value,
                                // shift:shift.value
                            },
                        },
                        { headers: { Authorization: token() } }
                    )
                    .then((request, response) => {
                        console.log(request.body);
                        // Inside your component or method
                        router.push({
                        name: 'rfidpeople-employee-setup',
                        query: { message_type:'success',message: 'Employee Added Successfully' }
                        })

                    })
                    .catch((error) => {
                        console.log(error);

                        // Inside your component or method
                        router.push({
                        name: 'rfidpeople-employee-setup',
                        query: { message_type:'failed',message: 'Add Employee failed' }
                        })
                    })
            }
        })
    }

  
  // Configure a few settings and attach camera
  function configure() {
        Webcam.set({
            width: 243,
            height: 172,
            image_format: "jpeg",
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

    const divideArray =(arr, chunkSize)=>{
        const subarrays = []
        for (let i = 0; i < arr.length; i += chunkSize) {
            subarrays.push(arr.slice(i, i + chunkSize))
        }
        return subarrays
    }
    
    const hexToDecimal = (hex) =>{
        return parseInt(hex,16)
    }

   const  updateParentInput = (value)=>{
    carduid.value = value
    var hexd=value.split(':')
    console.log(hexd)
    const chunkSize = 3;
    const subarrays = divideArray(hexd, chunkSize);
    console.log(subarrays[0]);
    var newarray =subarrays[0].reverse()
    
    var dec=hexToDecimal(newarray[0]+newarray[1]+newarray[2]+'7E')
    console.log('decimal:'+dec)
    access_card_no.value=dec
    }


    const loadFile = (event) =>{
  const image = document.getElementById("output");
  image.src = URL.createObjectURL(event.target.files[0]);
};

    
</script>

<template>
  <VCard>
    <VCardText>
    <h3 class="title-header">Employee - Create</h3>
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
                                <cropper ref="cropper" v-if="imageUrl" class="example-cropper" :src="imageUrl" />
                            </div>
                            <drop-zone v-model="image" :label="upload" @uploaded="newImagesUploaded" class="pb-15" />

                            <div class="button-wrapper" v-if="crop_button">
                                <!-- <input type="file"   @change="onFileChange" > -->
                                <VBtn class="button" id="crop_button" @click="cropImage">Crop Image</VBtn>
                            </div>

                        
                            <VTextField
                            v-model="croped_image"                  
                            type="hidden"
                            style="grid-template-areas:none !important;"
                           
                          />
                          <input type="hidden" id="textimg"  :value="cam_photo" />
                        </div>

                <v-card style="height:50%" id="final">
                 
                <div class="profile-pic" id="cropped_result">
                <label class="-label" for="file">
                  <span class="glyphicon glyphicon-camera"></span>
                  <!-- <span>Upload Profile</span> -->
                  <div class="dropdown">
                  <span class="dropdown-btn">Upload Profile</span>
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
  <img :src="display_image" id="output" width="200" />
</div>     
     

                </v-card>
              </VCol>
              <VCol cols="7">
              <VCard flat>
        <VCardText>
         
        <VRow>
        <VCol cols="6"  class="think">
        <VTextField v-model="employee_id" :rules="[requiredValidator]" label="Employee ID" />
              </VCol>
             
              <VCol cols="6"  class="think">
              <VTextField v-model="first_name" :rules="[requiredValidator]" label="First Name" />
              </VCol>
              <VCol cols="6"  class="think">
              <VTextField v-model="last_name" :rules="[requiredValidator]" label="Last Name" />
              </VCol>
             
              <VCol cols="6">
              <VTextField v-model="email" label="Email" :rules="[requiredValidator, emailValidator]" type="email" />
              </VCol>
             
              <VCol cols="6"  class="think">
              <VTextField v-model="phone_number"  type="number" :rules="[requiredValidator]" label="PhoneNumber" />
              </VCol>

              <VCol cols="6"  class="think">
              <VTextField v-model="designation" :rules="[requiredValidator]" label="Designation" />
              </VCol>
             
              <VCol cols="4">
              <VTextField v-model="carduid" readonly :rules="[requiredValidator]" label="Card UID"  />
              </VCol>
              <VCol cols="2">
              <DemoDialogForm  @value-updated="updateParentInput"  />
              </VCol>
              <VCol cols="6"  class="think">
              <VTextField v-model="access_card_no" :rules="[requiredValidator]" label="ID Card Number" />
              </VCol>

              <VCol cols="6">
              <VSelect v-model="blood_group" label=" Blood Group" :rules="[requiredValidator]" :items="bloodgroupList" />
              </VCol>
             
              <VCol cols="6"  class="think">
              <VSelect v-model="nationality" label=" Nationality" :rules="[requiredValidator]" :items="nationalityList" />
              </VCol>

              <VCol cols="6">
              <VSelect v-model="department" label=" Department" :rules="[requiredValidator]" :items="departmentList" />
              </VCol>
             
             
              <VCol cols="6">
              <VSelect v-model="is_active" label=" Status" :rules="[requiredValidator]" :items="statuslist" />
              </VCol>
              <VCol cols="6">
             
              </VCol>
              

              <VCol cols="12" md="6">
                        <VBtn type="submit" class="me-3">
                            Create
                        </VBtn>
                        <VBtn
                 
                  :to="{ name: 'rfidpeople-employee-setup' }"
                  color="secondary"
                 
                >
                Back
                </VBtn>
                           
                      
                    </VCol>
                            
              
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
            display_image:sampleImage
            
        };
      },

        methods: {
            cropImage() {
                var result = this.$refs.cropper.getResult();
              
                if (result) {
                    var photo = result.canvas.toDataURL("image/jpeg")                    
                    
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
  width: 165px;
  height: 165px;
  box-shadow: 0 0 10px 0 rgba(255, 255, 255, 0.35);
  /* border-radius: 100px; */
  z-index: 0;
}
.profile-pic .-label {
  cursor: pointer;
  height: 165px;
  width: 165px;
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
        left: 27%;
        
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
    action: read
    subject: PEOPLE_EMPLOYEE
  </route>

