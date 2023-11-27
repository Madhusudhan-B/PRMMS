<script setup>
import AddNewNationalityDrawer from '@/views/apps/settings/list/AddNewNationalityDrawer.vue'
import ViewNationalityDrawer from '@/views/apps/settings/list/ViewNationalityDrawer.vue'
import EditNationalityDrawer from '@/views/apps/settings/list/EditNationalityDrawer.vue'

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
const tags = ref([])
const rtags = ref([])

let i=0;
const filteredTags = computed(() => {
    const query = searchQuery.value ? searchQuery.value.toLowerCase() : '';
    return tags.value.filter((tag) => {
        if (tag) {
         
         

            const shiftType = tag.shift_type_description ? tag.shift_type_description.toLowerCase() : '';
           
         
           
            return (
              shiftType.includes(query) 
             
            
                
            );
        }
        return false; // Return false for undefined employee
    });
});
// ?? Fetching users
const fetchTags = (offset) => {
  axios
            .post(
                URL() + `/nationality`,
                {
                    requestType: "view",
                    offset: offset,
                    limit: rowPerPage.value,
                  
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
                    perPage = 5,
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




const isAddNewNationalityDrawerVisible = ref(false)

//view device data
const isViewNationalityDrawerVisible = ref(false)


//Edi device data
const isEditNationalityDrawerVisible = ref(false)


const getData=ref([])
const getIndex=ref('')



const addNationality = nationalityData => {
  i=0

if (nationalityData.status == "success") {
    isAlertVisible.value = true;
    isErrorAlertVisible.value = false;

    
watchEffect(fetchNationalitys(totalTags.value ? (currentPage.value - 1) * rowPerPage.value + 1 : 0));

    console.log(nationalityData);
    // refetch role
    message.value = nationalityData.message;
    console.log("Refech Role");
    console.log(tags);
}

if (nationalityData.status == "failed") {
    isErrorAlertVisible.value = true;
    isAlertVisible.value = false;
    err.value = nationalityData.message;
    console.log("Refech Role failed");
}
}


// ?? delete an Location
const deleteEvent = (tagid, index) => {
        if (confirm("are you sure, Do you want to delete this Data?")) {
            axios
                .post(
                    URL() + "/nationality",
                    {
                        requestType: "delete",
                        nationality_id: tagid,
                    },
                    { headers: { Authorization: token(), "Content-Type": "application/json" } }
                )
                .then((response) => {
                    console.log(response.data.data);
                    isErrorAlertVisible.value = false;
                    isAlertVisible.value = true;
                    message.value = "Nationality Deleted ";
                    watchEffect(fetchNationalitys(totalTags.value ? (currentPage.value - 1) * rowPerPage.value + 1 : 0));

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
<section v-if="$can('read', 'SETTINGS_NATIONALITY')">
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
        <VCard>
          <!-- ?? Filters -->
         

          <VDivider />
          <VCardText class="d-flex flex-wrap py-4 gap-4">
           
           <div>
             <h3 class="title-header">{{$t('Nationality')}}</h3>
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
            <VBtn prepend-icon="tabler-plus" v-if="$can('create', 'SETTINGS_NATIONALITY')" @click="isAddNewNationalityDrawerVisible = true">
                                {{$t('Add Nationality')}}
                            </VBtn>
           </div>
         </VCardText>	



          <VDivider />

          <VTable class="text-no-wrap">
            <!-- ?? table head -->
            <thead>
              <tr>
                <th scope="col" class="text-capitalize">
                  #{{('ID')}}
                </th>
                <th scope="col" class="text-capitalize">
                {{$t('Nationality')}}
                </th>
                
                
                <th scope="col" class="text-capitalize">
                  {{$t('Actions')}}
                </th>
              </tr>
            </thead>
            <!-- ?? table body -->
            <tbody>
             
              <tr
                v-for="nationality in filteredTags"
                :key="nationality.id"
                style="height: 3.75rem;"
              >
                
                <td>
                <span >  {{ calculateI(index) }}</span>
              
            
          </td>
        
                 <td>
                  <span >{{ nationality.nationality_name }}</span>
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
                    v-if="$can('read', 'SETTINGS_NATIONALITY')"

                  >
                    <VIcon
                      size="22"
                      icon="tabler-eye"
                      @click="(isViewNationalityDrawerVisible = true),(getData=nationality),(getIndex=index)"
                    />
                  </VBtn>
                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    v-if="$can('update', 'SETTINGS_NATIONALITY')"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-edit"
                      @click="(isEditNationalityDrawerVisible = true),(getData=nationality),(getIndex=index)"
                    />
                  </VBtn>

                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    v-if="$can('delete', 'SETTINGS_NATIONALITY')"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-trash"
                      @click="deleteEvent(nationality.id,index)"
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

   
    <AddNewNationalityDrawer
      v-model:isDrawerOpen="isAddNewNationalityDrawerVisible"
      @nationality-data="addNationality"
    />

     <!-- ?? View  -->
     <ViewNationalityDrawer
      v-model:isDrawerOpen="isViewNationalityDrawerVisible"
      v-bind:datanationality= "getData"
    />

    <!-- ?? Edit  -->
    <EditNationalityDrawer
      v-model:isDrawerOpen="isEditNationalityDrawerVisible"
      v-bind:datanationality="getData"
      @natinality-data="updateModule"
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
    subject: SETTINGS_NATIONALITY
  </route>
