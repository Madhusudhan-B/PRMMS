<script setup>
  import AddNewAntennaDrawer from '@/views/apps/rfidforrolloingstocks/list/AddNewAntennaDrawer.vue'
import EditAntennaDrawer from '@/views/apps/rfidforrolloingstocks/list/EditAntennaDrawer.vue'
import axios from '@axios'
import { URL, token } from '@/helpers/token'
const route = useRoute()
    const router = useRouter()
    const rowid = route.params.id
const searchQuery = ref('')
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalTags = ref(0)
const tags = ref([])
const readerName = ref('')
const locationShortCode = ref('')
const hostName = ref('')
const port = ref('')
const isLoading = ref(false)
const rowPerPageOptions = [5, 10, 20, 30, 50]
const totalPage = ref(1)
let i=0;
const tableHeaders = [
  { text: 'ID', value: 'id' },
  { text: 'Name', value: 'antenna_name' },
  { text: 'Port', value: 'antenna_port' },
  { text: 'Transmit Power', value: 'transmit_power' },
  { text: 'Actions', value: 'actions', sortable: false },
]

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

 const fetchAntennas = (id) => {
  isLoading.value = true
  axios
    .post(
      URL() + "/devices/antenna",
      {
        requestType: "view",
        // antenna_id: null, // Change this to the correct ID if needed
        offset: (currentPage.value - 1) * rowPerPage.value,
        limit: rowPerPage.value,
        searchParams:{reader:id}
        
      },
      { headers: { Authorization: token() } }
    )
    .then((response) => {
      // const data = response.data.data;

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
                console.log(perPage)
                tags.value = data;
                const firstIndex = response.data.count ? (currentPage.value - 1) * rowPerPage.value + 1 : 0;
                const lastIndex = firstIndex + rowPerPage.value;
                tags.value = data;
                totalPage.value = Math.ceil(response.data.count / perPage) ? Math.ceil(response.data.count / perPage) : 1;
                totalTags.value = response.data.count;

      if (data ) {
        // Extract data and assign to variables
        readerName.value = data.reader.reader_name || '';
        locationShortCode.value = data.reader.location ? data.reader.location.location_short_code || '' : '';
        hostName.value = data.reader.host_name || '';
        port.value = data.reader.port || '';
      } else {
        // Handle the case where the expected data is not available
        readerName.value = '';
        locationShortCode.value = '';
        hostName.value = '';
        port.value = '';
      }

      // Extract tags data
      tags.value = data.antennas || [];

      // Update pagination values
      totalAntennas.value = data.count || 0;
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      isLoading.value = false
    });
};
watchEffect(fetchAntennas(totalTags.value ? (currentPage.value - 1) * rowPerPage.value  : 0));

// ?? watching current page

fetchAntennas(rowid)

// ?? watching current page
watchEffect(() => {
  fetchAntennas(totalTags.value ? (currentPage.value - 1) * rowPerPage.value : 0)

    if (currentPage.value > totalPage.value) currentPage.value = totalPage.value
});

// ?? Computing pagination data
const paginationData = computed(() => {
    const firstIndex = totalTags.value ? (currentPage.value - 1) * rowPerPage.value : 1;
    const lastIndex = firstIndex + tags.value.length;
    i = firstIndex;
    return `Showing ${firstIndex} to ${lastIndex} of ${totalTags.value} entries`;
});



const isAddNewAntennaDrawerVisible = ref(false);
const isEditAntennaDrawerVisible = ref(false);
const getuserData = ref([]);
const getIndex = ref('');

const deleteEvent = (tagid, index) => {
  if (confirm('Are you sure you want to delete this item?')) {
    axios
      .post(
        URL() + "/devices/antenna",
        {
          requestType: "delete",
          antenna_id: tagid,
        },
        { headers: { Authorization: token(), "Content-Type": "application/json" } }
      )
      .then((response) => {
        // Handle success and update UI as needed
      })
      .catch((error) => {
        console.log(error);
        // Handle error and update UI as needed
      });
  }
};
</script>

<template>

  <VRow  >
    

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
                :items="[5,10, 20, 30, 50]"
              />
            </div>

            <div
              class=""
              style="margin-left: 65px;font-size: 15px;padding-top: 10px;">
              <h3 style="color: #2f2774;">Antenna Details</h3>
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
                @click="isAddNewAntennaDrawerVisible = true"
              >
                Add Antenna
              </VBtn>
            </div>
          </VCardText>

          <VDivider />

          <VTable class="text-no-wrap">
    <!-- ?? table head -->
    <thead>
      <tr>
        <th scope="col">ID</th>
        <th scope="col">NAME</th>
        <th scope="col">PORT</th>
        <th scope="col">TRANSMIT POWER</th>
        <th scope="col">ACTIONS</th>
      </tr>
    </thead>
    <!-- ?? table body -->
    <tbody>
      <tr
        v-for="(antenna, index) in tags"
        :key="antenna.id"
        style="height: 3.75rem;"
      >
        <!-- Display antenna data -->
        <td>
          {{ i=i+1 }}
        </td>
        <td>
          <span class="text-capitalize text-base font-weight-semibold">{{ antenna.antenna_name }}</span>
        </td>
        <td>{{ antenna.antenna_port }}</td>
        <td>{{ antenna.transmit_power }}</td>
        <td class="text-center" style="width: 5rem;">
          <VBtn icon size="x-small" color="default" variant="text">
            <VIcon
              size="22"
              icon="tabler-edit"
              @click="(isEditAntennaDrawerVisible = true),(getuserData=antenna),(getIndex=index)"
            />
          </VBtn>
          <VBtn icon size="x-small" color="default" variant="text">
            <VIcon
              size="22"
              icon="tabler-trash"
              @click="deleteEvent(antenna.id, index)"
            />
          </VBtn>
        </td>
      </tr>
    </tbody>

    <!-- ?? table footer  -->
    <tfoot v-show="!tags.length">
      <tr>
        <td colspan="7" class="text-center">No data available</td>
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
    
    <!-- <VCol cols="12" md="6">
                        
                        <VBtn
                 
                  :to="{ name: 'rfidforrollingstocks-rolling-stocks-reader' }"
                  color="secondary"
                 
                >
                Back
                </VBtn>
                           
                      
                    </VCol> -->
                            
              
      
  </VRow>
  <AddNewAntennaDrawer
      v-model:isDrawerOpen="isAddNewAntennaDrawerVisible"
      @user-data="getuserData"
    />
    <EditAntennaDrawer
      v-model:isDrawerOpen="isEditAntennaDrawerVisible"
      v-bind:dataantenna="getuserData"
      @antenna-data="updateAntenna"
    />
</template>
<route lang="yaml">
  meta:
    action: create
    subject: RS_READER
  </route>
