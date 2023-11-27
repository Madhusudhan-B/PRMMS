<script setup>


import UpdateReaderSteup from '@/views/apps/rfidpeople/readersetup/list/UpdateReaderSteup.vue'

import ViewReaderSteup from '@/views/apps/rfidpeople/readersetup/list/ViewReaderSteup.vue'
import { useRoute, useRouter } from 'vue-router';
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
          const doorNumber =  tag.door_number;
          const stringdoorNumber = doorNumber.toString();

          const readerNumber =  tag.reader_number;
          const stringreaderNumber = readerNumber.toString();
         

            const deviceName = tag.device_name ? tag.device_name.toLowerCase() : '';
            const doorName = tag.door_name ? tag.door_name.toLowerCase() : '';
            const lowercasedoorNumber = stringdoorNumber ? stringdoorNumber.toLowerCase() : '';
            const lowercasereaderNumber = stringreaderNumber ? stringreaderNumber.toLowerCase() : '';
            const readerName = tag.reader_name ? tag.reader_name.toLowerCase() : '';
           
            return (
              deviceName.includes(query) ||
              doorName.includes(query) ||
              lowercasedoorNumber.includes(query) ||
              lowercasereaderNumber.includes(query) ||
              readerName.includes(query)
                
            );
        }
        return false; // Return false for undefined employee
    });
});

// ?? Fetching Controller list
const fetchTags = (offset) => {
  axios
            .post(
                URL() + `/devices/controller_reader`,
                {
                  requestType: "view",
                    offset: offset,
                    limit: rowPerPage.value,
                    search: searchQuery.value, // Include search query in the request
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


const isNewReaderSteupVisible = ref(false)
const isUpdateReaderSteupVisible = ref(false)
const isViewReaderSteupVisible = ref(false)
const getDataReader=ref([])
const getIndex=ref('')



const updateReader = (readerData,index) => {
  //tags.value.splice(index, 1,readerData);
  i=0
  if (readerData.status == "success") {
          
          isErrorAlertVisible.value = false;
          isAlertVisible.value = true;
            // refetch location
            fetchTags(totalTags.value ? (currentPage.value - 1) * rowPerPage.value  : 0)

            message.value = readerData.message;
          console.log("Refech reader setup");
          console.log(tags);
      }

      if (readerData.status == "failed") {
          isErrorAlertVisible.value = true;
          isAlertVisible.value = false;
          fetchTags(totalTags.value ? (currentPage.value - 1) * rowPerPage.value  : 0)
          err.value = readerData.error;
          console.log("Edit reader failed");
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
                    URL() + "/devices/controller_reader",
                    {
                        requestType: "delete",
                        id: tagid,
                    },
                    { headers: { Authorization: token(), "Content-Type": "application/json" } }
                )
                .then((response) => {
                    console.log(response.data.data)
                    isErrorAlertVisible.value = false
                    isAlertVisible.value = true
                    message.value =' Reader Deleted '
                    tags.value.splice(index, 1)
                    //   this.listings = response.data;
                })
                .catch((error) => {
                    isErrorAlertVisible.value = true
                    isAlertVisible.value = false
                    err.value = error
                    console.log(error)
                });

           
        }
    };


</script>

<template>
<section v-if="$can('read', 'PEOPLE_READER')">
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
             <h3 class="title-header">{{$t('Reader')}}</h3>
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

           
           </div>
         </VCardText>	

         
          

          <VDivider />

          <VTable class="text-no-wrap">
            <!-- ?? table head -->
            <thead>
              <tr>
                <th scope="col" class="text-capitalize  ">
                  #{{$t('ID')}}
                </th>

                <th scope="col" class="text-capitalize  ">
                  {{$t('Device Name')}} 
                </th>
                <th scope="col" class="text-capitalize  ">
                 {{$t('Door Name')}}
                </th>
                <th scope="col" class="text-capitalize  ">
                  {{$t('Door Number')}}r
                </th>
                <th scope="col" class="text-capitalize  ">
                  {{$t('Reader Number')}}
                </th>
                <th scope="col" class="text-capitalize  ">
                  {{$t('Reader Name')}}
                </th>
                <th scope="col" class="text-capitalize  ">
                  {{$t('In/Out State')}}
                </th>
                
             
                <th scope="col" class="text-capitalize  ">
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
              <td>
                <!-- ?? User -->
                {{ calculateI(index) }}
          </td>

                          

                <!-- ?? Plan -->
                <td>
                  <span>{{ tag.device_name}}</span>
                </td>
                 <!-- ?? Plan -->
                 <td>
                  <span>{{ tag.door_name }}</span>
                </td>
                 <!-- ?? Plan -->
                 <td>
                  <span>{{ tag.door_number }}</span>
                </td>
                 <!-- ?? Plan -->
                 <td>
                  <span>{{ tag.reader_number }}</span>
                </td>
                <!-- ?? Plan -->
                <td>
                  <span>{{ tag.reader_name }}</span>
                </td>

                 <!-- ?? Plan -->
                 <td>
                  <span>{{ tag.inout_state }}</span>
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
                    v-if="$can('read', 'PEOPLE_READER')"
                    @click="(isViewReaderSteupVisible = true),(getDataReader=tag)"
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
                    v-if="$can('update', 'PEOPLE_READER')"
                    @click="(isUpdateReaderSteupVisible = true),(getDataReader=tag),(getIndex=index)"
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
                    v-if="$can('delete', 'PEOPLE_READER')"
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

  
    
    <!-- ?? Update  rfidpeople -->
    <UpdateReaderSteup
      v-model:isDrawerOpen="isUpdateReaderSteupVisible"
       v-bind:dataReader="getDataReader"
       @reader-data="updateReader"
       @reader-index="getIndex"
    />
      <!-- ?? View  rfidpeople -->
      <ViewReaderSteup
      v-model:isDrawerOpen="isViewReaderSteupVisible"
      v-bind:dataReader="getDataReader"
      
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
    subject: PEOPLE_READER
  </route>
