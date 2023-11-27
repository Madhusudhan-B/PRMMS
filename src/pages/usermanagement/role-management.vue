<script setup>

import NewRoleSteup from '@/views/apps/usermanagement/rolesetup/NewRoleSteup.vue'

import UpdateRoleSteup from '@/views/apps/usermanagement/rolesetup/UpdateRoleSteup.vue'

import ViewRoleSteup from '@/views/apps/usermanagement/rolesetup/ViewRoleSteup.vue'

import {URL, token} from '@/helpers/token'
import axios from '@axios'
/********Error variables declaration start**********/
const isAlertVisible = ref(false)
const isErrorAlertVisible = ref(false)
const err = ref('')
const message = ref('')
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
         

            const shortCode = tag.short_code ? tag.short_code.toLowerCase() : '';
            const roleName = tag.role_name ? tag.role_name.toLowerCase() : '';
           
          
           
            return (
              shortCode.includes(query) ||
              roleName.includes(query) 
              
          
            );
        }
        return false; // Return false for undefined employee
    });
});

// ?? Fetching Role list
const fetchRoles = (offset) => {
 
   axios.post(URL()+`/role`,{
        
                  requestType: "view",
                    offset: offset,
                    limit: rowPerPage.value,
                    search: searchQuery.value,
      
      }, { 'headers': { Authorization: token() } }) 
      .then((response) => {
       
       //   this.listings = response.data;       
       console.log(response.data.data);
    const data=response.data.data;
    const  q = searchQuery.value, d='', role = null, plan = null, status = null, perPage = 5
    const queryLower = q.toLowerCase()
   
  
  rtags.value=data
  const firstIndex = response.data.count ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = firstIndex+rowPerPage.value
  tags.value = data
        totalPage.value = Math.ceil(response.data.count / perPage) ? Math.ceil(response.data.count / perPage) : 1
        totalTags.value =response.data.count
        
      })
      .catch((error) => {
        isErrorAlertVisible.value=true
        isAlertVisible.value=false
        err.value=error
        console.error(error)
      })
      
      
     
}




watch([currentPage, rowPerPage], ([newPage, newPerPage]) => {
    const offset = (newPage - 1) * newPerPage;
    fetchRoles(offset, searchQuery.value);
});

watch(currentPage, () => {
    i = (currentPage.value - 1) * rowPerPage.value;
  });

const updatePage = async (newPage, newPerPage) => {
  currentPage.value = newPage;
  rowPerPage.value = newPerPage;
  await fetchRoles();
};

const handlePageChange = (newPage) => {
  currentPage = newPage;
  fetchRoles((newPage - 1) * rowPerPage.value); // Calculate the offset based on the new page number
};

const handlePerPageChange = (newPerPage) => {
  updatePage(1, newPerPage);
};

const handleSearchChange = (newValue) => {
  currentPage.value = 1;
  fetchRoles();
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
fetchRoles();


const isNewRoleSteupVisible = ref(false)
const isUpdateRoleSteupVisible = ref(false)
const isViewRoleSteupVisible = ref(false)
const getDataRole=ref([])
const getIndex=ref('')




const addRole = roleData => {
i=0
// rtags.value.push(roleData)
//   // refetch Role
// console.log('Refech Role')
//   console.log(rtags)

  i=0
if(roleData.status =='success'){
  isAlertVisible.value=true
  isErrorAlertVisible.value=false

  watchEffect(fetchRoles(totalTags.value ? (currentPage.value - 1) * rowPerPage.value + 1 : 0))
  console.log(roleData)
  // refetch role
  message.value=roleData.message
console.log('Refech Role')
  console.log(rtags)
}

if(roleData.status =='failed'){
  isErrorAlertVisible.value=true
  isAlertVisible.value=false
  err.value=roleData.message
console.log('Refech Role failed')
 
}

 
}

const updateRole =(roleData,index) => {
  //tags.value.splice(index, 1,RoleData);
  
  i=0
if(roleData.status =='success'){
  isAlertVisible.value=true
  isErrorAlertVisible.value=false
  message.value=roleData.message
}

if(roleData.status =='failed'){
  isErrorAlertVisible.value=true
  isAlertVisible.value=false
  err.value=roleData.message
console.log('Edit Role failed')
watchEffect(fetchRoles(totalTags.value ? (currentPage.value - 1) * rowPerPage.value + 1 : 0))
 
}
}
const resolveRoleStatusVariant = stat => {
  if (stat === 'pending')
    return 'warning'
  if (stat === 'active')
    return 'success'
  if (stat === 'inactive')
    return 'secondary'
  
  return 'primary'
}


const resolveUserStatusVariant = (stat) => {
      
        if (stat === true) return "success";
        if (stat === false) return "secondary";

        return "primary";
    };
// ?? delete an Location
const deleteEvent = (tagid, index) => {
        if (confirm("are you sure, Do you want to delete this Data?")) {
            axios
                .post(
                    URL() + "/role",
                    {
                        requestType: "delete",
                        roleId: tagid,
                    },
                    { headers: { Authorization: token(), "Content-Type": "application/json" } }
                )
                .then((response) => {
                    console.log(response.data.data);
                    isErrorAlertVisible.value = false;
                    isAlertVisible.value = true;
                    message.value = "Role Deleted ";
                   fetchRoles(totalTags.value ? (currentPage.value - 1) * rowPerPage.value + 1 : 0)

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
  <section v-if="$can('read', 'UM_ROLES')">
     <!-- ?? Alert messages   -->
     <div class="alert-demo-v-model-wrapper">
    <VAlert
      v-model="isErrorAlertVisible"
      color="error"
      variant="tonal"
    >
   
    {{$t(err)}}
         </VAlert>
         <VAlert
      v-model="isAlertVisible"
      color="success"
      variant="tonal"
    >
   
    {{$t(message)}}
         </VAlert>
  </div>
    <!-- ?? Alert messages   -->
    <VRow>      

      <VCol cols="12">
      <VCard >
       

          <VDivider />
          <VCardText class="d-flex flex-wrap py-4 gap-4">
           
           <div>
             <h3 class="title-header">{{$t('Roles')}}</h3>
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
            <VBtn prepend-icon="tabler-plus" v-if="$can('create', 'UM_ROLES')" @click="isNewRoleSteupVisible = true">
                               
                                {{$t('Add Role')}}
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
                  {{$t('Short Name')}} 
                </th>
                <th scope="col" class="text-capitalize">
                  {{$t('Role Name')}} 
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
              
                <!-- ?? Role -->
                <td>
                {{ calculateI(index) }}
          </td>

                <!-- ?? Role -->
                <td>
                  <span >{{ tag.short_code }}</span>
                </td>

               
               

                <td>
                  <span class="text-base">{{ tag.role_name}}</span>
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
                    @click="(isViewRoleSteupVisible = true),(getDataRole=tag)"
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
                    @click="(isUpdateRoleSteupVisible = true),(getDataRole=tag)"
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
                 
                  {{$t(' No data available')}}
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
    <NewRoleSteup
      v-model:isDrawerOpen="isNewRoleSteupVisible"
      @role-data="addRole"
      
    />
    <!-- ?? Update  rfidpeople -->
    <UpdateRoleSteup
      v-model:isDrawerOpen="isUpdateRoleSteupVisible"
       v-bind:dataRole="getDataRole"
       @role-data="updateRole"
     
    />
      <!-- ?? View  rfidpeople -->
      <ViewRoleSteup
      v-model:isDrawerOpen="isViewRoleSteupVisible"
      v-bind:dataRole="getDataRole"
      
    />
  </section>
</template>

<style lang="scss">
.app-Role-search-filter {
  inline-size: 31.6rem;
}

.text-capitalize {
  text-transform: capitalize;
}

.Role-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}
</style>
<route lang="yaml">
  meta:
    action: read
    subject: UM_ROLES
  </route>
