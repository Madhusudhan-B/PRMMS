<script setup>
import NewNvrSteup from '@/views/apps/cctv/nvrsetup/list/NewNvrSteup.vue'

import UpdateNvrSteup from '@/views/apps/cctv/nvrsetup/list/UpdateNvrSteup.vue'

import ViewNvrSteup from '@/views/apps/cctv/nvrsetup/list/ViewNvrSteup.vue'

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
           
            const lowercaseipAddressr = stringipAddress ? stringipAddress.toLowerCase() : '';
            const lowercaseportNumber = stringportNumber ? stringportNumber.toLowerCase() : '';
         
           
            return (
              deviceName.includes(query) ||
              lowercaseipAddressr.includes(query) ||
              lowercaseportNumber.includes(query) 
             
                
            );
        }
        return false; // Return false for undefined employee
    });
});

// ?? Fetching Controller list
const fetchTags = (offset) => {
  axios
            .post(
                URL() + `/devices/nvr`,
                {
                    requestType: "view",
                    offset: offset,
                    limit: rowPerPage.value,  
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
        isErrorAlertVisible.value = true;
                isAlertVisible.value = false;
                err.value = error;
                console.error(error);
                console.log(error);
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




const isNewNvrSteupVisible = ref(false)
const isUpdateNvrSteupVisible = ref(false)
const isViewNvrSteupVisible = ref(false)
const getDataNvr=ref([])
const getIndex=ref('')


const addNVR = nvrData => {
  i=0
console.log(nvrData)
if (nvrData.status == "success") {
    isAlertVisible.value = true;
    isErrorAlertVisible.value = false;

   

    console.log(nvrData);
    // refetch role
    message.value = nvrData.message;
    console.log("Refech leave type");
    console.log(tags);
}

if (nvrData.status == "failed") {
    isErrorAlertVisible.value = true;
    isAlertVisible.value = false;
    err.value = nvrData.message;
    console.log("Refech leave type failed");
}
 
}

const updateNVR = (nvrData,index) => {
  //tags.value.splice(index, 1,nvrData);
  i=0
  if (nvrData.status == "success") {
          
          isErrorAlertVisible.value = false;
          isAlertVisible.value = true;
            // refetch location
            message.value = nvrData.message;
          console.log("Refech leave setup");
          console.log(tags);
      }

      if (nvrData.status == "failed") {
          isErrorAlertVisible.value = true;
          isAlertVisible.value = false;
          err.value = nvrData.error;
          console.log("Edit Location failed");
      }
}
const resolveUserStatusVariant = stat => {
  if (stat === 'pending')
    return 'warning'
  if (stat === 'active')
    return 'success'
  if (stat === 'inactive')
    return 'secondary'
  
  return 'primary'
}


const deleteEvent = (tagid,index) => {
  if(confirm('are you sure, Do you want to delete this item?')){
    axios
                .post(
                    URL() + "/devices/nvr",
                    {
                        requestType: "delete",
                        nvr_id: tagid,
                       
                    },
                    
                    { headers: { Authorization: token(), "Content-Type": "application/json" } }
                )
   
      .then((response) => {
        //console.log(response.data.data);
                    isErrorAlertVisible.value = false;
                    isAlertVisible.value = true;
                    message.value = "NVR Deleted ";
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





</script>

<template>
<section v-if="$can('read', 'CCTV_NVR')">
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
              <h3 class="title-header">{{$t('NVR List')}}</h3>
              
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
                v-if="$can('create', 'CCTV_NVR')"
                @click="isNewNvrSteupVisible = true"
              >
               {{$t('Add NVR')}} 
              </VBtn>
            </div>
          </VCardText>

          <VDivider />

          <VTable class="text-no-wrap">
            <!-- ?? table head -->
            <thead>
              <tr>
              <th scope="col" class="text-capitalize">
                  #{{$t('ID')}}
                </th>
                <th scope="col" class="text-capitalize">
                  {{$t('IP Address')}}
                </th>
                <th scope="col" class="text-capitalize">
                  {{$t('Host Name')}}
                </th>
                <th scope="col" class="text-capitalize">
               {{$t('Port')}}
                </th>
                
                
                <th scope="col" class="text-capitalize">
                  {{$t('Actions')}}
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
                  <span >{{ tag.device_name }}</span>
                </td>

                <td>
               
                  
                  <span > {{tag.port}} </span>
                 
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
                <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    v-if="$can('read', 'CCTV_NVR')"
                    @click="(isViewNvrSteupVisible = true),(getDataNvr=tag)"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-eye"
                    />
                  </VBtn>
                
                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    v-if="$can('update', 'CCTV_NVR')"
                    @click="(isUpdateNvrSteupVisible = true),(getDataNvr=tag),(getIndex=index)"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-edit"
                    />
                  </VBtn>

                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    v-if="$can('delete', 'CCTV_NVR')"
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
    <NewNvrSteup
      v-model:isDrawerOpen="isNewNvrSteupVisible"
      @nvr-data="addNVR"
      
    />
    <!-- ?? Update  CCTV -->
    <UpdateNvrSteup
      v-model:isDrawerOpen="isUpdateNvrSteupVisible"
       v-bind:dataNVR="getDataNvr"
       @nvr-data="updateNVR"
       @nvr-index="getIndex"
    />
      <!-- ?? View  CCTV -->
      <ViewNvrSteup
      v-model:isDrawerOpen="isViewNvrSteupVisible"
      v-bind:dataNVR="getDataNvr"
      
    />
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
    subject: CCTV_NVR
  </route>
