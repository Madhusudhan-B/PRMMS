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
        console.log('Cam Snapshot')
        console.log(data_uri)
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
    <h3 class="title-header">Employee - View</h3>
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
            <VCol cols="6">
            <VTextField v-model="employee_id" :rules="[requiredValidator]" label="Employee ID" />
              </VCol>
             
              <VCol cols="6"  class="think">
              <VTextField v-model="first_name" :rules="[requiredValidator]" label="First Name" />
              </VCol>

              <VCol cols="6">
              <VTextField v-model="last_name" :rules="[requiredValidator]" label="Last Name" />
              </VCol>
             
              <VCol cols="6"  class="think">
              <VTextField v-model="email" label="Email" :rules="[requiredValidator, emailValidator]" type="email" />
              </VCol>

              <VCol cols="5">
              <VTextField v-model="phone_number"  type="number" :rules="[requiredValidator]" label="PhoneNumber" />
              </VCol>
             
              <VCol cols="6"  class="think">
              <VTextField v-model="designation" :rules="[requiredValidator]" label="Designation" />
              </VCol>

              <VCol cols="5">
              <VTextField v-model="carduid" readonly :rules="[requiredValidator]" label="Card UID"  />
              </VCol>
              <VCol cols="1">
              <DemoDialogForm  @value-updated="updateParentInput"  />
              </VCol>
              <VCol cols="6"  class="think">
              <VTextField v-model="access_card_no" :rules="[requiredValidator]" label="ID Card Number" />
              </VCol>

              <VCol cols="5">
              <VSelect v-model="is_active" label=" Status" :rules="[requiredValidator]" :items="statuslist" />
              </VCol>
              
              <VCol cols="6"  class="think">
              <VSelect v-model="nationality" label=" Nationality" :rules="[requiredValidator]" :items="nationalityList" />
              </VCol>

              <VCol cols="5">
              <VSelect v-model="blood_group" label=" Blood Group" :rules="[requiredValidator]" :items="bloodgroupList" />
              </VCol>
             
              <VCol cols="6"  class="think">
              <VSelect v-model="department" label=" Department" :rules="[requiredValidator]" :items="departmentList" />
              </VCol>

             

            
             
              
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
      <VCardText>
                <VBtn
                  type="submit"
                  class="me-3"
                  href="https://omp.mudunuru.com/rfidpeople/employee-setup"
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

