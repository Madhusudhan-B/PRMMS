<script setup>
      import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
    import axios from 'axios';
    import {URL, token} from '@/helpers/token'
    import {location,departmentlist,nationalities,bloodgroups,shifttypes, shifts} from '@/helpers/helper'
    import {
      emailValidator,
      requiredValidator,
    } from '@validators'
      import { Cropper } from "vue-advanced-cropper";
      import "vue-advanced-cropper/dist/style.css";

    
    
</script>


<template>
<v-card width="auto">
      <div class="example">
      <div id="fileimg">
        <cropper ref="cropper" v-if="imageUrl" class="example-cropper" :src="imageUrl" />
      </div>
        <drop-zone
          v-model="image"
          :label="upload"        
          @uploaded="newImagesUploaded"
          class="pb-15"
        />
        <div id="web" >
        <cropper ref="webcropper" v-if="value" class="example-cropper" :src="value" />
        </div>
       
        <div id="img_type"></div>
        
        <div class="button-wrapper">
        <VFileInput
                  :rules="rules"
                  label="Select File"
                  accept="image/png, image/jpeg, image/bmp"
                  placeholder="Select File"
                  prepend-icon="tabler-camera"
                  @change="onFileChange"
                />
        <!-- <input type="file"   @change="onFileChange" > -->
          <span class="button" id="crop_button" @click="cropImage">Crop image</span>
        </div>
        <div id="cropped_result" ></div>

      </div>

      
    </v-card>
  </template>
    
  <script>
    export default {
      
      components: {
        Cropper
      },
      emits: ['imagedata'],
      props: ['websnaps','value'],
      data() {
        return {
          imageUrl:null,
          
            
        };
      },
 
      methods: {
            
    
                cropImage() {
                    
                     var result = '';     
                            
                    const image_type=document.getElementById('img_type').innerHTML;
                    console.log(image_type)
                    if(image_type=="fileimg"){
                       result = this.$refs.cropper.getResult();  
                    }
                    if(image_type=="web"){
                       result = this.$refs.webcropper.getResult();  
                    }
                    if(result){
                      document.getElementById('cropped_result').innerHTML = `<img src="${result.canvas.toDataURL(
                    "image/jpeg"
                  )}" style="height:135px" id="cropped_img"></img> `;
                 
                  this.$emit('imagedata', document.getElementById('cropped_result').innerHTML);
                    }
                  
                },
                onFileChange(event) {
                  document.getElementById('img_type').innerHTML="fileimg"
                    document.getElementById('web').style.display="none"
                    document.getElementById('fileimg').style.display="block"
                    const file = event.target.files[0];
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                      this.imageUrl = reader.result;
                    };
                  },

                  

                  

      }
      
    }
  
    </script>
    
    <style>
    .example-cropper {
      border: solid 1px #eee;
      min-height: 50px;
      width: 100%;
      height: 20vh;
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
    cursor:none !important;
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