<script setup>
import {URL, token} from '@/helpers/token'

import axios from '@axios'
import RfidforPeople from '@/views/dashboards/rfidforpeople/RfidForPeople.vue'
import PerimeterMap from '@/views/dashboards/perimeter/PerimeterMap.vue'
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
                    // if(){
                        
                    // }
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


</script>
<template>
    <VCard>
        <VRow>
            <!-- ?? RFID For People -->
            <VCol cols="6">
<RfidforPeople />
            </VCol>
              <!-- ?? RFID For Rolling stock -->
              <VCol cols="6">
<PerimeterMap/>
              </VCol>
                 <!-- ??perimeter -->
                 <VCol cols="2" v-for="tag in videodata"   class="widg">
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
                  <!-- ?? cctv -->
                 




        </VRow>


    </VCard>

</template>

