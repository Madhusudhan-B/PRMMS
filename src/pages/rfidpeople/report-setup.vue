<script setup>

// import NewControllerSteup from '@/views/apps/rfidpeople/controllersetup/list/NewControllerSteup.vue'

// import UpdateControllerSteup from '@/views/apps/rfidpeople/controllersetup/list/UpdateControllerSteup.vue'

// import ViewControllerSteup from '@/views/apps/rfidpeople/controllersetup/list/ViewControllerSteup.vue'

import {URL, token} from '@/helpers/token'
import axios from '@axios'


const route = useRoute()
const router = useRouter()
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
const rtags = ref([])

let i=0


// ?? Fetching Controller list
const fetchTags = (offset) => {
  axios
            .post(
                URL() + `/people_report`,
                {
                    requestType: "view",
                    offset: offset,
                    limit: rowPerPage.value,
                    searchParams:{}
                },
                { headers: { Authorization: token() } }
            )
  
            .then((response) => {
       
       const data = response.data.data;
               const q = searchQuery.value,
                   d = "",
                   role = null,
                   plan = null,
                   status = null,
                   perPage = rowPerPage.value,
                   currentPage = 1;
               const queryLower = q.toLowerCase();

               rtags.value = data;
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



watchEffect(fetchTags(totalTags.value ? (currentPage.value - 1) * rowPerPage.value + 1 : 0));

// ?? watching current page



// ?? watching current page
watchEffect(() => {
  fetchTags(totalTags.value ? (currentPage.value - 1) * rowPerPage.value : 0)

    if (currentPage.value > totalPage.value) currentPage.value = totalPage.value
});

// ?? Computing pagination data
const paginationData = computed(() => {
    const firstIndex = totalTags.value ? (currentPage.value - 1) * rowPerPage.value : 1;
    const lastIndex = firstIndex + tags.value.length;
    i = firstIndex;
    return `Showing ${firstIndex} to ${lastIndex} of ${totalTags.value} entries`;
});

const isNewControllerSteupVisible = ref(false)
const isUpdateControllerSteupVisible = ref(false)
const isViewControllerSteupVisible = ref(false)
const getDataController=ref([])
const getIndex=ref('')



const addController = controllerData => {
i=0
rtags.value.push(controllerData)
  // refetch Controller
console.log('Refech CONTROLLER')
  console.log(rtags)
 
}


const updateController = (controllerData,index) => {
  //tags.value.splice(index, 1,controllerData);
  i=0
  if (controllerData.status == "success") {
          
          isErrorAlertVisible.value = false;
          isAlertVisible.value = true;
            // refetch location
            message.value = controllerData.message;
          console.log("Refech Shift setup");
          console.log(tags);
      }

      if (controllerData.status == "failed") {
          isErrorAlertVisible.value = true;
          isAlertVisible.value = false;
          err.value = controllerData.error;
          console.log("Edit Shift failed");
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


const deleteEvent = (tagid, index) => {
        if (confirm("are you sure, Do you want to delete this Data?")) {
            axios
                .post(
                    URL() + "/people_report",
                    {
                        requestType: "delete",
                        report_id: tagid,
                    },
                    { headers: { Authorization: token(), "Content-Type": "application/json" } }
                )
                .then((response) => {
                    console.log(response.data.data);
                    isErrorAlertVisible.value = false;
                    isAlertVisible.value = true;
                    message.value = "Report Setup Deleted ";
                    tags.value.splice(index, 1);
                    //   this.listings = response.data;
                })
                .catch((error) => {
                    isErrorAlertVisible.value = true;
                    isAlertVisible.value = false;
                    err.value = error;
                    console.log(error);
                });
        }
    };


</script>

<template>
<section v-if="$can('read', 'PEOPLE_REPORT')">
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
              class="me-3"
              style="width: 80px;"
            >
              <VSelect
                v-model="rowPerPage"
                density="compact"
                variant="outlined"
                :items="[5,10, 20, 30, 50]"
              />
            </div>
            <div
              class=""
              style="margin-left: 181px; margin-left: 72px;font-size: 24px;"
            >
              <h3 style="color: #2f2774;">Report Setup</h3>
            </div>
            <VSpacer />

            <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
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
                v-if="$can('create', 'PEOPLE_REPORT')"
                @click="isNewControllerSteupVisible = true"
              >
                Add Controller
              </VBtn>
            </div>
          </VCardText>

          <VDivider />

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
                 Port Number
                </th>
                <th scope="col">
                  Device Type
                </th>
                <th scope="col">
                  Device Name
                </th>
                <th scope="col">
                  location
                </th>
                <th scope="col">
                  Device Status
                </th>
                <th scope="col">
                  Device Enabled
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

                <td>
                <VChip
                    label
                    
                    size="small"
                    class="text-capitalize">
                  
                    {{tag.port}}
                  </VChip>
                  <!-- <span class="text-base">{{ user.is_active }}</span> -->
                </td>
               

                <!-- ?? Plan -->
                <td>
                  <span class="text-capitalize text-base font-weight-semibold">{{ tag.device_type}}</span>
                </td>
                 <!-- ?? Plan -->
                 <td>
                  <span class="text-capitalize text-base font-weight-semibold">{{ tag.device_name }}</span>
                </td>
                 <!-- ?? Plan -->
                 <td>
                  <span class="text-capitalize text-base font-weight-semibold">{{ tag.location.location_description }}</span>
                </td>
                 <!-- ?? Plan -->
                 <td>
                  <span class="text-capitalize text-base font-weight-semibold">{{ tag.device_status ? 'UP' : 'DOWN' }}</span>
                </td>

                 <!-- ?? Plan -->
                 <td>
                  <span class="text-capitalize text-base font-weight-semibold">{{ tag.device_enabled ? 'YES' : 'NO' }}</span>
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
                    v-if="$can('create', 'PEOPLE_REPORT')"
                    @click="(isViewControllerSteupVisible = true),(getDataController=tag)"
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
                    v-if="$can('update', 'PEOPLE_REPORT')"

                    @click="(isUpdateControllerSteupVisible = true),(getDataController=tag),(getIndex=index)"
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
                    v-if="$can('delete', 'PEOPLE_REPORT')"
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

  
    <!-- ?? Add New rfidpeople -->
    <NewControllerSteup
      v-model:isDrawerOpen="isNewControllerSteupVisible"
      @controller-data="addController"
      
    />
    <!-- ?? Update  rfidpeople -->
    <UpdateControllerSteup
      v-model:isDrawerOpen="isUpdateControllerSteupVisible"
       v-bind:dataController="getDataController"
       @controller-data="updateController"
       @controller-index="getIndex"
    />
      <!-- ?? View  rfidpeople -->
      <ViewControllerSteup
      v-model:isDrawerOpen="isViewControllerSteupVisible"
      v-bind:dataController="getDataController"
      
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
    subject: PEOPLE_REPORT
  </route>

