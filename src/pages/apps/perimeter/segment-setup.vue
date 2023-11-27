<script setup>
//import AddNewLocationDrawer from '@/views/apps/perimeter/list/AddNewLocationDrawer.vue'
import AddNewSetupDrawer from '@/views/apps/perimeter/list/AddNewSetupDrawer.vue'
import ViewSetupDrawer from '@/views/apps/perimeter/list/ViewSetupDrawer.vue'
import EditSetupDrawer from '@/views/apps/perimeter/list/EditSetupDrawer.vue'
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
const totalSegments = ref(0)
const segments = ref([])


// ?? Fetching users
const fetchSegments = () => {
  
  axios.get(URL()+`/pids_device`, { 'headers': { 'Authorization':  token() } })
      .then((response) => {
       
       //   this.listings = response.data;       
       console.log(response.data.data);
       const data=response.data.data;
          const  q = searchQuery.value, d='', role = null, plan = null, status = null, perPage = 10, currentPage = 1 
    const queryLower = q.toLowerCase()
    let filteredSegments = data.filter(segment => ((segment.device_name.toLowerCase().includes(queryLower) || segment.port.toLowerCase().includes(queryLower)) )).reverse()
 
  const totalPage = Math.ceil(filteredSegments.length / perPage) ? Math.ceil(filteredSegments.length / perPage) : 1
 
 
  segments.value = filteredSegments
        totalPage.value = Math.ceil(filteredSegments.length / perPage) ? Math.ceil(filteredSegments.length / perPage) : 1
        totalSegments.value =filteredSegments.length
        
      })
      .catch((error) => {
          console.log(error)
      })
      
      
     
}

watchEffect(fetchSegments)

// ?? watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})



const isAddNewSetupDrawerVisible = ref(false)

//view device data
const isViewSetupDrawerVisible = ref(false)


//Edi device data
const isEditSetupDrawerVisible = ref(false)


const getData=ref([])
const getIndex=ref('')

// ?? watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// ?? Computing pagination data
const paginationData = computed(() => {
  const firstIndex = segments.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = segments.value.length + (currentPage.value - 1) * rowPerPage.value
  
  return `Showing ${ firstIndex } to ${ lastIndex } of ${ totalSegments.value } entries`
})

const addSegment = segmentData => {

segments.value.push(segmentData)

// refetch NVR
console.log('Refech Segments')
console.log(segments)
//watchEffect(fetchTags)
}


const addNewUser = userData => {
  userListStore.addUser(userData)

  // refetch User
  fetchSegments()
}


const deleteEvent = (tagid,index) => {
  if(confirm('are you sure, Do you want to delete this Data?')){
    axios.delete(URL()+/pids_device/+tagid, { 'headers': { 'Authorization': token(),  'Content-Type': 'application/json' } })
      .then((response) => {
       console.log(response.data.data)
       //   this.listings = response.data; 
      })
      .catch((error) => {
          console.log(error)
      })
    segments.value.splice(index, 1);
   // i=0;
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

let i=0;

const updateSegment = (segmentData,index) => {
  //tags.value.splice(index, 1,nvrData);
  i=0
}

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
                @click="isAddNewSetupDrawerVisible = true"
              >
                Add Segment Setup
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
                 Device Name
                </th>
                <th scope="col">
                  IP Address
                </th>
                <th scope="col">
               Port Number
                </th>
                <!-- <th scope="col">
                  Report display Flag
                </th>
                <th scope="col">
                  Status
                </th> -->
                
                
                <th scope="col">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <!-- ?? table body -->
            <tbody>
             
              <tr
                v-for="(segment,index) in segments"
                :key="segment.id"
                style="height: 3.75rem;"
              >
                
                <td>
            <RouterLink :to="{ name: '', params: { id: segment.id } }">
              #{{ i=i+1 }}
            </RouterLink>
          </td>
                 <!-- ?? Plan -->
                
                 <!-- ?? Plan -->
                 <td>
                  <span class="text-capitalize text-base font-weight-semibold">{{ segment.device_name }}</span>
                </td>
                <!-- </td>
                  <span class="text-capitalize text-base font-weight-semibold">{{ user.department_description }}</span>
                </td> -->
                 <!-- ?? Plan -->
                 <td>
                  <span class="text-capitalize text-base font-weight-semibold">{{ segment.ip_address }}</span>
                </td>
                <td>
                <VChip
                    label
                    :color="resolveUserStatusVariant(segment.port)"
                    size="small"
                    class="text-capitalize">
                  
                    {{segment.port}}
                  </VChip>
                  <!-- <span class="text-base">{{ user.is_active }}</span> -->
                </td>
                <!-- <td>
                 
                  <span class="text-capitalize text-base">{{ segment.port }}</span>
                </td> -->

               
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
                      
                      @click="(isViewSetupDrawerVisible = true),(getData=segment),(getIndex=index)"
                    />
                  </VBtn>
                  <!-- @click="(isViewSetupDrawerVisible = true), (getDataSetup= segment)" -->
                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-edit"
                      @click="(isEditSetupDrawerVisible = true),(getData=segment),(getIndex=index)"
                    />
                  </VBtn>
                  <!-- @click="(isEditSetupDrawerVisible = true), (editDataSetup= segment)" -->
                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-trash"
                      @click="deleteEvent(segment.id,index)"
                    />
                  </VBtn>

                 
                  </td>
              </tr>
            </tbody>

            <!-- ?? table footer  -->
            <tfoot v-show="!segments.length">
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
    <AddNewSetupDrawer
      v-model:isDrawerOpen="isAddNewSetupDrawerVisible"
      @segment-data="addSegment"
    />

     <!-- ?? View  -->
     <ViewSetupDrawer
      v-model:isDrawerOpen="isViewSetupDrawerVisible"
      v-bind:datasegment= "getData"
    />

    <!-- ?? Edit  -->
    <EditSetupDrawer
      v-model:isDrawerOpen="isEditSetupDrawerVisible"
      v-bind:datasegment="getData"
      
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
