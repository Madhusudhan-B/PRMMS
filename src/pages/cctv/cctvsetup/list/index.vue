<script setup>
import NewCctvSteup from '@/views/apps/cctv/cctvsetup/list/NewCctvSteup.vue'

import UpdateCctvSteup from '@/views/apps/cctv/cctvsetup/list/UpdateCctvSteup.vue'

import ViewCctvSteup from '@/views/apps/cctv/cctvsetup/list/ViewCctvSteup.vue'


import {URL, token} from '@/helpers/token'
import axios from '@axios'


const isDialogVisible = ref(false)
const startdate = ref('')
const enddate = ref('')
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
const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalTags = ref(0)
const tags = ref([])
const rtags = ref([])

let i=0

const filteredTags = computed(() => {
    const query = searchQuery.value ? searchQuery.value.toLowerCase() : '';
    return tags.value.filter((tag) => {
        if (tag) {
          const ipAddress =  tag.ip_address;
          const stringipAddress = ipAddress.toString();

          const portNumber =  tag.port;
          const stringportNumber = portNumber.toString();
         

            const deviceName = tag.device_name ? tag.device_name.toLowerCase() : '';
            const pingStatus = tag.ping_status ? tag.ping_status.toLowerCase() : '';
           
            const lowercaseipAddressr = stringipAddress ? stringipAddress.toLowerCase() : '';
            const lowercaseportNumber = stringportNumber ? stringportNumber.toLowerCase() : '';
         
           
            return (
              deviceName.includes(query) ||
              pingStatus.includes(query) ||
              lowercaseipAddressr.includes(query) ||
              lowercaseportNumber.includes(query) 
             
                
            );
        }
        return false; // Return false for undefined employee
    });
});
// ?? Fetching users
const fetchTags = (offset) => {
  axios
            .post(
              URL() + `/devices/cctv`,
                {
                    requestType: "view",
                    searchParams: {},
                    offset:offset,
                    limit:rowPerPage.value,
                    search: searchQuery.value,
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

               
                const firstIndex = response.data.count ? (currentPage.value - 1) * rowPerPage.value + 1 : 0;
                const lastIndex = firstIndex + rowPerPage.value;
                tags.value = data;
                totalPage.value = Math.ceil(response.data.count / perPage) ? Math.ceil(response.data.count / perPage) : 1;
                totalTags.value = response.data.count;
        
      })
      .catch((error) => {
          console.log(error)
      })
      
      
     
}


watch([currentPage, rowPerPage], ([newPage, newPerPage]) => {
    const offset = (newPage - 1) * newPerPage;
    fetchTags(offset, searchQuery.value);
});

watch(currentPage, () => {
    i = (currentPage.value - 1) * rowPerPage.value;
  });

const updatePage = async (newPage, newPerPage) => {
  currentPage.value = newPage;
  rowPerPage.value = newPerPage;
  await fetchTags();
};

const handlePageChange = (newPage) => {
  currentPage = newPage;
  fetchTags((newPage - 1) * rowPerPage.value); // Calculate the offset based on the new page number
};

const handlePerPageChange = (newPerPage) => {
  updatePage(1, newPerPage);
};

const handleSearchChange = (newValue) => {
  currentPage.value = 1;
  fetchTags();
};
const calculateI = (index) => {
  return (currentPage.value - 1) * rowPerPage.value + index + 1;
};
 
const paginationData = computed(() => {
  const firstIndex = totalTags.value ? (currentPage.value - 1) * rowPerPage.value + 1 : 0;
  const lastIndex = Math.min(firstIndex + rowPerPage.value - 1, totalTags.value);
  return `Showing ${firstIndex} to ${lastIndex} of ${totalTags.value} entries`;
});

// Call fetchWorkshop to initialize data
fetchTags();


const isNewCctvSteupVisible = ref(false)
const isUpdateCctvSteupVisible = ref(false)
const isViewCctvSteupVisible = ref(false)
const getData=ref([])
const getIndex=ref('')

const addCCTV = cctvData => {
  i=0
console.log(cctvData)
if (cctvData.status == "success") {
    isAlertVisible.value = true;
    isErrorAlertVisible.value = false;

    watchEffect(fetchTags(totalTags.value ? (currentPage.value - 1) * rowPerPage.value + 1 : 0));

    console.log(cctvData);
    // refetch role
    message.value = cctvData.message;
    console.log("Refech leave type");
    console.log(tags);
}

if (cctvData.status == "failed") {
    isErrorAlertVisible.value = true;
    isAlertVisible.value = false;
    err.value = cctvData.message;
    console.log("Refech leave type failed");
}
}


const updateCCTV = (cctvData,index) => {
 //tags.value.splice(index, 1,cctvData);
 i=0
  if (cctvData.status == "success") {
          
          isErrorAlertVisible.value = false;
          isAlertVisible.value = true;
            // refetch location
            message.value = cctvData.message;
          console.log("Refech leave setup");
          console.log(tags);
      }

      if (cctvData.status == "failed") {
          isErrorAlertVisible.value = true;
          isAlertVisible.value = false;
          err.value = cctvData.error;
          console.log("Edit Location failed");
      }
}

const resolveUserStatusVariant = stat => {
      // if (stat === false) return "warning";
      if (stat === true) return "success"
        if (stat === false) return "secondary"

        return "primary"
}


const deleteEvent = (tagid,index) => {
  if(confirm('are you sure, Do you want to delete this item?')){
    axios
                .post(
                    URL() + "/devices/cctv",
                    {
                        requestType: "delete",
                        cctv_id: tagid,
                       
                    },
                    { headers: { Authorization: token(), "Content-Type": "application/json" } }
                )
   
      .then((response) => {
        //console.log(response.data.data);
                    isErrorAlertVisible.value = false;
                    isAlertVisible.value = true;
                    message.value = "CCTV Deleted ";
                    watchEffect(fetchTags(totalTags.value ? (currentPage.value - 1) * rowPerPage.value + 1 : 0));
       //   this.listings = response.data; 
      })
      .catch((error) => {
          console.log(error)
          isErrorAlertVisible.value = true;
                    isAlertVisible.value = false;
                    err.value = error;
                    console.log(error);
      })
    
    i=0;
  }
  
}







const opencam = (ip) =>{
 // alert(ip)
   // window.open("http://admin:mudunuru123@"+ip+"/ISAPI/Streaming/channels/102/httpPreview",'_blank','directories=0,titlebar=0,toolbar=0,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350');
   window.open("http://admin:mudunuru123@"+ip+"/ISAPI/Streaming/channels/102/httpPreview",'_blank','directories=0,titlebar=0,toolbar=0,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350');
 
}

const opennvr = (ip) =>{
  isDialogVisible.value=true


   window.open("http://"+ip+"/doc/page/login.asp?_1682057745088",'_blank','directories=0,titlebar=0,toolbar=0,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350');
 
}

</script>

<template>
<section v-if="$can('read', 'CCTV_CCTV')">
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

          <VCardText class="d-flex flex-wrap py-4 gap-4">
           
           <div
             class=""
             style=""
           >
             <h3 style="color: #2f2774;">{{$t('CCTV Setup')}}</h3>
           </div>
           <VSpacer />
           <!-- <div
             class="me-3 ml-5"
            
           >
            
           </div> -->
          

           <div class="d-flex align-center flex-wrap gap-4">
           <VSelect
               v-model="rowPerPage"
               density="compact"
               variant="outlined"
               :items="[10, 20, 30, 50]"
             />
             <!-- ?? Search  -->
             <div style="width: 10rem;">
               <VTextField
                 v-model="searchQuery"
                 placeholder="Search"
                 density="compact"
               />
             </div>

             <!-- ?? Export button -->
             <!-- <VBtn
               variant="tonal"
               color="secondary"
               prepend-icon="tabler-screen-share"
             >
               Export
             </VBtn> -->

             <!-- ?? Add user button -->
             <VBtn
               prepend-icon="tabler-plus"
               v-if="$can('create', 'CCTV_CCTV')"
               @click="isNewCctvSteupVisible = true"
             >
             {{$t('Add CCTV')}} 
             </VBtn>
           </div>
         </VCardText>

          <VDivider />

          <VDialog
    v-model="isDialogVisible"
    max-width="600"
  >
    <!-- Dialog Activator -->
   

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

    <!-- Dialog Content -->
    <VCard title="NVR">
      <VCardText>
        <VRow>
         
          <VCol
            cols="12"
           
            md="6"
          >
            <VTextField
    v-model="startdate"
    label=" Start Date & Time"
    :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' }"
    type="date"
  />
          </VCol>
          <VCol
            cols="12"
           
            md="6"
          >
          <VTextField
    v-model="enddate"
    label=" End Date & Time"
    :config="{ enableTime: true, dateFormat: 'Y-m-d H:i'}"
    type="date"
  />
          </VCol>
          <VCol cols="12">
           
          </VCol>
        
        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn
          variant="tonal"
          color="secondary"
          @click="isDialogVisible = false"
        >
          Close
        </VBtn>
        <VBtn @click="openRTSPStream">
          Search
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>

          <VTable class="text-no-wrap">
            <!-- ?? table head -->
            <thead>
              <tr>
              <th scope="col" class="text-capitalize">
                  #{{$t('ID')}}
                </th>
                <th scope="col" class="text-capitalize">
                {{$t('IP Adress')}}
                </th>
                <th scope="col" class="text-capitalize">
            {{$t('Port')}}
                </th>
                <th scope="col" class="text-capitalize">
               {{$t('Name')}}
                </th>
                <th scope="col" class="text-capitalize">
                {{$t('Status')}}
                </th>
                <th scope="col" class="text-capitalize">
                {{$t('Location')}}
                </th>
                
                
                <th scope="col" class="text-capitalize">
                  {{$t("Actions")}}
                </th>
              </tr>
            </thead>
            <!-- ?? table body -->
            <tbody>
              <tr
                v-for="(tag,index) in filteredTags"
                :key="tag.id"
                style="height: 3.75rem;"
              >
                <!-- ?? User -->
                <td>
                {{ calculateI(index) }}
          </td>

                <!-- ?? Role -->
                <td>
                  <span >{{ tag.ip_address }}</span>
                </td>

                <!-- ?? Plan -->
                <td>
                  <span >{{ tag.port }}</span>
                </td>

                <td>
              
                  
                    {{tag.device_name}}
                 
                  <!-- <span class="text-base">{{ user.is_active }}</span> -->
                </td>
                <!-- <td>
                  <span class="text-base">{{ tag.rs_type }}</span>
                </td> -->
                <td>
                  <VChip label :color="resolveUserStatusVariant(tag.ping_status)" size="small" class="text-capitalize">
                                    {{ tag.ping_status ? 'Active' : 'Inactive'}}
                                    </VChip>
                   
                  <!-- <span class="text-base">{{ user.is_active }}</span> -->
                </td>
                <td>
                  <span class="text-base">{{ tag.location_name ? tag.location_name : ''  }}</span>
                </td>
               


                <!-- ?? Status -->
               
               

                <!-- ?? Actions -->
                
                <td
                  class="text-center"
                  style="width: 5rem;"
                >
                <!--button @click="openRTSPStream">Open RTSP Stream</button --> 
                
                <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    title="Live Stream"
                    @click="opencam(tag.ip_address)"
                    v-if="$can('read', 'CCTV_LIVESTREAM')"
                  >
                    <VIcon
                      size="22"
                      icon="bx-cctv"
                    

                    />
                  </VBtn>
                  
                    <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    title="Play Back"
                    @click="opennvr(tag.ip_address)"
                    v-if="$can('read', 'CCTV_PLAYBACK')"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-play"
                      @click=""
                      



                    />
                  </VBtn>
                <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    v-if="$can('read', 'CCTV_CCTV')"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-eye"
                      @click="(isViewCctvSteupVisible = true),(getData=tag),(getIndex=index)"
                      



                    />
                  </VBtn>
                
                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    v-if="$can('update', 'CCTV_CCTV')"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-edit"
                      @click="(isUpdateCctvSteupVisible = true),(getData=tag),(getIndex=index)"
                    />
                  </VBtn>

                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    v-if="$can('delete', 'CCTV_CCTV')"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-trash"
                      @click="deleteEvent(tag.id,index)"

                    />
                  </VBtn>

                 
                  
                </td>
              </tr>
            </tbody>

            <!-- ?? table footer  -->
            <tfoot v-show="!filteredTags.length">
              <tr>
                <td
                  colspan="7"
                  class="text-center"
                >
                  No data available
                </td>
              </tr>
            </tfoot>
          </VTable>

          <VDivider />

          <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4 py-3 px-5">
                        <span class="text-sm text-disabled">
                            {{ paginationData }}
                        </span>
            
             
            <VPagination v-model="currentPage" @change="handlePageChange" size="small" :total-visible="10" :length="totalPage" />
                    </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- ?? Add New CCTV -->
    <NewCctvSteup
      v-model:isDrawerOpen="isNewCctvSteupVisible"
      @cctv-data="addCCTV"
    />
    <!-- ?? Update  CCTV -->
    <UpdateCctvSteup
      v-model:isDrawerOpen="isUpdateCctvSteupVisible"
       v-bind:datacctv="getData"
       @cctv-data="updateCCTV"
       @cctv-index="getIndex"
    />
      <!-- ?? View  CCTV -->
      <ViewCctvSteup
      v-model:isDrawerOpen="isViewCctvSteupVisible"
       v-bind:dataCCTV="getData"
    />
  </section>
</template>

<style lang="scss">
.red-dot {
  height: 20px;
  width: 20px;
  background-color: red;
  border-radius: 50%;
  display: inline-block;
}

.green-dot {
  height: 20px;
  width: 20px;
  background-color: green;
  border-radius: 50%;
  display: inline-block;
}
.app-user-search-filter {
  inline-size: 31.6rem;
}

.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}
</style>

 
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
}; 
</script>
<style>
.flatpickr-calendar.animate.open {
   
    z-index: 9999;
}
</style>
<route lang="yaml">
  meta:
    action: read
    subject: CCTV_CCTV
  </route>
