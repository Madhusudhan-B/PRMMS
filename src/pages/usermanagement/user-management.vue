<script setup>

import NewUserSteup from '@/views/apps/usermanagement/usersetup/NewUserSteup.vue'

import UpdateUserSteup from '@/views/apps/usermanagement/usersetup/UpdateUserSteup.vue'

import ViewUserSteup from '@/views/apps/usermanagement/usersetup/ViewUserSteup.vue'
import { avatarText, formatDate } from "@core/utils/formatters";
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
          
         

            const userName = tag.user_name ? tag.user_name.toLowerCase() : '';
            const emailId = tag.email ? tag.email.toLowerCase() : '';
            const phoneNumber = tag.phone_number ? tag.phone_number.toLowerCase() : '';
            const department = tag.department.department_short_code ? tag.department.department_short_code.toLowerCase() : '';
            
           
            return (
              userName.includes(query) ||
              emailId.includes(query) ||
              phoneNumber.includes(query) ||
              department.includes(query) 
              
                
            );
        }
        return false; // Return false for undefined employee
    });
});

// ?? Fetching Role list
const fetchUsers = (offset) => {
  i=offset
   axios.post(URL()+`/user_management`,{        
        'requestType':'list',
        'searchParams':{},
        'offset': offset,
        'limit':rowPerPage.value
      
      }, { 'headers': { Authorization: token() } }) 
      .then((response) => {
        const data = response.data.data;
       //   this.listings = response.data;       
       const q = searchQuery.value,
                    d = "",
                    role = null,
                    plan = null,
                    status = null,
                    perPage = rowPerPage.value,
                    currentPage = 1;
                const queryLower = q.toLowerCase();

                data.forEach(obj => {
                  obj.rid=''
                  obj.access=[]
                    if(obj.access_type=='role'){
                      obj.rid=obj.role.id
                    }else{
                      obj.rid=''
                    }
                    
                    obj.access_departments.forEach(item =>{
                      console.log(item)
                     obj.access.push(item.department.id)
                    })

                    

                    })
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
      })
      
      
     
}



watch([currentPage, rowPerPage], ([newPage, newPerPage]) => {
    const offset = (newPage - 1) * newPerPage;
    fetchUsers(offset, searchQuery.value);
});

watch(currentPage, () => {
    i = (currentPage.value - 1) * rowPerPage.value;
  });

const updatePage = async (newPage, newPerPage) => {
  currentPage.value = newPage;
  rowPerPage.value = newPerPage;
  await fetchUsers();
};

const handlePageChange = (newPage) => {
  currentPage = newPage;
  fetchUsers((newPage - 1) * rowPerPage.value); // Calculate the offset based on the new page number
};

const handlePerPageChange = (newPerPage) => {
  updatePage(1, newPerPage);
};

const handleSearchChange = (newValue) => {
  currentPage.value = 1;
  fetchUsers();
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
fetchUsers();



const isNewUserSteupVisible = ref(false)
const isUpdateUserSteupVisible = ref(false)
const isViewUserSteupVisible = ref(false)
const getDataUser=ref([])
const getIndex=ref('')




const addUser= userData => {

// rtags.value.push(roleData)
//   // refetch Role
// console.log('Refech Role')
//   console.log(rtags)

  i=0
if(userData.status =='success'){
  isAlertVisible.value=true
  isErrorAlertVisible.value=false

  
  currentPage.value=1
  fetchUsers(0)


  console.log(userData)
  // refetch role
  message.value=userData.message
console.log('Refech user')
 
}

if(userData.status =='failed'){
  isErrorAlertVisible.value=true
  isAlertVisible.value=false
  err.value=userData.message
console.log('Refech user failed')
 
}

 
}

const updateUser =(userData,index) => {
  //tags.value.splice(index, 1,RoleData);
  
  i=0
if(userData.status =='success'){
  isAlertVisible.value=true
  isErrorAlertVisible.value=false
  message.value = userData.message 
  currentPage.value=1
  fetchUsers(0)
  
            console.log("Refech User");
            console.log(tags);
}

if(userData.status =='failed'){
  isErrorAlertVisible.value=true
  isAlertVisible.value=false
   
  currentPage.value=1
  fetchUsers(0)

  err.value=userData.message
console.log('Edit user failed')
 
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
                    URL() + "/user_management",
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
                    message.value = "User Deleted ";
                    
                    currentPage.value=1
                   fetchUsers(0)
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
  <section v-if="$can('read', 'UM_USERS')">
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
   <!-- ?? Search  -->
    <VRow>      

      <VCol cols="12">
      <VCard >
       

          <VDivider />

          <VCardText class="d-flex flex-wrap py-4 gap-4">
           
           <div>
             <h3 class="title-header">{{$t('Users')}}</h3>
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
            <VBtn prepend-icon="tabler-plus" v-if="$can('create', 'UM_USERS')" @click="isNewUserSteupVisible = true">
                                {{$t('Add User')}}
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
                  {{$t('Name')}} 
                </th>
                <th scope="col" class="text-capitalize">
                  {{$t('Email')}} 
                </th>
                <th scope="col" class="text-capitalize">
                 {{$t('Phone Number')}}
                </th>
                <th scope="col" class="text-capitalize">
                 {{$t('Role')}}
                </th>
                <th scope="col" class="text-capitalize">
                {{$t('Department')}}
                </th>
               
             
                <th scope="col">
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
                <div class="d-flex align-center">
                                        <VAvatar variant="tonal" class="me-3" size="38">
                                            <VImg v-if="tag.image_data " :src="tag.image_data " />
                                            <span v-else>{{ avatarText(tag.user_name ) }}</span>
                                        </VAvatar>

                                        <div class="d-flex flex-column">
                                            <h6 class="text-base">
                                                <span class="font-weight-medium user-list-name">{{ tag.user_name }} </span>
                                            </h6>
                                        </div>
                                    </div>
               
                                  </td>
                <td>
                  <span class=" text-base font-weight-semibold"> {{tag.email}}</span>
                </td>
               

                <!-- ?? Phone number -->
                <td>
                  <span >{{ tag.phone_number}}</span>
                </td>
                 <!-- ?? Role -->
                 <td>
                  <span >{{ tag.access_type =='role' ? tag.role.role_name : 'User'}}</span>
               
                 
               
                </td>
                  <!-- ?? Department -->
                  <td>
                  
                  <span >{{ tag.department.department_short_code}}</span>
               
                
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
                    v-if="$can('read', 'UM_USERS')"
                    @click="(isViewUserSteupVisible = true),(getDataUser=tag)"
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
                    v-if="$can('update', 'UM_USERS')"
                    @click="(isUpdateUserSteupVisible = true),(getDataUser=tag),(getIndex=index)"
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
                    v-if="$can('delete', 'UM_USERS')"
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
    <NewUserSteup
      v-model:isDrawerOpen="isNewUserSteupVisible"
      @user-data="addUser"
      
    />
    <!-- ?? Update  rfidpeople -->
    <UpdateUserSteup
      v-model:isDrawerOpen="isUpdateUserSteupVisible"
       v-bind:dataUser="getDataUser"
       @user-data="updateUser"
       @user-index="getIndex"
    />
      <!-- ?? View  rfidpeople -->
      <ViewUserSteup
      v-model:isDrawerOpen="isViewUserSteupVisible"
      v-bind:dataUser="getDataUser"
      
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
    subject: UM_USERS
  </route>
