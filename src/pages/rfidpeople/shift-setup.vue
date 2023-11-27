<script setup>

import NewShiftSteup from '@/views/apps/rfidpeople/shiftsetup/list/NewShiftSteup.vue'

import UpdateShiftSteup from '@/views/apps/rfidpeople/shiftsetup/list/UpdateShiftSteup.vue'

import ViewShiftSteup from '@/views/apps/rfidpeople/shiftsetup/list/ViewShiftSteup.vue'

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
          

            const shiftName = tag.shift_name ? tag.shift_name.toLowerCase() : '';
          
           
            return (
              shiftName.includes(query) 
             
            );
        }
        return false; // Return false for undefined employee
    });
});

// ?? Fetching Shift list
const fetchTags = (offset) => {
  axios
            .post(
                URL() + `/shift`,
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

const isNewShiftSteupVisible = ref(false)
const isUpdateShiftSteupVisible = ref(false)
const isViewShiftSteupVisible = ref(false)
const getDataShift=ref([])
const getIndex=ref('')







const addShift = shiftData => {
  i=0
console.log(shiftData)
if (shiftData.status == "success") {
    isAlertVisible.value = true;
    isErrorAlertVisible.value = false;

    watchEffect(fetchTags(totalTags.value ? (currentPage.value - 1) * rowPerPage.value + 1 : 0));

    console.log(shiftData);
    // refetch role
    message.value = shiftData.message;
    console.log("Refech Shift success");
    console.log(tags);
}

if (shiftData.status == "failed") {
    isErrorAlertVisible.value = true;
    isAlertVisible.value = false;
    err.value = shiftData.message;
    console.log("Refech  failed");
}
 
}


const updateNVR = (shiftData,index) => {
  //tags.value.splice(index, 1,shiftData);
  i=0
  if (shiftData.status == "success") {
          
          isErrorAlertVisible.value = false;
          isAlertVisible.value = true;
            // refetch location
            message.value = shiftData.message;
          console.log("Refech Shift setup");
          console.log(tags);
      }

      if (shiftData.status == "failed") {
          isErrorAlertVisible.value = true;
          isAlertVisible.value = false;
          err.value = shiftData.error;
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
                    URL() + "/shift",
                    {
                        requestType: "delete",
                        shift_id: tagid,
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
<section v-if="$can('read', 'PEOPLE_SHIFT')">
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
             <h3 class="title-header">{{$t('Shift')}}</h3>
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

             <VBtn prepend-icon="tabler-plus" v-if="$can('create', 'PEOPLE_SHIFT')" @click="isNewShiftSteupVisible = true">
                                {{$t('Add Shift')}}
                            </VBtn>
           </div>
         </VCardText>

          <VDivider />

          <VTable class="text-no-wrap">
            <!-- ?? table head -->
            <thead>
            <tr>
              <th scope="col"  class="text-capitalize">
                  #{{$t('ID')}}
                </th>

                <th scope="col"  class="text-capitalize">
                  {{$t('Shift Name')}} 
                </th>
                <th scope="col"  class="text-capitalize">
                 {{$t('Shift Start Time')}}
                </th>
                <th scope="col"  class="text-capitalize">
                  {{$t('Shift End Time')}}
                </th>
                <th scope="col"  class="text-capitalize">
                 {{$t('Compute Late By')}}
                </th>
                <th scope="col"  class="text-capitalize">
                  {{$t('Grace Late BY')}}
                </th>
                <th scope="col"  class="text-capitalize">
                 {{$t('Break Start Time')}}
                </th>
                <th scope="col"  class="text-capitalize">
                 {{$t('Break End Time')}}
                </th>
             
                <th scope="col"  class="text-capitalize">
                 {{(' Actions')}}
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
            <!--RouterLink :to="{ name: '', params: { id: tag.id } }">
              #{{tag.id }}
            </RouterLink-->
            {{ calculateI(index) }}
          </td>

                <!-- ?? Role -->
                <td>
                  <span >{{ tag.shift_name }}</span>
                </td>

                <td>
                  <span >{{ tag.shift_start_time}}</span>
                </td>
                <td>
                  <span >{{ tag.shift_end_time}}</span>
                </td>
                 <!-- ?? Plan -->
                 <td>
                  <span >{{ tag.compute_late_by }}</span>
                </td>
                 <!-- ?? Plan -->
                 <td>
                  <span >{{ tag.grace_late_by }}</span>
                </td>
                 <!-- ?? Plan -->
                 <td>
                  <span >{{ tag.break_start_time }}</span>
                </td>

                 <!-- ?? Plan -->
                 <td>
                  <span >{{ tag.break_end_time }}</span>
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
                    v-if="$can('read', 'PEOPLE_SHIFT')"

                    @click="(isViewShiftSteupVisible = true),(getDataShift=tag),(getIndex=index)"
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
                    v-if="$can('update', 'PEOPLE_SHIFT')"
                    @click="(isUpdateShiftSteupVisible = true),(getDataShift=tag),(getIndex=index)"
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
                    v-if="$can('delete', 'PEOPLE_SHIFT')"
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
    <NewShiftSteup
      v-model:isDrawerOpen="isNewShiftSteupVisible"
      @shift-data="addShift"
      
    />
    <!-- ?? Update  rfidpeople -->
    <UpdateShiftSteup
      v-model:isDrawerOpen="isUpdateShiftSteupVisible"
       v-bind:dataShift="getDataShift"
       @shift-data="updateShift"
       @shift-index="getIndex"
    />
      <!-- ?? View  rfidpeople -->
      <ViewShiftSteup
      v-model:isDrawerOpen="isViewShiftSteupVisible"
      v-bind:dataShift="getDataShift"
      
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
    subject: PEOPLE_SHIFT
  </route>
