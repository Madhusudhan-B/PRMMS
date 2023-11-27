<script setup>

import NewTimezoneSteup from '@/views/apps/rfidpeople/timezonesetup/list/NewTimezoneSteup.vue'

import UpdateTimezoneSteup from '@/views/apps/rfidpeople/timezonesetup/list/UpdateTimezoneSteup.vue'

import ViewTimezoneSteup from '@/views/apps/rfidpeople/timezonesetup/list/ViewTimezoneSteup.vue'

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


// ?? Fetching Timezone list
const fetchTags = (offset) => {
  console.log(token())
  axios
            .post(
                URL() + `/time_zone`,
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



const isNewTimezoneSteupVisible = ref(false)
const isUpdateTimezoneSteupVisible = ref(false)
const isViewControllerSteupVisible = ref(false)
const getDataTimezone=ref([])
const getIndex=ref('')


const addTimezone = controllerData => {
i=0
tags.value.push(controllerData)
  // refetch timezone
console.log('Refech Timezone')
  console.log(tags)
 
}

const updateTimezone = (controllerData,index) => {
  //tags.value.splice(index, 1,controllerData);
  i=0
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
                    URL() + "/time_zone",
                    {
                        requestType: "delete",
                        time_zone_id: tagid,
                    },
                    { headers: { Authorization: token(), "Content-Type": "application/json" } }
                )
                .then((response) => {
                    console.log(response.data.data);
                    isErrorAlertVisible.value = false;
                    isAlertVisible.value = true;
                    message.value = " Time Zone Deleted ";
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
<section v-if="$can('read', 'PEOPLE_TIMEZONE')">
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
             <h3 style="color: #2f2774;">Timezone</h3>
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
            <VBtn prepend-icon="tabler-plus" v-if="$can('create', 'PEOPLE_TIMEZONE')" @click="isNewTimezoneSteupVisible = true">
                                Add Timezone
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
                  Timezone Name 
                </th>
                <th scope="col">
                 Remarks
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

              
                 <td>
                  <span class="text-capitalize text-base font-weight-semibold">{{ tag.timezone_name }}</span>
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
                    v-if="$can('read', 'PEOPLE_TIMEZONE')"
                    @click="(isViewControllerSteupVisible = true),(getDataTimezone=tag)"
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
                    v-if="$can('update', 'PEOPLE_TIMEZONE')"
                    @click="(isUpdateTimezoneSteupVisible = true),(getDataTimezone=tag),(getIndex=index)"
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
                    v-if="$can('delete', 'PEOPLE_TIMEZONE')"
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
    <NewTimezoneSteup
      v-model:isDrawerOpen="isNewTimezoneSteupVisible"
      @timezone-data="addTimezone"
      
    />
    <!-- ?? Update  rfidpeople -->
    <UpdateTimezoneSteup
      v-model:isDrawerOpen="isUpdateTimezoneSteupVisible"
       v-bind:dataController="getDataTimezone"
       @timezone-data="updateTimezone"
       @timezone-index="getIndex"
    />
      <!-- ?? View  rfidpeople -->
      <ViewTimezoneSteup
      v-model:isDrawerOpen="isViewControllerSteupVisible"
      v-bind:dataController="getDataTimezone"
      
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
    subject: PEOPLE_TIMEZONE
  </route>
