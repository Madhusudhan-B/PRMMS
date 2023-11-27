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
    import DemoDialogForm from '@/views/apps/rfidpeople/list/DemoDialogForm.vue'
  
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
    const carduid=ref("  ")
    
    const crop_button = ref(false);

    const departmentList = departmentlist();
    const bloodgroupList = bloodgroups();

    const nationalityList = nationalities();

    const onSubmit = () => {
       
       const src = document.getElementById('textimg').value
       //console.log('CROPPED IMAGE DATA'+src)
      
       refForm.value?.validate().then(({ valid }) => {
         if(valid){
        
                       axios
                           .post(
                               URL() + "/employee",
                               {
                                requestType: "update",
                                emp_data: {
                               staff_id: staff_id.value,
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
                                department: department.value,
                               
                              
                            },
                         
                        },
                        { headers: { Authorization: token() } }
                           )
                           .then((request, response) => {
                               console.log(request.body);
                               // Inside your component or method
                              
                                router.push({
                         name: 'rfidpeople-employee-setup',
                        query: { message_type:'success',message: 'Employee Updated Successfully' }
                               })

                           })
                           .catch((error) => {
                               console.log(error);

                               // Inside your component or method
                               router.push({
                                name: 'rfidpeople-employee-setup',
                        query: { message_type:'failed',message: 'Employee update failed' }
                               })
                           })

                        

                
         
         
           }
       })
   }


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
  nationality.value = emp.nationality.id
  blood_group.value = emp.blood_group.id
  department.value = emp.department.id
  is_active.value = emp.is_active ? 'active' : 'inactive'
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
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif']
        crop_button.value = true;
        const file = event.target.files[0]
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
          this.error = 'Invalid file type. Allowed types: ' + this.allowedExtensions.join(', ');
          this.selectedFile = null;
          return false
        } 
        const reader = new FileReader()
        reader.readAsDataURL(file)
        alert('file upload.......')
        console.log('file uploading......')
        
        const img = new Image()
       
        reader.onload = (e) => {
          img.src =e.target.result        
       
          
          img.onload = () => {
                    var height = img.height;
                    var width = img.width;

                    // if (height > 100 || width > 100) {
                    //     alert("Height and Width must not exceed 100px.");
                    //     return false;
                    // }
                    // alert("Uploaded image has valid Height and Width.");
                    // return true;
                if (img.height > 192) {
                  const scaleFactor = 192 / img.height;
                  const canvas = document.createElement('canvas');
                  canvas.width = 256;
                  canvas.height = 192;
                  const ctx = canvas.getContext('2d');
                  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                 //console.log(canvas.toDataURL(file.type))
                  imageUrl.value = canvas.toDataURL(file.type)
                  cam_photo.value = imageUrl.value
                  console.log("uploaded images")
                  console.log(cam_photo.value)
                  document.getElementById("croppeddiv").style.display = "block";
                  document.getElementById("final").style.display = "none";
                  return true
                } else {
                  console.log(img.src)
                }
              };
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
    access_card_no.value=dec
    }else{
      const chunkSize = 4;
    const subarrays = divideArray(hexd, chunkSize);
    console.log(subarrays[0]);
    var newarray =subarrays[0].reverse()
    
    var dec=hexToDecimal(newarray[0]+newarray[1]+newarray[2]+newarray[3])
    console.log('decimal:'+dec)
    access_card_no.value=dec
    }
    }


    const loadFile = (event) =>{
  const image = document.getElementById("output");
  image.src = URL.createObjectURL(event.target.files[0]);
};

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
              // cam_photo.value = img;

              // document.getElementById('textimg').value=img
              cam_photo.value = img;
                   // display_image.value=img
                    document.getElementById('textimg').value=img

            
             
             
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


    
</script>

<template>
  <VCard>
    <VCardText>
    <h3 class="title-header">{{$t('Staff - Update')}}</h3>
    </VCardText>
    <VSpacer />
    <VCardText>
        <!-- ?? Form -->
        <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">
            <VRow>
              <VCol cols="4">
              <div id="livecam" style="display:none;"> 
                <div id="my_camera"></div> 
              <VCardText id="" class="bg-light-primary ml-10 mb-5" variant="text"> </VCardText>
              <VBtn color="info" variant="outlined" @Click="take_snapshot" class="me-3" style="margin-left:27% !important">Take Snapshot</VBtn>
              </div>

                  <div class="example" id="croppeddiv" style="display:none;">
                            <div id="fileimg">
                                <cropper ref="cropper" class="example-cropper" :src="imageUrl" />
                            </div>
                            <drop-zone v-model="image" :label="upload" @uploaded="newImagesUploaded" class="pb-15" />

                            <div class="button-wrapper" v-if="crop_button">
                                <!-- <input type="file"   @change="onFileChange" > -->
                                <VBtn class="button" id="crop_button" @click="cropImage(),handleButtonClick()">Crop image</VBtn>
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
  <img :src="display_image ? display_image : cam_photo" id="output" width="" />
</div>     
     

                </v-card>
              </VCol>
              <VCol cols="7">
              <VCard flat>
        <VCardText>
         
            <VRow>
            <VCol cols="6">
            <VTextField v-model="staff_id" :rules="[requiredValidator]" label="Staff ID" />
              </VCol>
             
              <VCol cols="6"  class="think">
              <VTextField v-model="first_name" :rules="[requiredValidator,  regexValidator(first_name, '^.{1,25}$')]" label="First Name" />
              </VCol>

              <VCol cols="6">
              <VTextField v-model="last_name" :rules="[requiredValidator, regexValidator(last_name, '^.{1,25}$')]" label="Last Name" />
              </VCol>
             
              <VCol cols="6"  class="think">
              <VTextField v-model="email" label="Email" :rules="[requiredValidator, emailValidator]" type="email" />
              </VCol>

              <VCol cols="6">
              <VTextField v-model="phone_number"  type="number" :rules="[requiredValidator, regexValidator(phone_number, '^.{1,10}$')]" label="PhoneNumber" />
              </VCol>
             
              <VCol cols="6"  class="think">
              <VTextField v-model="designation" :rules="[requiredValidator]" label="Designation" />
              </VCol>

              
              <VCol cols="4">
              <VTextField v-model="carduid" readonly  label="Card UID"  />
              </VCol>
              <VCol cols="2">
              <DemoDialogForm  @value-updated="updateParentInput"  />
              </VCol>
              <VCol cols="6"  class="think">
              <VTextField v-model="access_card_no" :rules="[requiredValidator]" label="ID Card Number" />
              </VCol>

              
              <VCol cols="6"  class="think">
              <VSelect v-model="nationality" label=" Nationality" :rules="[requiredValidator]" :items="nationalityList" />
              </VCol>

              <VCol cols="6">
              <VSelect v-model="blood_group" label=" Blood Group" :rules="[requiredValidator]" :items="bloodgroupList" />
              </VCol>
             
              <VCol cols="6"  class="think">
              <VSelect v-model="department" label=" Department" :rules="[requiredValidator]" :items="departmentList" />
              </VCol>

              <VCol cols="6">
              <VSelect v-model="is_active" label=" Status" :rules="[requiredValidator]" :items="statuslist" />
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
                <VCol cols="12" md="6">
                        <VBtn type="submit" class="me-3">
                            Update
                        </VBtn>
                        <VBtn
                 
                  :to="{ name: 'rfidpeople-employee-setup' }"
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
                  //  this.display_image=photo
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
        alert(img.height)
        console.log("file upload .....")
        reader.onload = () => {
          const img = new Image();
       
          img.src = event.target.result;
          img.onload = () => {
                if (img.height > 200) {
                  const scaleFactor = 200 / img.height;
                  const canvas = document.createElement('canvas');
                  canvas.width = img.width * scaleFactor;
                  canvas.height = 200;
                  const ctx = canvas.getContext('2d');
                  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                 console.log(canvas.toDataURL(file.type))
                } else {
                  console.log(img.src)
                }
              };
            // imageUrl.value = reader.result
            // cam_photo.value = reader.result
            // document.getElementById("croppeddiv").style.display = "block";
            // document.getElementById("final").style.display = "none";
      


            // imageUrl.value = reader.result
            // cam_photo.value = reader.result
            // document.getElementById("croppeddiv").style.display = "block";
            // document.getElementById("final").style.display = "none";
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
      action: update
      subject: PEOPLE_EMPLOYEE
    </route>
