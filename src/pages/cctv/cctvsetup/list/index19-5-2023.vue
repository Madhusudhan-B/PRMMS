<script setup>
import NewCctvSteup from '@/views/apps/cctv/cctvsetup/list/NewCctvSteup.vue'

import UpdateCctvSteup from '@/views/apps/cctv/cctvsetup/list/UpdateCctvSteup.vue'

import ViewCctvSteup from '@/views/apps/cctv/cctvsetup/list/ViewCctvSteup.vue'


import {URL, token} from '@/helpers/token'
import axios from '@axios'

// const userListStore = useUserListStore()
const searchQuery = ref('')
const dateQuery = ref('')
const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const totalTags = ref(0)
const tags = ref([])
const userid = ref(1)

let i=0

// ?? Fetching users
const fetchTags = () => {
  
  axios.get(URL()+`/cctv`, { 'headers': { 'Authorization': token() } })
      .then((response) => {
       
       //   this.listings = response.data;       
       console.log(response.data.data);
       const data=response.data.data;
          const  q = searchQuery.value, d='', role = null, plan = null, status = null, perPage = rowPerPage.value, currentPage = 1 
    const queryLower = q.toLowerCase()
    let filteredTags = data.filter(tag => ((tag.device_name.toLowerCase().includes(queryLower) || tag.user_name.toLowerCase().includes(queryLower)  || tag.ip_address.toLowerCase().includes(queryLower) || tag.port.toLowerCase().includes(queryLower)) )).reverse()
 
  const totalPage = Math.ceil(filteredTags.length / perPage) ? Math.ceil(filteredTags.length / perPage) : 1
 
 
  tags.value = filteredTags
        totalPage.value = Math.ceil(filteredTags.length / perPage) ? Math.ceil(filteredTags.length / perPage) : 1
        totalTags.value =filteredTags.length
        
      })
      .catch((error) => {
          console.log(error)
      })
      
      
     
}

watchEffect(fetchTags)

// ?? watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})



const isNewCctvSteupVisible = ref(false)
const isUpdateCctvSteupVisible = ref(false)
const isViewCctvSteupVisible = ref(false)
const getData=ref([])
const getIndex=ref('')

// ?? watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// ?? Computing pagination data
const paginationData = computed(() => {
  const firstIndex = tags.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = tags.value.length + (currentPage.value - 1) * rowPerPage.value
  
  return `Showing ${ firstIndex } to ${ lastIndex } of ${ totalTags.value } entries`
})

const addCCTV = cctvData => {

tags.value.push(cctvData)

// refetch NVR
console.log('Refech NVR')
console.log(tags)
//watchEffect(fetchTags)
}


const updateNVR = (nvrData,index) => {
  //tags.value.splice(index, 1,nvrData);
  i=0
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


const deleteEvent = (tagid,index) => {
  if(confirm('are you sure, Do you want to delete this item?')){
    axios.delete(URL()+/cctv/+tagid, { 'headers': { 'Authorization': token(),  'Content-Type': 'application/json' } })
      .then((response) => {
       console.log(response.data.data)
       //   this.listings = response.data; 
      })
      .catch((error) => {
          console.log(error)
      })
    tags.value.splice(index, 1);
    //watchEffect(fetchTags)
    i=0;
  }
  
}



const opencam = () =>{
    window.open("http://admin:mudunuru123@192.168.1.232/ISAPI/Streaming/channels/102/httpPreview",'_blank','directories=0,titlebar=0,toolbar=0,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350');
 
}

const opennvr = () =>{
    window.open("http://192.168.1.230/doc/page/login.asp?_1682057745088",'_blank','directories=0,titlebar=0,toolbar=0,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350');
 
}

</script>

<template>
  <section>
    <VRow>
      

      <VCol cols="12">
      <VCard >
       

          <VDivider />

          <VCardText class="d-flex flex-wrap py-4 gap-4">
            <div
              class="me-3"
              style="width: 80px;"
            >
              <VSelect
                v-model="rowPerPage"
                density="compact"
                variant="outlined"
                :items="[10, 20, 30, 50]"
              />
            </div>
            <div
              class=""
              style="margin-left: 181px; margin-left: 72px;font-size: 24px;"
            >
              <h3 style="color: #2f2774;">CCTV Setup</h3>
            </div>
            <VSpacer />

            <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
              <!-- ?? Search  -->
              <div style="width: 10rem;">
                <VTextField
                  v-model="searchQuery"
                  placeholder="Search"
                  density="compact"
                />
              </div>

              <!-- ?? Export button -->
              <!-- <VBtn
                variant="tonal"
                color="secondary"
                prepend-icon="tabler-screen-share"
              >
                Export
              </VBtn> -->

              <!-- ?? Add user button -->
              <VBtn
                prepend-icon="tabler-plus"
                @click="isNewCctvSteupVisible = true"
              >
                New CCTV Setup
              </VBtn>
            </div>
          </VCardText>

          <VDivider />

          <VTable class="text-no-wrap">
            <!-- ?? table head -->
            <thead>
              <tr>
              <th scope="col">
                  #ID
                </th>
                <th scope="col">
                IP
                </th>
                <th scope="col">
                Port
                </th>
                <th scope="col">
               Name
                </th>
                <th scope="col">
                status
                </th>
                <th scope="col">
                Location
                </th>
                
                
                <th scope="col">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <!-- ?? table body -->
            <tbody>
              <tr
                v-for="(tag,index) in tags"
                :key="tag.id"
                style="height: 3.75rem;"
              >
                <!-- ?? User -->
                <td>
            <!--RouterLink :to="{ name: '', params: { id: tag.id } }">
              #{{i=i+1}}
            </RouterLink -->
            {{i=i+1}}
          </td>

                <!-- ?? Role -->
                <td>
                  <span class="text-capitalize text-base font-weight-semibold">{{ tag.ip_address }}</span>
                </td>

                <!-- ?? Plan -->
                <td>
                  <span class="text-capitalize text-base font-weight-semibold">{{ tag.port }}</span>
                </td>

                <td>
                <VChip
                    label
                    :color="resolveUserStatusVariant(tag.rs_type)"
                    size="small"
                    class="text-capitalize">
                  
                    {{tag.device_name}}
                  </VChip>
                  <!-- <span class="text-base">{{ user.is_active }}</span> -->
                </td>
                <!-- <td>
                  <span class="text-base">{{ tag.rs_type }}</span>
                </td> -->
                <td>

                  <span class="red-dot" variant="outlined">
                  <VTooltip
        activator="parent"
        location="top"
      >
      Last updated time
      </VTooltip></span>
               </td>
                <td>
                  <span class="text-base">{{ tag.location ? tag.location.location_description : ''  }}</span>
                </td>
               


                <!-- ?? Status -->
               
               

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
                    title="Live Stream"
                    @click="opencam"

                  >
                    <VIcon
                      size="22"
                      icon="bx-cctv"
                    

                    />
                  </VBtn>

                    <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    title="Play Back"
                    @click="opennvr"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-play"
                      @click=""
                      



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
                      icon="tabler-eye"
                      @click="(isViewCctvSteupVisible = true),(getData=tag),(getIndex=index)"
                      



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
                      icon="tabler-edit"
                      @click="(isUpdateCctvSteupVisible = true),(getData=tag),(getIndex=index)"
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
            <tfoot v-show="!tags.length">
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

            <VPagination
              v-model="currentPage"
              size="small"
              :total-visible="5"
              :length="totalPage"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- ?? Add New CCTV -->
    <NewCctvSteup
      v-model:isDrawerOpen="isNewCctvSteupVisible"
      @cctv-data="addCCTV"
    />
    <!-- ?? Update  CCTV -->
    <UpdateCctvSteup
      v-model:isDrawerOpen="isUpdateCctvSteupVisible"
       v-bind:datacctv="getData"
       @cctv-data="updateCCTV"
       @cctv-index="getIndex"
    />
      <!-- ?? View  CCTV -->
      <ViewCctvSteup
      v-model:isDrawerOpen="isViewCctvSteupVisible"
       v-bind:dataCCTV="getData"
    />
  </section>
</template>

<style lang="scss">
.red-dot {
  height: 20px;
  width: 20px;
  background-color: red;
  border-radius: 50%;
  display: inline-block;
}

.green-dot {
  height: 20px;
  width: 20px;
  background-color: green;
  border-radius: 50%;
  display: inline-block;
}
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
