<script setup>
    import axios from "axios"
    import { URL, token } from "@/helpers/token"
    import { location, departmentlist, nationalities, bloodgroups, shifttypes, shifts } from "@/helpers/helper"
    import { emailValidator, requiredValidator } from "@validators"
    import { Cropper } from "vue-advanced-cropper"
    import "vue-advanced-cropper/dist/style.css"
    import DemoDialogForm from '@/views/apps/rfidpeople/list/DemoDialogForm.vue'
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
            alert('Cropped image use for printing')
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
        document.getElementById("my_camera").style.backgroundColor = "none"

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
                    <!-- 👉 First Name -->
                    <VCol cols="12" md="6">
                        <VTextField v-model="employee_id" :rules="[requiredValidator]" label="Employee ID" />
                    </VCol>

                    <!-- ?? Email -->
                    <VCol cols="12" md="6">
                        <VTextField v-model="first_name" :rules="[requiredValidator]" label="First Name" />
                    </VCol>

                    <!-- ?? company -->
                    <VCol cols="12" md="6">
                        <VTextField v-model="last_name" :rules="[requiredValidator]" label="Last Name" />
                    </VCol>

                    <VCol cols="12" md="6">
                        <VTextField v-model="email" label="Email" :rules="[requiredValidator, emailValidator]" type="email" />
                    </VCol>

                    <VCol cols="12" md="6">
                    
                        <VTextField v-model="phone_number"  type="number" :rules="[requiredValidator]" label="PhoneNumber" />
                    </VCol>
                    <VCol cols="12" md="6">
                        <VTextField v-model="designation" :rules="[requiredValidator]" label="Designation" />
                    </VCol>
                    <VCol cols="12" md="4">
                        <VTextField v-model="carduid" readonly :rules="[requiredValidator]" label="Card UID"  />
                    </VCol>
                    <VCol
                        cols="12"
                        md="2"
                        >
                        <!-- 👉 Form -->
                       
                            <DemoDialogForm  @value-updated="updateParentInput"  />
                        
                        </VCol>
                        <VCol cols="12" md="4">
                            <VTextField v-model="access_card_no" :rules="[requiredValidator]" label="ID Card Number" />
                        </VCol>
                    <VCol cols="12" md="6">
                        <VSelect v-model="is_active" label=" Status" :rules="[requiredValidator]" :items="statuslist" />
                    </VCol>

                    <VCol cols="12" md="6">
                        <VSelect v-model="nationality" label=" Nationality" :rules="[requiredValidator]" :items="nationalityList" />
                    </VCol>
                    <VCol cols="12" md="6">
                        <VSelect v-model="blood_group" label=" Blood Group" :rules="[requiredValidator]" :items="bloodgroupList" />
                    </VCol>

                    <VCol cols="12" md="6">
                        <VSelect v-model="department" label=" Department" :rules="[requiredValidator]" :items="departmentList" />
                    </VCol>

                  

                    <VCol cols="12" md="5">
                        <VCardText id="my_camera" class="bg-light-primary ml-10 mb-5" variant="text"> </VCardText>

                       
                   
                        <VBtn color="primary" variant="outlined" @Click="configure" class="me-3"> Start</VBtn>
                        <VBtn color="info" variant="outlined" @Click="take_snapshot" class="me-3">Take Snapshot</VBtn>
                        <VBtn color="error" variant="outlined" @Click="close_cam" class="me-3"> Close</VBtn>

                        <!-- 👉 Divider    type="hidden"-->
                        <VDivider class="my-4" />
                        <!-- 👉 Divider -->
                        <VFileInput :rules="rules" label="Select File" accept="image/png, image/jpeg, image/bmp" placeholder="Select File" prepend-icon="tabler-camera" @change="onFileChange" />
                    </VCol>

                    <VCol cols="12" md="4">
                        <div class="example">
                            <div id="fileimg">
                                <cropper ref="cropper" v-if="imageUrl" class="example-cropper" :src="imageUrl" />
                            </div>
                            <drop-zone v-model="image" :label="upload" @uploaded="newImagesUploaded" class="pb-15" />

                            <div class="button-wrapper" v-if="crop_button">
                                <!-- <input type="file"   @change="onFileChange" > -->
                                <span class="button" id="crop_button" @click="cropImage">Crop image</span>
                            </div>

                            <div class="">* Image should be crop in order to printing Cards</div>
                            <VTextField
                            v-model="croped_image"                  
                            type="hidden"
                            style="grid-template-areas:none !important;"
                            :rules="[requiredValidator]"
                          />
                          <input type="hidden" id="textimg"  :value="cam_photo" />
                        </div>
                    </VCol>
                    <VCol cols="12" md="3">
                     
                        <div id="cropped_result"></div>
                    </VCol>

                    <!-- ?? Submit and Cancel -->
                    <VCol cols="12" md="6">
                        <VBtn type="submit" class="me-3">
                            Create
                        </VBtn>
                      
                    </VCol>
                </VRow>
            </VForm>
        </VCardText>
    </VCard>
</template>

<script>
    export default {
        components: {
            Cropper,
        },
        data() {
        return {
            croped_image:null,
          
            
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
                    document.getElementById("cropped_result").innerHTML = `<img src="${photo}" style="height:172px" id="cropped_img"></img> `;
                }
            },
        },
    };
</script>
<!-- CSS -->

<style>
    #crop_button {
        display: none;
    }
    #my_camera {
        width: 243px;
        height: 172px;
    }
    .example-cropper {
        border: solid 1px #eee;
        min-height: 50px;
        width: 70%;
        height: 45vh;
        
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
</style>

<route lang="yaml">
    meta:
      action: create
      subject: PEOPLE_EMPLOYEE
    </route>
