<script setup>

import AddNewSubmoduleDrawer from '@/views/apps/settings/list/AddNewSubmoduleDrawer.vue'

import EditSubmoduleDrawer from '@/views/apps/settings/list/EditSubmoduleDrawer.vue'

import ViewSubmoduleDrawer from '@/views/apps/settings/list/ViewSubmoduleDrawer.vue'

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
         
         

            const ShortCode = tag.short_code ? tag.short_code.toLowerCase() : '';
            const subModuleName = tag.sub_module_name ? tag.sub_module_name.toLowerCase() : '';
         
           
            return (
              ShortCode.includes(query) ||
              subModuleName.includes(query)
            
                
            );
        }
        return false; // Return false for undefined employee
    });
});
// ?? Fetching Controller list
const fetchTags = (offset) => {
 
  axios
            .post(
                URL() + `/sub_module`,
                {
                    requestType: "view",
                    offset: offset,
                    limit: rowPerPage.value,
                  
                },
                { headers: { Authorization: token() } }
            )
      .then((response) => {
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


const isAddNewSubmoduleDrawerVisible = ref(false)
const isEditSubmoduleDrawerVisible = ref(false)
const isViewSubmoduleDrawerVisible = ref(false)
const getDataSubmodule=ref([])
const getIndex=ref('')


const addSubmodule = submoduleData => {
  i=0

if (submoduleData.status == "success") {
    isAlertVisible.value = true;
    isErrorAlertVisible.value = false;

            
    watchEffect(fetchTags(totalTags.value ? (currentPage.value - 1) * rowPerPage.value + 1 : 0));

    console.log(submoduleData);
    // refetch role
    message.value = submoduleData.message;
    console.log("Refech Role");
    console.log(tags);
}

if (submoduleData.status == "failed") {
    isErrorAlertVisible.value = true;
    isAlertVisible.value = false;
    err.value = submoduleData.message;
    console.log("Refech Role failed");
}
 
}

const updateSubmodule= (submoduleData,index) => {
  //tags.value.splice(index, 1,controllerData);
  i = 0;
        if (submoduleData.status == "success") {
          
            isErrorAlertVisible.value = false;
            isAlertVisible.value = true;
              // refetch location
              message.value = submoduleData.message;
            console.log("Refech location");
            console.log(tags);
        }

        if (submoduleData.status == "failed") {
            isErrorAlertVisible.value = true;
            isAlertVisible.value = false;
            err.value = submoduleData.error;
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

// ?? delete an Location
const deleteEvent = (tagid, index) => {
        if (confirm("are you sure, Do you want to delete this Data?")) {
            axios
                .post(
                    URL() + "/sub_module",
                    {
                        requestType: "delete",
                        sub_module_id: tagid,
                    },
                    { headers: { Authorization: token(), "Content-Type": "application/json" } }
                )
                .then((response) => {
                    console.log(response.data.data);
                    isErrorAlertVisible.value = false;
                    isAlertVisible.value = true;
                    message.value = "Sub module Deleted ";
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
  <section v-if="$can('read', 'SETTINGS_SUBMODULES')">
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
             <h3 class="title-header">{{$t('Sub Module')}}</h3>
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
            <VBtn prepend-icon="tabler-plus" v-if="$can('create', 'SETTINGS_SUBMODULES')" @click="isAddNewSubmoduleDrawerVisible = true">
                                {{$t('Add Sub Module')}}
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
                  {{$t('Short Code')}}
                </th>
                <th scope="col" class="text-capitalize">
                  {{$t('Sub Module')}}
                </th>
                
                <th scope="col" class="text-capitalize">
                  {{$t('Display Priority')}}
                </th>
                <th scope="col" class="text-capitalize">
                {{$t('Access Config')}}
                </th>
                <th scope="col" class="text-capitalize">
                {{$t('Module')}}
                </th>
                <th scope="col" class="text-capitalize">
               {{$t('Status')}}
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

                <td>
                <span >{{ tag.short_code }}</span>
                
                </td>
                <td>
                  <span >{{ tag.sub_module_name }}</span>
                </td>

               
               

                <!-- ?? Plan -->
                <td>
                  <span >{{ tag.display_priority}}</span>
                </td>
                 <!-- ?? Plan -->
                
                 <td>
                  <span >{{ tag.access_config }}</span>
                </td>
                 <!-- ?? Plan -->
                 <td>
                  <span >{{ tag.module }}</span>
                </td>
                <td>
                    <VChip label :color="resolveUserStatusVariant(tag.is_active)" size="small" class="text-capitalize">
                        {{ tag.is_active ? 'Active' : 'Inactive'}}
                        </VChip>
                                    
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
                    v-if="$can('read', 'SETTINGS_SUBMODULES')"
                    @click="(isViewSubmoduleDrawerVisible = true),(getDataSubmodule=tag),(getIndex=index)"
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
                    v-if="$can('update', 'SETTINGS_SUBMODULES')"
                    @click="(isEditSubmoduleDrawerVisible = true),(getDataSubmodule=tag),(getIndex=index)"
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
                    v-if="$can('delete', 'SETTINGS_SUBMODULES')"
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
    <AddNewSubmoduleDrawer
      v-model:isDrawerOpen="isAddNewSubmoduleDrawerVisible"
      @submodule-data="addSubmodule"
      
    />
    <!-- ?? Update  rfidpeople -->
    <EditSubmoduleDrawer
      v-model:isDrawerOpen="isEditSubmoduleDrawerVisible"
       v-bind:datasubmodule="getDataSubmodule"
       @submodule-data="updateSubmodule"
       @submodule-index="getIndex"
    />
      <!-- ?? View  rfidpeople -->
      <ViewSubmoduleDrawer
      v-model:isDrawerOpen="isViewSubmoduleDrawerVisible"
      v-bind:datasubmodule="getDataSubmodule"
      
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
    subject: SETTINGS_SUBMODULES
  </route>

