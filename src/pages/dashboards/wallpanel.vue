<script setup>
import { useTheme } from 'vuetify'
import Template1 from '@/views/dashboards/wallpanel/template1.vue'
import Template2 from '@/views/dashboards/wallpanel/template2.vue'
import Template3 from '@/views/dashboards/wallpanel/template3.vue'
import Template4 from '@/views/dashboards/wallpanel/template4.vue'
import Template5 from '@/views/dashboards/wallpanel/template5.vue'
import image1 from '@images/pages/image1.jpg'
import image2 from '@images/pages/image2.jpg'
import image3 from '@images/pages/image3.jpg'
import image4 from '@images/pages/image4.jpg'
import image5 from '@images/pages/image5.jpg'
import {URL, token} from '@/helpers/token'
import axios from '@axios'

const divid=ref(0)
 const openFullscreen=(id)=>{
      var elem = document.getElementById(id);
      divid.value=id
      document.getElementById(id).style.display="block"  
      if (elem.requestFullscreen) {
        elem.style.background='#edeeee'
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
      }

      const closeButton = document.querySelector('.close-button');
    if (closeButton) {
        closeButton.style.display = 'none';
    }
    }
    
      const closeFullscreen=()=>{
        document.getElementById(divid.value).style.display="none" 
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
    }

    
    document.addEventListener("keyup", function (event) {
      console.log(event.key)
      if (event.key === "Escape") {
        
        document.getElementById(divid.value).style.display="none"  // Call the exitFullScreen function when "ESC" is pressed
      }
    });

    document.addEventListener("keydown", function (event) {
      console.log(event.key)
      if (event.key === "Escape") {
        document.getElementById(divid.value).style.display="none" 
        //closeFullscreen() // Call the exitFullScreen function when "ESC" is pressed
      }
    });
 
    // Event listener to exit fullscreen when the "esc" key is pressed
document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
		closeFullscreen()
      }
    });
</script>

<template>
   <section>
  <VRow >
    <!-- 👉 Earning Report Weekly Overview    -->

    <!-- 👉 Support -->
    <VCol
      cols="12"
      md="6"
      lg="4"
    >
      <VCard class="text-center">
        <VCardText class="d-flex flex-column justify-center align-center">
          <h6 class="text-h6">
            4 Maps
          </h6>
          </VCardText>
          <img
            max-width="505"
            :src="image5"
            style=" object-fit: contain !important; "
          />
        <VCardText>
          <p>
            Maps of all the four subsystems are displayed with the current status of the device. 
          </p>
        </VCardText>

        <VCardActions class="justify-center">
          <VBtn variant="elevated"  @click="openFullscreen('temp1')" class="fullview">
           View
          </VBtn>
        </VCardActions>
      </VCard>
    </VCol>
    <VCol
      cols="12"
      md="6"
      lg="4"
    >
      <VCard class="text-center">
        <VCardText class="d-flex flex-column justify-center align-center">
          <h6 class="text-h6">
           CCTV Grid
          </h6>
         

        
        </VCardText>
        <img
            max-width="505"
            :src="image4"
            style=" object-fit: contain !important; "
          />
        <VCardText>
          <p>
            The grid displays all the CCTV configured to be displayed. 
          </p>
        </VCardText>

        <VCardActions class="justify-center">
          <VBtn variant="elevated"  @click="openFullscreen('temp2')" class="fullview">
           View
          </VBtn>
        </VCardActions>
      </VCard>
    </VCol>
    <VCol
      cols="12"
      md="6"
      lg="4"
    >
    <VCard class="text-center">
        <VCardText class="d-flex flex-column justify-center align-center">
          <h6 class="text-h6">
            4 Dashboards
          </h6>
          </VCardText>
          <img
            max-width="505" 
            :src="image1"
            style=" object-fit: contain !important; "
          />
        <VCardText>
          <p>
            Dashboards of all the four subsystems are displayed. 
          </p>
        </VCardText>

        <VCardActions class="justify-center">
          <VBtn variant="elevated"  @click="openFullscreen('temp5')" class="fullview">
          View          </VBtn>
        </VCardActions>
      </VCard>
    </VCol>

 <VCol
      cols="12"
      md="6"
      lg="4"
    >
      <VCard class="text-center">
        <VCardText class="d-flex flex-column justify-center align-center">
          <h6 class="text-h6">
            2 maps & CCTV Grid
          </h6>
          </VCardText>
          <img
            max-width="505"
            :src="image3"
            style=" object-fit: contain !important; "
          />
        <VCardText>
          <p>
            Maps of CCTV and Rolling stocks are displayed with the current status of the devices and the related CCTV's. 
          </p>
        </VCardText>

        <VCardActions class="justify-center">
          <VBtn variant="elevated"  @click="openFullscreen('temp4')" class="fullview">
           View
          </VBtn>
        </VCardActions>
      </VCard>
    </VCol>
    <VCol
      cols="12"
      md="6"
      lg="4"
    >
    <VCard class="text-center">
        <VCardText class="d-flex flex-column justify-center align-center">
          <h6 class="text-h6">
            2 maps & CCTV Grid
          </h6>
          </VCardText>
          <img
            max-width="505"
            :src="image2"
            style=" object-fit: contain !important; "
          />
        <VCardText>
          <p>
            Maps of RFID People and PID are displayed with the current status of the devices and the related CCTV's. 
          </p>
        </VCardText>

        <VCardActions class="justify-center">
          <VBtn variant="elevated"  @click="openFullscreen('temp3')" class="fullview">
           View
          </VBtn>
        </VCardActions>
      </VCard>
      
    </VCol>

    <VCol
   
        cols="12"
        sm="6"
        lg="3"
        style="display:none"
      >
      
        <VCard  @click="openFullscreen('temp1')" class="fullview" >
          <VCardText >
              <h3 class="title-header">4 Maps</h3>
            </VCardText>
          </VCard> <!-- 👉 Add New User -->
          
        
      </VCol>

      <VCol
   
   cols="12"
   sm="6"
   lg="3"
   style="display:none"
 >
 
   <VCard @click="openFullscreen('temp2')" >
     <VCardText>
         <h3 class="title-header">CCTV Grid</h3>
     </VCardText>
     </VCard>  <!-- 👉 Add New User -->
     
  
 </VCol>

 <VCol
   
   cols="12"
   sm="6"
   lg="3"
   style="display:none"
 >
 
   <VCard @click="openFullscreen('temp3')">
     <VCardText>
         <h3 class="title-header">2 maps & CCTV Grid</h3>
     </VCardText>
      <!-- 👉 Add New User -->
       </VCard>
    
  
 </VCol>
 <VCol
   
   cols="12"
   sm="6"
   lg="3"
   style="display:none"
 >
 
   <VCard @click="openFullscreen('temp4')">
     <VCardText>
         <h3 class="title-header">2 maps & CCTV Grid</h3>
     </VCardText>
      <!-- 👉 Add New User -->
    </VCard>
  </VCol>
    <VCol
   
   cols="12"
   sm="6"
   lg="3"
   style="display:none"
 >
   

    <VCard @click="openFullscreen('temp5')">
     <VCardText>
         <h3 class="title-header">4 Dashboards</h3>
     </VCardText>
      <!-- 👉 Add New User -->
    </VCard>
  </VCol>
  <VCol
   
   cols="12"
   sm="6"
   lg="3"
   
 >
   
    <VCard id="card-view">
      <VCardText id="temp1"  style="display:none"  >
          <Template1 />
        
          </VCardText>
      <VCardText id="temp2"  style="display:none"  >
     <Template2 />
    </VCardText>
    
      <VCardText id="temp3"  style="display:none"  >
     <Template3
        
     />
    </VCardText>
      <VCardText id="temp4"  style="display:none"  >
     <Template4
        
     /> </VCardText>
          <VCardText id="temp5"  style="display:none"  >
          <Template5/>

          </VCardText>
      </VCard>
   
   
   
    </VCol>

  </VRow>

</section>
</template>

<script>
export default {
  data() {
    return {
      isFullScreen: false,
    };
  },
  methods: {
    toggleFullScreen() {
      this.isFullScreen = !this.isFullScreen;
    },
    exitFullScreenOnEsc(event) {
      if (event.key === "Escape") {
        this.isFullScreen = false;
      }
    },
  },
  mounted() {
    document.addEventListener("keydown", this.exitFullScreenOnEsc);
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.exitFullScreenOnEsc);
  },
};
</script>
<style>

.widg{
  padding:0px !important
}
</style>

img {
    border-style: outset !important;
}

<route lang="yaml">
  meta:
    action: read
    subject: PANEL_WIDGET
  </route>
