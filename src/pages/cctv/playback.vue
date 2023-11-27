<script setup>


import {URL, token} from '@/helpers/token'
import axios from '@axios'

const route = useRoute();
    const router = useRouter();
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
// const userListStore = useUserListStore()
const searchQuery = ref('')
const dateQuery = ref('')
const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const totalTags = ref(0)
const tags = ref([])
const cctvlist=ref([])
const selectedcctv=ref('')
const startdate=ref('')
const enddate=ref('')
let i=0


// ?? Fetching Controller list
const fetchTags = () => {
  axios
            .post(
              URL() + `/cctv`,
                {
                    requestType: "view",
                    module: "CC_CAMERA",
                },
                { headers: { Authorization: token() } }
            )
  
      .then((response) => {
       
          //   this.listings = response.data;       
          console.log(response.data.data);
                const data = response.data.data;
                const q = searchQuery.value,
                    d = "",
                    role = null,
                    plan = null,
                    status = null,
                    perPage = rowPerPage.value,
                    currentPage = 1;
                const queryLower = q.toLowerCase();
                data.forEach(function(keyValue, i) {
                    cctvlist.value.push({ title: keyValue.device_name, value: keyValue.ip_address });
                });
               
                const firstIndex = response.data.count ? (currentPage.value - 1) * rowPerPage.value + 1 : 0;
                const lastIndex = firstIndex + rowPerPage.value;
                tags.value = data;
                totalPage.value = Math.ceil(response.data.count / perPage) ? Math.ceil(response.data.count / perPage) : 1;
                totalTags.value = response.data.count;
        
      })
      .catch((error) => {
        isErrorAlertVisible.value = true;
                isAlertVisible.value = false;
                err.value = error;
                console.error(error);
                console.log(error);
      })
      
      
     
}


fetchTags();




const resolveUserStatusVariant = stat => {
 
  if (stat === true)
    return 'success'
  if (stat === false)
    return 'secondary'
  
  return 'primary'
}


const opencam = () =>{
    window.open("http://admin:mudunuru123@192.168.1.232/ISAPI/Streaming/channels/102/httpPreview",'_blank','directories=0,titlebar=0,toolbar=0,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350');
 
}

const opennvr = (ip) =>{
    window.open("http://"+ip+"/doc/page/login.asp?_1682057745088",'_blank','directories=0,titlebar=0,toolbar=0,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350');
 
}


const searchPlayback = () =>{

  var ip=selectedcctv.value
if(ip==''){
  alert('Please select CCTV')
  return false
}
opennvr(ip)

}





</script>

<template>
<section v-if="$can('read', 'CCTV_PLAYBACK')">
     <!-- ?? Alert messages   -->
    <div class="alert-demo-v-model-wrapper">
    <VAlert
      v-model="isErrorAlertVisible"
      color="error"
      variant="tonal"
    >
    {{err}}
         </VAlert>
         <VAlert
      v-model="isAlertVisible"
      color="success"
      variant="tonal"
    >
    {{message}}
         </VAlert>
  </div>

    <VRow>
      

      <VCol cols="12">
      <VCard >
       

          <VDivider />
          <VCardText class="d-flex flex-wrap py-4 gap-4 ">
           
           <div
             class=""
             style=""
           >
             <h3 style="color: #2f2774;">Playback</h3>
           </div>
           <VSpacer />
          

         
         </VCardText>

          <VDivider />
          <div class="mt-10 mb-10 ml-5 mr-5">
              <!-- ?? Search  -->
             
                <VRow>
      

                <VCol cols="12" md="3">
                          <VSelect
                          v-model="selectedcctv"
                        
                          :items="cctvlist"
                        />
                </VCol>
                <VCol cols="12" md="3">
                        <AppDateTimePicker
                        v-model="startdate"
                        label="Start Date"
                      />
                    </VCol>
                      <VCol cols="12" md="3">
                      <AppDateTimePicker
                        v-model="enddate"
                        label="End Date"
                      />
                    </VCol>
                    <VCol cols="12" md="3">
                      <!---   @click="searchPlayback"----->
                      <VBtn
                      @click="openRTSPStream"
                      
                      >
                        Search
                      </VBtn>

                   
                    </VCol> 
                </VRow>
                
           

              <!-- ?? Export button -->
              <!-- <VBtn
                variant="tonal"
                color="secondary"
                prepend-icon="tabler-screen-share"
              >
                Export
              </VBtn> -->

              <!-- ?? Add user button -->
            
            </div>

        

          <VDivider />

       
        </VCard>
      </VCol>
    </VRow>

  
  </section>
</template>



 
<script> 
export default { 
  methods: { 
    openRTSPStream() { 
      const rtspUrl = 'rtsp://admin:mudunuru123@192.168.1.230/Streaming/tracks/101/?starttime=20230503T082815Z&amp;endtime=20230503T104500Z&amp;name=00000000278000000&amp;size=1063084000' 
      const vlcExtensionUrl = 'chrome-extension://ihpiinojhnfhpdmmacgmpoonphhimkaj/player.html?url=' + encodeURIComponent(rtspUrl); 

      
 
      window.open(vlcExtensionUrl,'_blank','directories=0,titlebar=0,toolbar=0,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350');
     // window.open(vlcExtensionUrl)
    } 
  } 
} 

/** 
    var vlc = document.getElementById("vlc");
vlc.audio.toggleMute();*/

</script>
<route lang="yaml">
  meta:
    action: read
    subject: CCTV_PLAYBACK
  </route>
