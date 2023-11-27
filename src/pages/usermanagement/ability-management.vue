<script setup>


import {URL, token} from '@/helpers/token'

import axios from '@axios'
import { useRoute, useRouter } from 'vue-router';

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
const selectedrole = ref('role')
const selectedPlan = ref()
const selectedStatus = ref()
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalTags = ref(0)
const tags = ref([])
const rtags = ref([])
const roles=[
{
    title:'ALL',
    value:'all'
  },
  {
    title:'Role',
    value:'role'
  },
  {
    title:'User',
    value:'user'
  }
]

let i=0
const filteredTags = computed(() => {
    const query = searchQuery.value ? searchQuery.value.toLowerCase() : '';
    return tags.value.filter((tag) => {
        if (tag) {
          
         

            const accessType = tag.access_type ? tag.access_type.toLowerCase() : '';
            const roleName = tag.name ? tag.name.toLowerCase() : '';
           
           
            return (
              accessType.includes(query) ||
              roleName.includes(query) 
              
                
            );
        }
        return false; // Return false for undefined employee
    });
});

// ?? Fetching Role list
const fetchRoles = (offset) => {
  
 
   axios.post(URL()+`/abilities`,{
        
        'requestType':'view',
        'offset': offset,
        'limit':rowPerPage.value,
       // 'access_type':selectedrole.value
      
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

const handleAccessType = () =>{
  isErrorAlertVisible.value=false
        isAlertVisible.value=false
  watchEffect(fetchRoles(totalTags.value ? (currentPage.value - 1) * rowPerPage.value + 1 : 0))
}




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

 
  //rtags.value.push(roleData.data)
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

}

if(roleData.status =='failed'){
  isErrorAlertVisible.value=true
  isAlertVisible.value=false
  err.value=roleData.message
console.log('Edit Role failed')
 
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

const deleteEvent = (tagid,access_type,index) => {
  if(confirm('are you sure, Do you want to delete this item?')){
    axios.post(URL()+`/abilities`, 
    {
        requestType:'delete',
       
        searchParams:{
            access_type:access_type,
            access_id : tagid
        }
        
      },
    { 'headers': { 'Authorization': token(),  'Content-Type': 'application/json' } })
    .then((response) => {
                    console.log(response.data.data);
                    isErrorAlertVisible.value = false;
                    isAlertVisible.value = true;
                    message.value = "Ability Deleted ";
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
  
}


const  handleClick=(id,rolename)=>{
     
      const accessType = selectedrole.value; // Example value
    

      router.push({
        name: 'usermanagement-abilities-editabilities',
        query: { id, access_type: accessType, roleName: rolename}
      });
    }

    const  handleView=(id,rolename)=>{
     
     const accessType = selectedrole.value; // Example value
   

     router.push({
       name: 'usermanagement-abilities-viewabilities',
       query: { id, access_type: accessType, roleName: rolename}
     });
   }




</script>

<template>
  <section v-if="$can('read', 'UM_ABILITIES')">
  <!-- ?? Alert messages   -->
  <div class="alert-demo-v-model-wrapper">
            <VAlert v-model="isErrorAlertVisible" color="error" variant="tonal">
                {{err}}
            </VAlert>
            <VAlert v-model="isAlertVisible" color="success" variant="tonal">
                {{message}}
            </VAlert>
        </div>
        <!-- ?? Alert messages   -->
    <VRow>      

      <VCol cols="12">
      <VCard >
       

          <VDivider />
          <VCardText class="d-flex flex-wrap py-4 gap-4">
           
           <div>
             <h3 class="title-header">{{$t('Abilities')}}</h3>
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
                              v-if="$can('create', 'UM_ABILITIES')"
                                prepend-icon="tabler-plus"
                                :to="{ 
                                    action:'create',
                                    subject:'UM_ABILITIES',
                                  name: 'usermanagement-abilities-addabilities' }"
                              >
                              {{$t('Add Abilities')}} 
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
                 Access ID
                </th> -->
                <th scope="col" class="text-capitalize">
                 Access Type
                </th>
                <th scope="col" class="text-capitalize">
                 {{$t('Access Name')}}
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
                :key="tag.access_id"
                style="height: 3.75rem;"
              >
              
                <!-- ?? Role -->
                <td>
                {{ calculateI(index) }}
          </td>

                <!-- ?? Role -->
                <!-- <td>
                  <span >{{ tag.access_id }}</span>
                </td> -->

                <td>
               
                  
                    {{tag.access_type}}
                  
                  <!-- <span class="text-base">{{ Role.is_active }}</span> -->
                </td>
                <td>
                  <span >{{ tag.name }}</span>
                </td>

                <!-- <td>
                  <span class="text-base">{{ tag.rs_type }}</span>
                </td> -->
               

                <!-- ?? Actions -->
                
                <td
                  class="text-center"
                  style="width: 5rem;"
                >
                <VBtn  v-if="$can('read', 'UM_ABILITIES')" icon size="x-small" color="default" variant="text" @click="handleView(tag.access_id,tag.name)">
                                        <VIcon size="22" icon="tabler-eye" />
                                    </VBtn>
                                      <VBtn  v-if="$can('update', 'UM_ABILITIES')" icon size="x-small" color="default" variant="text" @click="handleClick(tag.access_id,tag.name)">
                                        <VIcon size="22" icon="tabler-edit" />
                                    </VBtn>
                                 
                                     <VBtn icon size="x-small" color="default" variant="text">
                                        <VIcon v-if="$can('delete', 'UM_ABILITIES')" size="22" icon="tabler-trash" @click="deleteEvent(tag.access_id,tag.access_type,index)" />
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
    subject: UM_ABILITIES
  </route>
