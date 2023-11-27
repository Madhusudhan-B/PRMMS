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
const fetchTags = (offset) => {
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


watchEffect(fetchTags(totalTags.value ? (currentPage.value - 1) * rowPerPage.value  : 0));

// ?? watching current page


// ?? watching current page
watchEffect(() => {
    fetchTags(totalTags.value ? (currentPage.value - 1) * rowPerPage.value : 0);

    if (currentPage.value > totalPage.value) currentPage.value = totalPage.value;
});

// ?? Computing pagination data
const paginationData = computed(() => {
    const firstIndex = totalTags.value ? (currentPage.value - 1) * rowPerPage.value : 1;
    const lastIndex = firstIndex + tags.value.length;
    i = firstIndex;
    return `Showing ${firstIndex} to ${lastIndex} of ${totalTags.value} entries`;
});



const resolveUserStatusVariant = stat => {
 
  if (stat === true)
    return 'success'
  if (stat === false)
    return 'secondary'
  
  return 'primary'
}


const opencam = (ip) =>{
    window.open("http://admin:mudunuru123@"+ip+"/ISAPI/Streaming/channels/102/httpPreview",'_blank','directories=0,titlebar=0,toolbar=0,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350');
 
}

const opennvr = () =>{
    window.open("http://192.168.1.230/doc/page/login.asp?_1682057745088",'_blank','directories=0,titlebar=0,toolbar=0,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350');
 
}


const searchPlayback = () =>{
var ip=selectedcctv.value
if(ip==''){
  alert('Please select CCTV')
  return false
}
  opencam(ip)

}


</script>

<template>
<section v-if="$can('read', 'CCTV_LIVESTREAM')">
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
             <h3 style="color: #2f2774;">CCTV Live</h3>
           </div>
           <VSpacer />
           
          

           <div class="d-flex align-center flex-wrap gap-4">
           <VSelect
               v-model="rowPerPage"
               density="compact"
               variant="outlined"
               :items="[10, 20, 30, 50]"
             />
             

           </div>
         </VCardText>

          <VDivider />
          <div class="mt-10">
              <!-- ?? Search  -->
             
                <VRow>
      

                <VCol cols="12" md="3">
                          <VSelect
                          v-model="selectedcctv"
                        
                          :items="cctvlist"
                        />
                </VCol>
               
                    <VCol cols="12" md="3">
                      <VBtn
                       @click="searchPlayback"
                      
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

          <VTable class="text-no-wrap">
            <!-- ?? table head -->
            <thead>
              <tr>
              <th scope="col">
                  #ID
                </th>
                <th scope="col">
                  IP 
                </th>
                <th scope="col">
                  Host Name
                </th>
                <th scope="col">
               Status
                </th>
                
                <th scope="col">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <!-- ?? table body -->
            <tbody>
              <tr
                v-for="(tag,index) in tags"
                :key="tag.id"
                style="height: 3.75rem;"
              >
                <!-- ?? User -->
                <td>
            <!--RouterLink :to="{ name: '', params: { id: tag.id } }">
              #{{tag.id }}
            </RouterLink-->
            {{i=i+1}}
          </td>

                <!-- ?? Role -->
                <td>
                  <span class="text-capitalize text-base font-weight-semibold">{{ tag.ip_address }}</span>
                </td>

                <!-- ?? Plan -->
                <td>
                  <span class="text-capitalize text-base font-weight-semibold">{{ tag.device_name }}</span>
                </td>

                <td>
                <VChip
                    label
                    :color="resolveUserStatusVariant(tag.ping_status)"
                    size="small"
                    class="text-capitalize">
                  
                    {{tag.ping_status ? 'Active': 'Inactive'}}
                  </VChip>
                  <!-- <span class="text-base">{{ user.is_active }}</span> -->
                </td>
                <!-- <td>
                  <span class="text-base">{{ tag.rs_type }}</span>
                </td> -->
               

                <!-- ?? Actions -->
                
                <td
                  class="text-center"
                  style="width: 5rem;"
                >
                
                 
                </td>
              </tr>
            </tbody>

            <!-- ?? table footer  -->
            <tfoot v-show="!tags.length">
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

            <VPagination
              v-model="currentPage"
              size="small"
              :total-visible="5"
              :length="totalPage"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

  
  </section>
</template>

<style lang="scss">
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
<route lang="yaml">
  meta:
    action: read
    subject: CCTV_LIVESTREAM
  </route>
