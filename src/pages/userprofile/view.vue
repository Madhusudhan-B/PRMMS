<script setup>
    import axios from "axios";
    import { URL, token } from "@/helpers/token";
    import { emailValidator, requiredValidator } from "@validators";
    import { Cropper } from "vue-advanced-cropper";
    import { serverURL } from "@/helpers/token"
    import "vue-advanced-cropper/dist/style.css";

    const route = useRoute()
const router = useRouter()
/********Error variables declaration start**********/
const isAlertVisible = ref(false);
    const isErrorAlertVisible = ref(false);
    const err = ref("");
    const message = ref("");

    if (router.currentRoute.value.query.message_type) {
        console.log("route redirect message");
        console.log(router.currentRoute.value.query.message);
        if (router.currentRoute.value.query.message_type === "success") {
            isAlertVisible.value = true;
            message.value = router.currentRoute.value.query.message;
        }
        if (router.currentRoute.value.query.message_type === "failed") {
            isErrorAlertVisible.value = true;
            err.value = router.currentRoute.value.query.message;
        }
    }

    /********Error variables declaration end**********/
  

    const data = JSON.parse(localStorage.getItem('userData') || 'null')
    console.log('userdata')
    console.log(data)

   
  const cam_photo = ref("");
  const id= data.id
  const loginName= data.loginName
  const fullName= data.loginName
  const username= data.username
  const department= data.department
  cam_photo.value= data.avatar
  const email= data.email
  const role= data.role
  const abilities=data.abilities
 
  
    const rowid =""

    const getimage = ref("");

    const isFormValid = ref(false);
    const refForm = ref();
  
   
    const image_data = ref("");
    const imageUrl = ref("");
    
    const crop_button = ref(false);

 

    const onSubmit = () => {
      const src = document.getElementById('textimg').value;
        console.log('CROPPED IMAGE DATA'+src);
        if(!src){
            alert('Cropped image use for printing')
        }
        refForm.value?.validate().then(({ valid }) => {
            if (valid) {
                axios
                    .post(
                        URL() + "/user_management",
                        {
                            requestType: "update",
                            userData: {
                                id:data.id,
                                image_data: src,
                           
                              
                            },
                        },
                        { headers: { Authorization: token() } }
                    )
                    .then((request, response) => {
                       
                        // Inside your component or method

                        const data = JSON.parse(localStorage.getItem('userData') || 'null')
                        const  userData = {
                            id: data.id,
                            loginName: data.loginName,
                            fullName: data.fullName,
                            username: data.username,
                            department: data.department,
                            avatar: document.getElementById('textimg').value,
                            email: data.email,
                            role: data.role,
                            abilities:data.abilites
                          
                          }
                          document.getElementById('profile_pic').src=document.getElementById('textimg').value

                       localStorage.setItem('userData', JSON.stringify(userData))
                          alert("Profile updated successfully")
                       window.location= serverURL() +'/dashboards/rfid-for-people'
                    })
                    .catch((error) => {
                        console.log(error);

                        // Inside your component or method
                        router.push({
                        name: 'userprofile-view',
                        query: { message_type:'failed',message: 'Profile Pic update failed' }
                        });
                    });
            }
        });
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

    
</script>

<template>

  <VCard>
    <VCardText style="">
   <!-- ?? Alert messages   -->
   <div class="alert-demo-v-model-wrapper">
            <VAlert v-model="isErrorAlertVisible" color="error" variant="tonal">
                {{err}}
            </VAlert>
            <VAlert v-model="isAlertVisible" color="success" variant="tonal">
                {{message}}
            </VAlert>
        </div>
        <!-- ?? Alert messages   -->
      </VCardText>
    <VCardText>
    <h3 class="title-header">{{$t('User Profile')}}</h3>
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
                            :rules="[requiredValidator]"
                          />
                          <input type="hidden" id="textimg"  :value="cam_photo" />
                        </div>

                <v-card style="height:90%" id="final">
                 
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
                <VBtn type="submit" class="me-3  ml-10 mt-5 mb-5">
                            Update
                        </VBtn>
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
           Login Id
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{loginName}}
              </VCol>
            <VCol cols="5">
          User Name
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{username}}
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

              <!--VCol cols="5">
              Phone Number
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{phone_number}}
              </VCol -->

            
              <VCol cols="5">
                Role
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{role}}
              </VCol>

             

              <VCol cols="5">
              Department
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{department.department_short_code}}
              </VCol>


            
             
              
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
              
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
      action: read
      subject: USER_PROFILE
    </route>
