<script setup>
import AddNewReaderDrawer from '@/views/apps/rfidforrolloingstocks/list/AddNewReaderDrawer.vue'
import EditReaderDrawer from '@/views/apps/rfidforrolloingstocks/list/EditReaderDrawer.vue'
import ViewReaderDrawer from '@/views/apps/rfidforrolloingstocks/list/ViewReaderDrawer.vue'
import axios from '@axios'
import {URL, token} from '@/helpers/token'

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
let i=0;
const filteredTags = computed(() => {
    const query = searchQuery.value ? searchQuery.value.toLowerCase() : '';
    return tags.value.filter((tag) => {
        if (tag) {
          const ipAddress =  tag.ip_address;
          const stringipAddress = ipAddress.toString();

          const portNumber =  tag.port;
          const stringportNumber = portNumber.toString();
         

            const hostName = tag.host_name ? tag.host_name.toLowerCase() : '';
            const readerDescription = tag.description ? tag.description.toLowerCase() : '';
            const lowercaseipAddress = stringipAddress ? stringipAddress.toLowerCase() : '';
            const lowercaseportNumber = stringportNumber ? stringportNumber.toLowerCase() : '';
            const readerLocation = tag.location.location_description ? tag.location.location_description.toLowerCase() : '';
           
            return (
              hostName.includes(query) ||
              readerDescription.includes(query) ||
              lowercaseipAddress.includes(query) ||
              lowercaseportNumber.includes(query) ||
              readerLocation.includes(query)
                
            );
        }
        return false; // Return false for undefined employee
    });
});

// ?? Fetching users
const fetchReaders = (offset) => {

  axios
            .post(
                URL() + `/devices/reader`,
                {
                    requestType: "view",
                    offset: offset,
                    limit: rowPerPage.value,
                    searchParams:{}
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
                    perPage =rowPerPage.value,
                    currentPage = 1;
                const queryLower = q.toLowerCase();
                console.log(perPage)
                tags.value = data;
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
    fetchReaders(offset, searchQuery.value);
});

watch(currentPage, () => {
    i = (currentPage.value - 1) * rowPerPage.value;
  });

const updatePage = async (newPage, newPerPage) => {
  currentPage.value = newPage;
  rowPerPage.value = newPerPage;
  await fetchReaders();
};

const handlePageChange = (newPage) => {
  currentPage = newPage;
  fetchReaders((newPage - 1) * rowPerPage.value); // Calculate the offset based on the new page number
};

const handlePerPageChange = (newPerPage) => {
  updatePage(1, newPerPage);
};

const handleSearchChange = (newValue) => {
  currentPage.value = 1;
  fetchReaders();
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
fetchReaders();

const getData=ref([])
const getIndex=ref('')


const isAddNewReaderDrawerVisible = ref(false)
const isEditReaderDrawerVisible = ref(false)
const isViewReaderDrawerVisible = ref(false)



const addNewReader = userData => {
  // userListStore.addUser(userData)

  // // refetch User
  // fetchReaders()

  i=0

if (userData.status == "success") {
    isAlertVisible.value = true;
    isErrorAlertVisible.value = false;

    watchEffect(fetchReaders(totalTags.value ? (currentPage.value - 1) * rowPerPage.value  : 0));

    console.log(userData);
    // refetch role
    message.value = userData.message;
    console.log("Refech Reader");
    console.log(readers);
}

if (userData.status == "failed") {
    isErrorAlertVisible.value = true;
    isAlertVisible.value = false;
    err.value = userData.message;
    console.log("Refech Reader failed");
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


const updateReader= (readerData,index) => {
  //readers.value.splice(index, 1,readerData);
  i = 0;
        if (readerData.status == "success") {
          
            isErrorAlertVisible.value = false;
            isAlertVisible.value = true;
              // refetch location
              watchEffect(fetchReaders(totalTags.value ? (currentPage.value - 1) * rowPerPage.value  : 0));

              message.value = readerData.message;
            console.log("Refech Reader");
            console.log(readers);
        }

        if (readerData.status == "failed") {
            isErrorAlertVisible.value = true;
            isAlertVisible.value = false;
            err.value = readerData.error;
            console.log("Edit Reader failed");
        }
}

// const addNewUser = userData => {
//   userListStore.addUser(userData)

//   // refetch User
//   fetchBloodgrous()
// }

// ?? delete an Location
const deleteEvent = (tagid, index) => {
        if (confirm("are you sure, Do you want to delete this Data?")) {
            axios
                .post(
                    URL() + "/devices/reader",
                    {
                        requestType: "delete",
                        id: tagid,
                    },
                    { headers: { Authorization: token(), "Content-Type": "application/json" } }
                )
                .then((response) => {
                    console.log(response.data.data);
                    isErrorAlertVisible.value = false;
                    isAlertVisible.value = true;
                    message.value = "reader Deleted ";
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
<section v-if="$can('read', 'RS_READER')">
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
               :items="[5,10, 20, 30, 50]"
             />
             <!-- ?? Search  -->
             <div style="width: 10rem;">
               <VTextField v-model="searchQuery" placeholder="Search" density="compact"
               />
             </div>

            <!-- ?? Add user button -->
            <VBtn
              v-if="$can('create', 'RS_READER')"
                prepend-icon="tabler-plus"
                @click="isAddNewReaderDrawerVisible = true"
              >
               {{$t('Add Reader')}}
              </VBtn>
           </div>
         </VCardText>	

        

          <VDivider />

          <VTable class="text-no-wrap">
            <!-- ?? table head -->
            <thead>
            <tr>
                <th scope="col" class="text-capitalize">
                {{$t('ID')}}
                </th>
             
                <th scope="col" class="text-capitalize">
                 {{$t('Host Name')}}
                </th>
                <th scope="col" class="text-capitalize">
                
                {{$t('Description')}}
                 </th>
                 <th scope="col" class="text-capitalize">
               
              {{$t('IP Address')}}
                </th>
                <th scope="col" class="text-capitalize">
               {{$t('Port')}}
                </th>
                <th scope="col" class="text-capitalize">
               {{('Location')}}
                </th>
                <th scope="col" class="text-capitalize">
                {{('Antenna')}}
                </th>
                
                <th scope="col" class="text-capitalize">
                  {{('Actions')}}
                </th>
              </tr>
            </thead>
            <!-- ?? table body -->
            <tbody>
              <tr
                v-for="(reader,index) in filteredTags"
                :key="reader.id"
                style="height: 3.75rem;"
              >
                <!-- ?? User -->
                <td>
                {{ calculateI(index) }}
          </td>
          <td>
                  <span >{{ reader.host_name }}</span>
                </td>
                <td>
                  <span class="text-base">{{ reader.description }}</span>
                </td>

                  <!-- ?? Billing -->
                  <td>
                  <span class="text-base">{{ reader.ip_address }}</span>
                </td>
                <!-- ?? Role -->
                <td>
                 <div class="d-flex align-center">
                    <div class="d-flex flex-column">
                      <h6 class="text-base">
                      
                          {{ reader.port }}
                       
                      </h6>
                    
                    </div>
                  </div>
              </td>

                <!-- ?? Plan -->
                <td>
                  <span >{{ reader.location.location_description }}</span>
                </td>

              
                <td
                  class="text-center"
                  style="width: 5rem;"
                >
                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    
                  >
                    <VIcon
                      size="22"
                      icon="tabler-dots-vertical"
                    />

                    <VMenu activator="parent" >
                      <VList>
                        <!-- <VListItem
                          title="View"
                          :to="{ name: 'apps-user-view-id', params: { id: user.id } }"
                        /> -->
                        <VListItem
                          title="View"
                          v-if="$can('create', 'RS_READER')"
                          :to="{ name: 'rfidforrollingstocks-reader-view-id', params: { id: reader.id } }"
                          
                        />
                      </VList>
                    </VMenu>
                  </VBtn>
                </td>
              
              
                <!-- <td>
                  <span class="text-base">{{ user.active }}</span>
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
                    v-if="$can('read', 'RS_READER')"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-eye"
                      
                      @click="(isViewReaderDrawerVisible = true),(getData=reader),(getIndex=index)"
                    />
                    </VBtn>
                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    v-if="$can('update', 'RS_READER')"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-edit"
                      
                      @click="(isEditReaderDrawerVisible = true),(getData=reader),(getIndex=index)"
                    />
                  </VBtn>

                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    v-if="$can('delete', 'RS_READER')"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-trash"
                      @click="deleteEvent(reader.id,index)"
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

    <!-- ?? Add New User -->
    <AddNewReaderDrawer
      v-model:isDrawerOpen="isAddNewReaderDrawerVisible"
      @user-data="addNewReader"
    />
         <!-- ?? View  -->
         <ViewReaderDrawer
      v-model:isDrawerOpen="isViewReaderDrawerVisible"
      v-bind:data-reader= "getData"
      
    />

    <!-- ?? Edit  -->
    <EditReaderDrawer
      v-model:isDrawerOpen="isEditReaderDrawerVisible"
      v-bind:data-reader="getData"
      @reader-data="updateReader"
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
    subject: RS_READER
  </route>
