<script setup>
    import axios from "axios"
    import { URL, token } from "@/helpers/token"
    import sampleImage from '@/assets/images/avatars/default.jpg';
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
    import DemoDialogForm from '@/views/apps/vms/list/DemoDialogForm.vue'
    import {encrypt} from "@/helpers/utils"
    
    const selectedRadio = ref('primary')

const colorsRadio = [
  'Yes',
  'No',
 
]
    const isDialogVisible = ref(false)
    const route = useRoute()
    const router = useRouter()
   
    const getimage = ref("")
   
    const isFormValid = ref(false)
    const refForm = ref()
    const pass_valid_from = ref('')
    const pass_valid_to = ref('')
    const visitor_no = ref("")
    const visitor_name = ref("")
    const organization_name = ref("")
    const card_issued = ref("")
    const access_locations = ref("")
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
    const display_image=ref(sampleImage)
    const accessLocations = ref()
    const departmentList = departmentlist()
    const nationalityList = nationalities()
    const locationList = location()

    const handleButtonClick = ()=>{
      
      const src = document.getElementById('textimg').value;

     
        
          axios
            .post(
              URL() + "/tools/remove_bg",
              {
                image_data: src
              },
              { headers: { Authorization: token() } }
            )
            .then((response) => {
              console.log("Background removal");
              console.log(response.data);
              const img = response.data.data;
            
              console.log('Remove background')
              console.log(img)
             
              var newimg = new Image();
              var newWidth = 300;
              var newHeight = 300;
               // Set the image source to the binary data
               newimg.src = img;

                  // Wait for the image to load
                  newimg.onload = function() {
                    // Create a canvas element
                    var canvas = document.createElement("canvas");

                    // Set canvas dimensions
                    canvas.width = newWidth;
                    canvas.height = newHeight;

                    // Draw the image onto the canvas with the desired dimensions
                    var context = canvas.getContext("2d");
                    context.drawImage(newimg, 0, 0, newWidth, newHeight);

                    // Get the resized image data from the canvas
                    var resizedImageData = canvas.toDataURL("image/png");

                    // Log or use the resized image data
                    console.log("Resized Image Data:", resizedImageData);
                    cam_photo.value = resizedImageData;
                    display_image.value=resizedImageData
                    document.getElementById('textimg').value=resizedImageData
                  };
             
            })
            .catch((error) => {
              console.log(error);
              // Background removal or other error
              // router.push({
              //   name: 'rfidpeople-employee-setup',
              //   query: { message_type: 'failed', message: 'Add Employee failed' }
              // });
          });
       
      
    }


    const onSubmit = () => {
       
       const src = document.getElementById('textimg').value
       //console.log('CROPPED IMAGE DATA'+src)
      
       refForm.value?.validate().then(({ valid }) => {
         if(valid){
          
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
                                   requestType: "create",
                                   vms_data: {
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
                                is_active: is_active.value == 'active'? 'active' : 'inactive',
                                card_number_uuid: card_number_uuid.value,
                                image_data: src,
                                nationality: nationality.value,
                              //  location: selectedLocation.value,
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
                        query: { message_type:'success',message: 'Visitor Added Successfully' }
                               })

                           })
                           .catch((error) => {
                               console.log(error);

                               router.push({
                                name: 'vms-registration-process',
                        query: { message_type:'failed',message: 'Add Visitor failed' }
                               })
                           })                    

                  
         
         
           }
       })
   }

  
  // Configure a few settings and attach camera
  function configure() {
        Webcam.set({
          width: 320,
			height: 240,
			image_format: 'jpeg',
			jpeg_quality: 100
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
            console.log('Cam Snapshot')
            console.log(data_uri)
            getimage.value = data_uri
            cam_photo.value = data_uri
            imageUrl.value = data_uri
            document.getElementById("livecam").style.display = "none";
            document.getElementById("croppeddiv").style.display = "block";
            
            Webcam.reset()
        });

      //   Webcam.snap(function(data_uri) {
      //       // Resize the image to 300x390 using an HTML canvas
      //       console.log(' Orginal image  cam:'+data_uri)
      //       var img = new Image();
      //       img.src = data_uri;
      //       img.onload = function() {
      //           var canvas = document.createElement('canvas');
      //           canvas.width = 400;
      //           canvas.height = 400;
      //           var ctx = canvas.getContext('2d');
      //           ctx.drawImage(img, 0, 0, 300, 390);

      //           // Convert the resized image to base64
      //           var resizedDataUri = canvas.toDataURL('image/png');
      //           // resizedDataUri now contains the base64 encoded image data
      //           console.log(resizedDataUri);
      // // console.log(data_uri)
      //           getimage.value = resizedDataUri
      //           cam_photo.value = resizedDataUri
      //           imageUrl.value = resizedDataUri
      //           document.getElementById("livecam").style.display = "none";
      //           document.getElementById("croppeddiv").style.display = "block";
                
      //           Webcam.reset()
       
      //           // You can use the resizedDataUri as needed (e.g., send it to a server, display it on the page, etc.)
      //       };
        //});
        Webcam.reset()

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
    if(hexd.length>4){

    
    const chunkSize = 3;
    const subarrays = divideArray(hexd, chunkSize);
    console.log(subarrays[0]);
    var newarray =subarrays[0].reverse()
    
    var dec=hexToDecimal(newarray[0]+newarray[1]+newarray[2]+'88')
    console.log('decimal:'+dec)
    card_number_uuid.value=dec
    }else{
      const chunkSize = 4;
    const subarrays = divideArray(hexd, chunkSize);
    console.log(subarrays[0]);
    var newarray =subarrays[0].reverse()
    
    var dec=hexToDecimal(newarray[0]+newarray[1]+newarray[2]+newarray[3])
    console.log('decimal:'+dec)
    card_number_uuid.value=dec
    }
    }


    const loadFile = (event) =>{
  const image = document.getElementById("output");
  image.src = URL.createObjectURL(event.target.files[0]);
};
</script>

<template>
  <VCard>
    <VCardText>
    <h3 class="title-header">{{$t('Visitor - Create')}}</h3>
    </VCardText>
    <VSpacer />
    <VCardText>
        <!-- ?? Form -->
        <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
        <VRow>
        <VCol cols="4">
              <div id="livecam" style="display:none;">  
              
                  <div id="my_camera"></div>
              <VCardText  class="bg-light-primary ml-10 mb-5" variant="text"> </VCardText>
              <VBtn color="info" variant="outlined" @Click="take_snapshot" class="me-3" style="margin-left:27% !important">Take Snapshot</VBtn>
              </div>

                  <div class="example" id="croppeddiv" style="display:none;">
                            <div id="fileimg">
                                <cropper ref="cropper" v-if="imageUrl" class="example-cropper" :src="imageUrl" />
                                  
                            </div>
                            <drop-zone v-model="image" :label="upload" @uploaded="newImagesUploaded" class="pb-15" />

                            <div class="button-wrapper" v-if="crop_button">
                                <!-- <input type="file"   @change="onFileChange" > -->
                                <VBtn class="button" id="crop_button" @click="cropImage(),handleButtonClick()">Crop Image</VBtn>
                            </div>

                        
                            <VTextField
                            v-model="croped_image"                  
                            type="hidden"
                            style="grid-template-areas:none !important;"
                           
                          />
                          <input type="hidden" id="textimg"  :value="cam_photo" />
                        </div>

                <v-card style="height:80%" id="final">
                 
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
  <img :src="display_image" id="output"  />
</div>     
     

                </v-card>
              </VCol>
              <VCol cols="7">
              <VCard flat>
        <VCardText>
         <VRow>
        <!-- <VCol cols="6"  class="think">
              <VTextField v-model="{{visitor_no}}" :rules="[requiredValidator]" label="Visitor Number" />
              </VCol> -->
             
              <VCol cols="6"  class="think">
              <VTextField v-model="visitor_name" :rules="[requiredValidator,alphaValidator,  regexValidator(visitor_name, '^.{1,25}$')]" label="Visitor Name" />
              </VCol>
              <VCol cols="6"  class="think">
              <VTextField v-model="organization_name" :rules="[requiredValidator,alphaValidator,  regexValidator(organization_name, '^.{1,25}$')]" label="Organization Name" />
              </VCol>
              <VCol cols="6">
              <VTextField v-model="mobile_number"  type="number" :rules="[requiredValidator, regexValidator(phone_number, '^.{1,10}$')]" label="Mobile Number" />
              </VCol>
             
              <VCol cols="3"  class="think" style="padding-top:20px">
              Card Issued
              </VCol>
              <VCol cols="3"  class="think" style="margin-left: -44px; ">
              <VRadioGroup
                  v-model="card_issued"
                  inline
                >
                  <div>
                    <VRadio
                      v-for="radio in colorsRadio"
                      :key="radio"
                      :label="radio"
                      :color="radio.toLocaleLowerCase()"
                      :value="radio.toLocaleLowerCase()"
                    />
                  </div>
                  </VRadioGroup>
              </VCol>
             
              
             
              <VCol cols="4">
              <VTextField v-model="carduid" readonly :rules="[requiredValidator]" label="Card UID"  />
              </VCol>
              <VCol cols="2">
              <DemoDialogForm  @value-updated="updateParentInput"  />
              </VCol>
              <VCol cols="6"  class="think">
              <VTextField v-model="card_number_uuid" :rules="[requiredValidator]" label="ID Card Number" />
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
              <VSelect v-model="nationality" label=" Nationality" :rules="[requiredValidator]" :items="nationalityList" />
              </VCol>
              <VCol cols="6">
              <VTextField v-model="host_name"  :rules="[requiredValidator]" label="Host Name" />
              </VCol>
             
              <VCol cols="6"  class="think">
              <VSelect v-model="host_department" label="Host Department" :rules="[requiredValidator]" :items="departmentList" />
              </VCol>
              
              <VCol cols="6"  class="think">
              <VAutocomplete v-model="accessLocations" label="Select Location" :rules="[requiredValidator]" :items="locationList"  chips multiple :menu-props="{ maxHeight: '100px' }"/>
              </VCol>
             
              <VCol cols="6"  class="think">
              <VTextField v-model="accessories" :rules="[requiredValidator]" label="Accessories" />
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
                 
                  :to="{ name: 'vms-registration-process' }"
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
  import axios from "axios"
    import { URL, token } from "@/helpers/token"

    export default {
        components: {
            Cropper,
        },
        data() {
        return {
            croped_image:null,
          //  display_image:sampleImage
            
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
                    // this.display_image=photo
                  //  this.handleButtonClick()
                  console.log('crop image')
                  console.log(photo)
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
    },

   

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
  /*width: 300px;
  height: 390px;*/
  box-shadow: 0 0 10px 0 rgba(255, 255, 255, 0.35);
  /* border-radius: 100px; */
  z-index: 0;
}
.profile-pic .-label {
  cursor: pointer;
  height: 390px;
  width: 400px; 
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
      width: 320px;
        height: 240px;
        border: 1px solid black;
    }
    .example-cropper {
        border: solid 1px #eee;
        min-height: 50px;
        width: 90%;
        height: 30vh;
        left: 17%;
        
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
    subject: VISITOR
  </route>

