<script setup>

import {URL, token} from '@/helpers/token'

import axios from '@axios'

const cctv=ref([])
const videodata=ref([])

console.log('template 2')
const fetchcctv = () => {
  axios
            .post(
              URL() + `/cctv`,
                {
                    requestType: "view",
                   
                },
                { headers: { Authorization: token() } }
            )
 
      .then((response) => {
       
       //   this.listings = response.data;       
       console.log(response.data.data);
              
               
              console.log('template 2')
                cctv.value = response.data.data;
                console.log(cctv)
                cctv.value.forEach((obj) => {
                    videodata.value.push(
                        {
                            url:"http://admin:mudunuru123@"+obj.ip_address+"/ISAPI/Streaming/channels/102/httpPreview",
                            device_name:obj.device_name
                        }
                    )
                });
        
      })
      .catch((error) => {
          console.log(error)
      })
      
      
     
}

watchEffect(fetchcctv)




const opencam = (ip) =>{
 // alert(ip)
   // window.open("http://admin:mudunuru123@"+ip+"/ISAPI/Streaming/channels/102/httpPreview",'_blank','directories=0,titlebar=0,toolbar=0,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350');
   window.open("http://admin:mudunuru123@"+ip+"/ISAPI/Streaming/channels/102/httpPreview",'_blank','directories=0,titlebar=0,toolbar=0,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350');
 
}

</script>
<template>
    <VCard>
        <VRow>
            <!-- ?? RFID For People -->
            <VCol cols="2" v-for="tag in videodata" class="widg" >
                <VCard>
                <VCardText >
                 {{tag.device_name}}
                 <video ref="videoPlayer" controls>
                <source :src="tag.url" type="video/mp4">
                Your browser does not support the video tag.
                </video>
            </VCardText >
                </VCard>
            </VCol>
        





        </VRow>


    </VCard>


</template>

