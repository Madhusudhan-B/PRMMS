<script setup>
import AddNewDeviceDrawer from '@/views/apps/perimeter/list/AddNewDeviceDrawer.vue'
import ViewDeviceDrawer from '@/views/apps/perimeter/list/ViewDeviceDrawer.vue'
import EditDeviceDrawer from '@/views/apps/perimeter/list/EditDeviceDrawer.vue'
import { useUserListStore } from '@/views/apps/report/useUserListStore'
import { avatarText,formatDate } from '@core/utils/formatters'
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
const totalDevices = ref(0)
const devices = ref([])



// ?? Fetching users
const fetchDevices = () => {
  
  axios.get(URL()+`/pids`, { 'headers': { 'Authorization':  token() } })
      .then((response) => {
       
       //   this.listings = response.data;       
       console.log(response.data.data);
       const data=response.data.data;
          const  q = searchQuery.value, d='', role = null, plan = null, status = null, perPage = 10, currentPage = 1 
    const queryLower = q.toLowerCase()
    let filteredDevices = data.filter(device => ((device.segment_name.toLowerCase().includes(queryLower) || device.slot_name.toLowerCase().includes(queryLower)) )).reverse()
 
  const totalPage = Math.ceil(filteredDevices.length / perPage) ? Math.ceil(filteredDevices.length / perPage) : 1
 
 
  devices.value = filteredDevices
        totalPage.value = Math.ceil(filteredDevices.length / perPage) ? Math.ceil(filteredDevices.length / perPage) : 1
        totalDevicess.value =filteredDevices.length
        
      })
      .catch((error) => {
          console.log(error)
      })
      
      
     
}

watchEffect(fetchDevices)

// ?? watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})



const isAddNewDeviceDrawerVisible = ref(false)

//view device data
const isViewDeviceDrawerVisible = ref(false)

//Edi device data
const isEditDeviceDrawerVisible = ref(false)
const getData=ref([])
const getIndex=ref('')

// ?? watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// ?? Computing pagination data
const paginationData = computed(() => {
  const firstIndex = devices.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = devices.value.length + (currentPage.value - 1) * rowPerPage.value
  
  return `Showing ${ firstIndex } to ${ lastIndex } of ${ totalDevices.value } entries`
})

const addDevice = deviceData => {

devices.value.push(deviceData)

// refetch NVR
console.log('Refech Devices')
console.log(devices)
//watchEffect(fetchTags)
}


const addNewUser = userData => {
  userListStore.addUser(userData)

  // refetch User
  fetchDevices()
}

const deleteEvent = (tagid,index) => {
  if(confirm('are you sure, Do you want to delete this Data?')){
    axios.delete(URL()+/pids/+tagid, { 'headers': { 'Authorization': token(),  'Content-Type': 'application/json' } })
      .then((response) => {
       console.log(response.data.data)
       //   this.listings = response.data; 
      })
      .catch((error) => {
          console.log(error)
      })
      //location.reload()
   devices.value.splice(index+1, 1);
    i=0;
  }
}

let i=0;
</script>

<template>
  <section>
    <VRow>
     
      <VCol cols="12">
        <VCard>
          <!-- ?? Filters -->
         

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
              <VBtn
                prepend-icon="tabler-plus"
                @click="isAddNewDeviceDrawerVisible = true"
              >
                Add Device Setup
              </VBtn>

              <!-- ?? Export button -->
              <!-- <VBtn
                variant="tonal"
                color="secondary"
                prepend-icon="tabler-screen-share"
              >
                Export
              </VBtn> -->

              <!-- ?? Add user button 
              <VBtn
                prepend-icon="tabler-plus"
                @click="isAddNewUserDrawerVisible = true"
              >
                Add New User
              </VBtn>-->
            </div>
          </VCardText>

          <VDivider />

          <VTable class="text-no-wrap">
            <!-- ?? table head -->
            <thead>
              <tr>
                <th scope="col">
                  #S.No
                </th>
                <th scope="col">
                  Segment ID
                </th>
                <th scope="col">
                  Segment Name
                </th>
                <th scope="col">
                 Location
                </th>
                <th scope="col">
                  Slot Name
                </th>
               
                
                <th scope="col">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <!-- ?? table body -->
            <tbody>
             
              <tr
                v-for="(device,index) in devices"
                :key="device.id"
                style="height: 3.75rem;"
              >
                
                <td>
            <RouterLink :to="{ name: '', params: { id: device.id } }">
              #{{ i=i+1  }}
            </RouterLink>
          </td>
                 <!-- ?? Plan -->
                
                 <!-- ?? Plan -->
                 <td>
                  <span class="text-capitalize text-base font-weight-semibold">{{ device.segment_id }}</span>
                </td>
                <td>
                  <span class="text-capitalize text-base font-weight-semibold">{{ device.segment_name }}</span>
                </td> 
                 
                 <td>
                
                  <span class="text-capitalize text-base font-weight-semibold" >{{ device.location ? device.location.location_short_code : '' }}</span>

                </td>
               
                <!-- <td>
                 
                  <span class="text-capitalize text-base">{{ device.reports_search_filter }}</span>
                </td>

               

                ?? Billing --> 
                <td>
                  <span class="text-base">{{ device.slot_name }}</span>
                </td>

                <!-- <td>
                <VChip
                    label
                    :color="resolveUserStatusVariant(department.access_status)"
                    size="small"
                    class="text-capitalize">
                  
                    {{department.is_active}}
                  </VChip>
                 
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
                  >
                    <VIcon
                      size="22"
                      icon="tabler-eye"
                    
                      @click="(isViewDeviceDrawerVisible = true),(getData=device),(getIndex=index)"
                      
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
                     
                      @click="(isEditDeviceDrawerVisible = true),(getData=device),(getIndex=index)"
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
                      @click="deleteEvent(device.segment_id,index)"
                    />
                  </VBtn>

                  
                  </td>
              </tr>
            </tbody>

            <!-- ?? table footer  -->
            <tfoot v-show="!devices.length">
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

    <!-- ?? Add New User -->
    <AddNewDeviceDrawer
      v-model:isDrawerOpen="isAddNewDeviceDrawerVisible"
      @device-data="addDevice"
    />
      <!-- ?? View  -->
      <ViewDeviceDrawer
      v-model:isDrawerOpen="isViewDeviceDrawerVisible"
      v-bind:datadevice= "getData"
    />

    <!-- ?? Edit  -->
    <EditDeviceDrawer
      v-model:isDrawerOpen="isEditDeviceDrawerVisible"
      v-bind:datadevice="getData"
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
