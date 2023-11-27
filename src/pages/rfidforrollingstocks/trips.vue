<script setup>
 import AddNewTripDrawer from '@/views/apps/rfidforrolloingstocks/AddNewTripDrawer.vue'
import ViewTripDrawer from '@/views/apps/rfidforrolloingstocks/ViewTripDrawer.vue'
import EditTripDrawer from '@/views/apps/rfidforrolloingstocks/EditTripDrawer.vue'
import {

  requiredValidator,
} from '@validators'
import { useUserListStore } from '@/views/apps/report/useUserListStore'
import { avatarText,formatDate } from '@core/utils/formatters'
import {URL, token} from '@/helpers/token'
import {location,departmentlist,nationalities,bloodgroups,shifttypes, shifts,getList} from '@/helpers/helper'
import axios from '@axios'
import { RouterLink } from 'vue-router'

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

const locationList=location()
 
const departmentList=departmentlist()
 const bloodgroupList=bloodgroups()
 
 const nationalityList=nationalities()
 const shifttypeList=shifttypes()
 const shiftsList=shifts()

 let i=0

const filteredTags = computed(() => {
    const query = searchQuery.value ? searchQuery.value.toLowerCase() : '';
    return tags.value.filter((tag) => {
        if (tag) {
          const tripnumber =  tag.trip_number;
          const stringtripnumber = tripnumber.toString();

          const noofLocos =  tag.no_of_locos;
          const stringnoofLocos = noofLocos.toString();

          const noofwagons =  tag.no_of_wagons;
          const stringnoofwagons = noofwagons.toString();
         

           
            const lowercasetripnumber = stringtripnumber ? stringtripnumber.toLowerCase() : '';
            const lowercasenoofLocos = stringnoofLocos ? stringnoofLocos.toLowerCase() : '';
            const lowercasenoofwagons = stringnoofwagons ? stringnoofwagons.toLowerCase() : '';
            
           
            return (
              lowercasetripnumber.includes(query) ||
              lowercasenoofLocos.includes(query) ||
              lowercasenoofwagons.includes(query)
              
                
            );
        }
        return false; // Return false for undefined employee
    });
});

// ?? Fetching users
const fetchTrips = (offset) => {
    axios.post(URL()+`/trip`,{
        
        'requestType':'view',
         'offset': offset,
         'limit':rowPerPage.value
      
      }, { 'headers': { Authorization: token() } }) 
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
        isErrorAlertVisible.value=true
        isAlertVisible.value=false
        err.value=error
        console.error(error)
          console.log(error)
      })
      
      
     
}
watch([currentPage, rowPerPage], ([newPage, newPerPage]) => {
    const offset = (newPage - 1) * newPerPage;
    fetchTrips(offset, searchQuery.value);
});

watch(currentPage, () => {
    i = (currentPage.value - 1) * rowPerPage.value;
  });

const updatePage = async (newPage, newPerPage) => {
  currentPage.value = newPage;
  rowPerPage.value = newPerPage;
  await fetchTrips();
};

const handlePageChange = (newPage) => {
  currentPage = newPage;
  fetchTrips((newPage - 1) * rowPerPage.value); // Calculate the offset based on the new page number
};

const handlePerPageChange = (newPerPage) => {
  updatePage(1, newPerPage);
};

const handleSearchChange = (newValue) => {
  currentPage.value = 1;
  fetchTrips();
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
fetchTrips();



const isAddNewTripDrawerVisible = ref(false)

//view device data
const isViewTripDrawerVisible = ref(false)


//Edi device data
const isEditTripDrawerVisible = ref(false)


const getData=ref([])
const getIndex=ref('')

const addtrip = (tripData) => {
  if (tripData.status === 'success') {
    isAlertVisible.value = true;
    isErrorAlertVisible.value = false;

    // Refetch controller data
    fetchTrips();
    message.value = tripData.message;
  }

  if (tripData.status === 'failed') {
    isErrorAlertVisible.value = true;
    isAlertVisible.value = false;
    err.value = tripData.message;
  }
};

const updateTrip= (tripData,index) => {
  if (tripData.status === 'success') {
    isAlertVisible.value = true;
    isErrorAlertVisible.value = false;

    // Refetch controller data
    fetchTrips();
    message.value = tripData.message;
  }

  if (tripData.status === 'failed') {
    isErrorAlertVisible.value = true;
    isAlertVisible.value = false;
    err.value = tripData.message;
  }
}





const deleteEvent = (tagid, index) => {
        if (confirm("are you sure, Do you want to delete this Data?")) {
            axios
                .post(
                    URL() + "/trip",
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
                    message.value = "Trip Deleted ";
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



const resolveUserStatusVariant = stat => {
  if (stat === 'pending')
    return 'warning'
  if (stat === 'active')
    return 'success'
  if (stat === 'inactive')
    return 'secondary'
  
  return 'primary'
}







</script>

<template>
  <section v-if="$can('read', 'RS_TRIPS')">
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
    <!-- ?? Alert messages   -->
    <VRow>
     
      <VCol cols="12">
        <VCard>
          <!-- ?? Filters -->
         

          <VDivider />
          <VCardText class="d-flex flex-wrap py-4 gap-4">
           
           <div>
             <h3 class="title-header">Trips List</h3>
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
                prepend-icon="tabler-plus"
                v-if="$can('create', 'RS_TRIPS')"
                @click="isAddNewTripDrawerVisible = true"
              >
                Add Trip 
              </VBtn>
           </div>
         </VCardText>	

        

          <VDivider />

          <VTable class="text-no-wrap">
            <!-- ?? table head -->
            <thead>
              <tr>
                <th scope="col" class="text-capitalize"> 
                  #S.No
                </th>
                
                <th scope="col" class="text-capitalize">
                 Trip Number
                </th>
                <th scope="col" class="text-capitalize">
                 Date
                </th>
                <th scope="col" class="text-capitalize">
                 No of Locomotives
                </th>
                <th scope="col" class="text-capitalize">
              No of Wegons
                </th>
                <th scope="col" class="text-capitalize">
                Status
                </th>
               
                
                <th scope="col" class="text-capitalize">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <!-- ?? table body -->
            <tbody>
             
              <tr
                v-for="(trip,index) in filteredTags"
                :key="trip.id"
                style="height: 3.75rem;"
              >
                
                <td>
           
                {{ calculateI(index) }}
       
          </td>
              
                 <!-- ?? Trip Number -->
              
                <td>
                <span >{{ trip.trip_number }}</span>
                    
                </td>
                 <!-- ?? Trip date -->
                 <td>
                  <span >{{ trip.trip_date }}</span>
                </td>
                 <td>
                  <span >{{ trip.no_of_locos }}</span>
                </td>
                <td>
                  <span >{{ trip.no_of_wagons }}</span>
                </td>
                <td>
                <span v-if="trip.trip_status">{{ trip.trip_status.status_name }}</span>
                <span v-else>N/A</span>
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
                    v-if="$can('read', 'RS_TRIPS')"
                    
                  >
                    <VIcon
                      size="22"
                      icon="tabler-eye"
                      @click="(isViewTripDrawerVisible = true),(getData=trip),(getIndex=index)"
                    />
                  </VBtn>
                 
                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    v-if="$can('update', 'RS_TRIPS')"
                   
                  >
                    <VIcon
                      size="22"
                      icon="tabler-edit"
                      @click="(isEditTripDrawerVisible = true),(getData=trip),(getIndex=index)"
                    />
                  </VBtn>
                 
                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    v-if="$can('delete', 'RS_TRIPS')"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-trash"
                      @click="deleteEvent(trip.id,index)"
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
    <AddNewTripDrawer
      v-model:isDrawerOpen="isAddNewTripDrawerVisible"
      @trip-data="addtrip"
    />

     <!-- ?? View  -->
     <ViewTripDrawer
      v-model:isDrawerOpen="isViewTripDrawerVisible"
      v-bind:datatrip= "getData"
     
    />

    <!-- ?? Edit  -->
    <EditTripDrawer
      v-model:isDrawerOpen="isEditTripDrawerVisible"
      v-bind:datatrip="getData"
      @trip-data="updateTrip"
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

/* .v-navigation-drawer{
  right: 0px;
    z-index: 1006;
    transform: translateX(0%);
    position: fixed;
    height: calc((100% - 0px) - 0px);
    top: 0px;
    bottom: 0px;
    width: 100% !important;
} */
</style>
<route lang="yaml">
  meta:
    action: read
    subject: RS_TRIPS
  </route>
