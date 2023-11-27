<script setup>
import AddNewControllerDrawer from '@/views/apps/rfidpeople/controllersetup/list/AddNewControlleDrawer.vue'
import ViewControlleDrawer from '@/views/apps/rfidpeople/controllersetup/list/ViewControlleDrawer.vue'
import EditControlleDrawer from '@/views/apps/rfidpeople/controllersetup/list/EditControlleDrawer.vue'

import { avatarText,formatDate } from '@core/utils/formatters'
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
const bloodgroups = ref([])
const tags = ref([])
const rtags = ref([])

// ?? Fetching users
let i=0
const filteredTags = computed(() => {
    const query = searchQuery.value ? searchQuery.value.toLowerCase() : '';
    return tags.value.filter((tag) => {
        if (tag) {
          const deviceType =  tag.device_type;
          const stringdevicetype = deviceType.toString();

          const ipAddress =  tag.ip_address;
          const stringipaddress = ipAddress.toString();

          const portAddress =  tag.port;
          const stringportAddress = portAddress.toString();


           // const locationType = tag.location ? tag.location.toLowerCase() : '';
            
            const lowercasedevicetype = stringdevicetype ? stringdevicetype.toLowerCase() : '';
            const lowercaseipAddress = stringipaddress ? stringipaddress.toLowerCase() : '';
            const lowercaseportAddress = stringportAddress ? stringportAddress.toLowerCase() : '';
           
            const deviceName = tag.device_name ? tag.device_name.toLowerCase() : '';
           
            return (
             // locationType.includes(query) ||
              lowercasedevicetype.includes(query) ||
              lowercaseipAddress.includes(query) ||
              lowercaseportAddress.includes(query) ||
              deviceName.includes(query)
                
            );
        }
        return false; // Return false for undefined employee
    });
});
const fetchController = (offset) => {
  axios
            .post(
                URL() + `/devices/controller`,
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
    fetchController(offset, searchQuery.value);
});

watch(currentPage, () => {
    i = (currentPage.value - 1) * rowPerPage.value;
  });

const updatePage = async (newPage, newPerPage) => {
  currentPage.value = newPage;
  rowPerPage.value = newPerPage;
  await fetchController();
};

const handlePageChange = (newPage) => {
  currentPage = newPage;
  fetchController((newPage - 1) * rowPerPage.value); // Calculate the offset based on the new page number
};

const handlePerPageChange = (newPerPage) => {
  updatePage(1, newPerPage);
};

const handleSearchChange = (newValue) => {
  currentPage.value = 1;
  fetchController();
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
fetchController();


const isAddNewControllerDrawerVisible = ref(false)

//view device data
const isViewControlleDrawerVisible = ref(false)


//Edi device data
const isEditControlleDrawerVisible = ref(false)


const getData=ref([])
const getIndex=ref('')



const addController = (controllerData) => {
  if (controllerData.status === 'success') {
    isAlertVisible.value = true;
    isErrorAlertVisible.value = false;

    // Refetch controller data
    fetchController();
    message.value = controllerData.message;
  }

  if (controllerData.status === 'failed') {
    isErrorAlertVisible.value = true;
    isAlertVisible.value = false;
    err.value = controllerData.message;
  }
};

const updateController= (controllerData,index) => {
  if (controllerData.status === 'success') {
    isAlertVisible.value = true;
    isErrorAlertVisible.value = false;

    // Refetch controller data
    fetchController();
    message.value = controllerData.message;
  }

  if (controllerData.status === 'failed') {
    isErrorAlertVisible.value = true;
    isAlertVisible.value = false;
    err.value = controllerData.message;
  }
}


// ?? delete an Location
const deleteEvent = (tagid, index) => {
        if (confirm("are you sure, Do you want to delete this Data?")) {
            axios
                .post(
                    URL() + "/devices/controller",
                    {
                        requestType: "delete",
                        controller_id: tagid,
                    },
                    { headers: { Authorization: token(), "Content-Type": "application/json" } }
                )
                .then((response) => {
                    console.log(response.data.data);
                    isErrorAlertVisible.value = false;
                    isAlertVisible.value = true;
                    message.value = "Controller Deleted ";
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
<section v-if="$can('read', 'SETTINGS_BLOODGROUP')">
     <!-- ?? Alert messages   -->
    <div class="alert-demo-v-model-wrapper">
    <VAlert
    v-model="isErrorAlertVisible"
    color="error"
    variant="tonal"
    dismissible
  >
    {{ err }}
  </VAlert>
  <VAlert
    v-model="isAlertVisible"
    color="success"
    variant="tonal"
    dismissible
  >
    {{ message }}
  </VAlert>
  </div>
    <VRow>
     
      <VCol cols="12">
        <VCard>
          <!-- ?? Filters -->
         

          <VDivider />
          <VCardText class="d-flex flex-wrap py-4 gap-4">
           
           <div>
             <h3 class="title-header">{{$t('Controller')}}</h3>
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
            <VBtn prepend-icon="tabler-plus" v-if="$can('create', 'SETTINGS_BLOODGROUP')" @click="isAddNewControllerDrawerVisible = true">
                                {{$t('Add Controller')}}
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
                <!-- <th scope="col">
                 Location Name
                </th> -->
                <th scope="col" class="text-capitalize">
                 {{$t('Device Name')}}
                </th>
                <th scope="col" class="text-capitalize">
                {{$t('Device Type')}}
                </th>
               
                <th scope="col" class="text-capitalize">
                {{$t('IP Address')}}
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
                v-for="(controller,index) in filteredTags"
                :key="controller.id"
                style="height: 3.75rem;"
              >
                
                <td>
           
                {{ calculateI(index) }}
           
          </td>
          <!-- <td>
                  <span >{{ controller.location.location_short_code }}</span>
                </td> -->
                <td>
                  <span >{{ controller.device_name }}</span>
                </td>
                <td>
                  <span >{{ controller.device_type }}</span>
                </td>
               
                <td>
                  <span >{{ controller.ip_address }}</span>
                </td>
                <td>
                  <span >{{ controller.port }}</span>
                </td>
                 <!-- ?? Plan -->
                
                 <!-- ?? Plan -->
                

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
                    v-if="$can('read', 'PEOPLE_CONTROLLER')"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-eye"
                      
                      @click="(isViewControlleDrawerVisible = true),(getData=controller),(getIndex=index)"
                    />
                    </VBtn>
                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    v-if="$can('update', 'PEOPLE_CONTROLLER')"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-edit"
                      
                      @click="(isEditControlleDrawerVisible = true),(getData=controller),(getIndex=index)"
                    />
                  </VBtn>

                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    v-if="$can('delete', 'PEOPLE_CONTROLLER')"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-trash"
                      @click="deleteEvent(controller.id,index)"
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
    <AddNewControllerDrawer
      v-model:isDrawerOpen="isAddNewControllerDrawerVisible"
      @controller-data="addController"
    />

     <!-- ?? View  -->
     <ViewControlleDrawer
      v-model:isDrawerOpen="isViewControlleDrawerVisible"
      v-bind:dataController= "getData"
    />

    <!-- ?? Edit  -->
    <EditControlleDrawer
      v-model:isDrawerOpen="isEditControlleDrawerVisible"
      v-bind:dataController="getData"
      @controller-data="updateController"
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
    subject: PEOPLE_CONTROLLER
  </route>

