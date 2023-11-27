<script setup>

import AddNewSetupDrawer from '@/views/apps/perimeter/list/AddNewSetupDrawer.vue'

import EditSetupDrawer from '@/views/apps/perimeter/list/EditSetupDrawer.vue'

import ViewSetupDrawer from '@/views/apps/perimeter/list/ViewSetupDrawer.vue'

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
         

            const segmentName = tag.segment_name ? tag.segment_name.toLowerCase() : '';
            const locationName = tag.location.location_short_code ? tag.location.location_short_code.toLowerCase() : '';
           
            const lowercaseipAddressr = stringipAddress ? stringipAddress.toLowerCase() : '';
            const lowercaseportNumber = stringportNumber ? stringportNumber.toLowerCase() : '';
         
           
            return (
              segmentName.includes(query) ||
              locationName.includes(query) ||
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
              URL() + `/devices/pids_segment`,
                {
                    requestType: "view",
                    searchParams: {},
                    offset:offset,
                    limit:rowPerPage.value
                },
                { headers: { Authorization: token() } }
            )
  
 
      .then((response) => {
        const data = response.data.data;
       //   this.listings = response.data;       
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
          tags.value = [];
          totalPage.value=0;
          totalTags.value=0
          console.log(error)
          isErrorAlertVisible.value = true;
                    isAlertVisible.value = false;
                    err.value = error;
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

const isAddNewSetupDrawerVisible = ref(false)
const isEditSetupDrawerVisible = ref(false)
const isViewSetupDrawerVisible = ref(false)
const getDataSegment=ref([])
const getIndex=ref('')


const addSegment = segmentData => {
  i=0
console.log(segmentData)
if (segmentData.status == "success") {
    isAlertVisible.value = true;
    isErrorAlertVisible.value = false;
  
    fetchTags(totalTags.value ? (currentPage.value - 1) * rowPerPage.value + 1 : 0)

    console.log(segmentData);
    // refetch role
    message.value = segmentData.message;
    console.log("Refech leave type");
    console.log(tags);
}

if (segmentData.status == "failed") {
    isErrorAlertVisible.value = true;
    isAlertVisible.value = false;
    err.value = segmentData.message;
    console.log("Refech Segment failed");
}
 
}

const updateSegment= (segmentData,index) => {
 //tags.value.splice(index, 1,segmentData);
 i=0
  if (segmentData.status == "success") {
          
          isErrorAlertVisible.value = false;
          isAlertVisible.value = true;
            // refetch location
            message.value = segmentData.message;
          console.log("Refech segment setup");
          console.log(tags);
      }

      if (segmentData.status == "failed") {
          isErrorAlertVisible.value = true;
          isAlertVisible.value = false;
          currentPage.value=1
    fetchTags(totalTags.value ? (currentPage.value - 1) * rowPerPage.value + 1 : 0)
          err.value = segmentData.error;
          console.log("Edit Segment failed");
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
                    URL() + "/pids_segment",
                    {
                        requestType: "delete",
                        id: tagid,
                       
                    },
                    { headers: { Authorization: token(), "Content-Type": "application/json" } }
                )
   
      .then((response) => {
        //console.log(response.data.data);
                    isErrorAlertVisible.value = false;
                    isAlertVisible.value = true;
                    message.value = "Segment Deleted ";
                    currentPage.value=1
    fetchTags(totalTags.value ? (currentPage.value - 1) * rowPerPage.value + 1 : 0)
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
<section v-if="$can('read', 'PID_SEGMENT')">
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
           
           <div>
             <h3 class="title-header">{{$t('Segment Setup')}}</h3>
           </div>
           <VSpacer />
         

           <div class="d-flex align-center flex-wrap gap-4">
           <VSelect
               v-model="rowPerPage"
               density="compact"
               variant="outlined"
               :items="[10, 20, 30, 50]"
             />
             <!-- ?? Search  -->
             <div style="width: 10rem;">
               <VTextField v-model="searchQuery" placeholder="Search" density="compact"
               />
             </div>

            <!-- ?? Add user button -->
            <VBtn
              v-if="$can('create', 'PID_SEGMENT')"
                prepend-icon="tabler-plus"
                @click="isAddNewSetupDrawerVisible = true"
              >
                {{$t('Add Segment')}}
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
                  {{$t('Segment Name')}}
                </th>
                <th scope="col" class="text-capitalize">
                 {{$t('Location')}}
                </th>
                <th scope="col" class="text-capitalize">
                 {{$t('Slot Name')}}
                </th>
                <th scope="col" class="text-capitalize">
                {{$t('Ip Address')}}
                </th>
                <th scope="col" class="text-capitalize">
                 {{$t('Port')}}
                </th>
                <th scope="col" class="text-capitalize">
                {{$t('PID Device')}}
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
                  <span >{{ tag.segment_name }}</span>
                </td>

                <td>
                  <span >
                    {{tag.location.location_short_code}}
                  </span>
                  <!-- <span class="text-base">{{ user.is_active }}</span> -->
                </td>
               

                <!-- ?? Plan -->
                <td>
                  <span >{{ tag.slot_name}}</span>
                </td>
                 <!-- ?? Plan -->
                 <td>
                  <span >{{ tag.ip_address }}</span>
                </td>
                 <!-- ?? Plan -->
                 <td>
                  <span >{{ tag.port }}</span>
                </td>
                 <!-- ?? Plan -->
                 <td>
                  <span >{{ tag.pids_device }}</span>
                </td>


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
                    v-if="$can('read', 'PID_SEGMENT')"
                    @click="(isViewSetupDrawerVisible = true),(getDataSegment=tag),(getIndex=index)"
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
                    v-if="$can('update', 'PID_SEGMENT')"
                    @click="(isEditSetupDrawerVisible = true),(getDataSegment=tag),(getIndex=index)"
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
                     v-if="$can('delete', 'PID_SEGMENT')"
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

  
    <!-- ?? Add New rfidpeople -->
    <AddNewSetupDrawer
      v-model:isDrawerOpen="isAddNewSetupDrawerVisible"
      @segment-data="addSegment"
      
    />
    <!-- ?? Update  rfidpeople -->
    <EditSetupDrawer
      v-model:isDrawerOpen="isEditSetupDrawerVisible"
       v-bind:datasegment="getDataSegment"
       @segment-data="updateSegment"
       @segment-index="getIndex"
    />
      <!-- ?? View  rfidpeople -->
      <ViewSetupDrawer
      v-model:isDrawerOpen="isViewSetupDrawerVisible"
      v-bind:datasegment="getDataSegment"
      
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
    subject: PID_SEGMENT
  </route>