<script setup>
import AppDateTimePicker from '@core/components/AppDateTimePicker.vue'

import {departmentlist, readerlocationlist, shifts} from '@/helpers/helper'

import {URL, token} from '@/helpers/token'

import { avatarText,formatDate } from '@core/utils/formatters'
import { watch } from 'vue'

import { ref } from 'vue'
import * as XLSX from 'xlsx'

import moment from "moment" 

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

const date = ref('')
 /********Error variables declaration end**********/
// const userListStore = useUserListStore()
const searchQuery = ref('')

const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalTags = ref(0)
//const shifttypes = ref([])
const tags=ref([])
const rtags = ref([])
const departmentList = departmentlist()
const shiftList = shifts()


const name = ref('')
const group = ref('')
const hostname= ref('')
const ipaddress= ref('')
const current_state= ref('')


const Name = ref('')
const Group = ref('')
const HostName= ref('')
const IPAddress = ref('')
const CurrentState= ref('')


const DateTime = ref('')
var search = ref('')
let  i=0;

// ?? Fetching users
const fetchDeviceStatus = async ( offset, search) => {
  try {

          var j = 0
          if(Name.value ){
            search['name']=Name.value
            j = j+1
          }
          if(Group.value ){
            search['group']=Group.value
            j = j+1
          }
          if(HostName.value ){
            search['hostname']=HostName.value
            j = j+1
          }
          if(IPAddress.value){
            search['ipaddress']=IPAddress.value
            j = j+1
          }
          if(CurrentState.value){
            search['current_state']=currentState.value
            j = j+1
          }
        
        
  //         var range = []
   
  //  if (DateTime.value){
  //  range = dateRangeValue(DateTime.value)
  //  }
 
  const response = await axios.post(
      URL() + `/reports/device`,
      {
        requestType: "view",
                        offset: offset,
                        limit: rowPerPage.value,
                        // start_date: range[0],
                        // end_date: range[1],
                        subsystem_id:2,
                        searchParams:j ? search : {}
      },
      { headers: { Authorization: token() } }
    );

    const data = response.data.data;
    const q = searchQuery.value;
    const role = null;
    const plan = null;
    const status = null;
    const perPage = rowPerPage.value;
    const currentPage = 1;
    const queryLower = q.toLowerCase();

    rtags.value = data;
    const firstIndex = response.data.count ? (currentPage.value - 1) * rowPerPage.value + 1 : 0;
    const lastIndex = firstIndex + rowPerPage.value;
    tags.value = data;
    totalPage.value = Math.ceil(response.data.count / perPage) ? Math.ceil(response.data.count / perPage) : 1;
    totalTags.value = response.data.count;

    if (currentPage.value > totalPage.value) currentPage.value = totalPage.value;
  } catch (error) {
    isErrorAlertVisible.value = true;
    isAlertVisible.value = false;
    err.value = error;
    console.error(error);
  }
};
watch([currentPage, rowPerPage], ([newPage, newPerPage]) => {
    const offset = (newPage - 1) * newPerPage;
    fetchDeviceStatus(offset, search.value);
});
watch(currentPage, () => {
    i = (currentPage.value - 1) * rowPerPage.value;
  });
  watch(rowPerPage, (newPerPage) => {
    // Update the page when the number of rows per page changes
    handlePerPageChange(newPerPage);
  });
const updatePage = async (newPage, newPerPage) => {
  currentPage.value = newPage;
  rowPerPage.value = newPerPage;
  await fetchDeviceStatus();
};

const handlePageChange = (newPage) => {
  currentPage = newPage;
  fetchDeviceStatus((newPage - 1) * rowPerPage.value); // Calculate the offset based on the new page number
};

const handlePerPageChange = (newPerPage) => {
  currentPage = newPerPage;
  fetchDeviceStatus((newPerPage - 1) * rowPerPage.value); // Calculate the offset based on the new page number
};


const handleSearchChange = (newValue) => {
  currentPage.value = 1;
  fetchDeviceStatus();
};

const paginationData = computed(() => {
  const firstIndex = totalTags.value ? (currentPage.value - 1) * rowPerPage.value + 1 : 0;
  const lastIndex = Math.min(firstIndex + rowPerPage.value - 1, totalTags.value);
  return `Showing ${firstIndex} to ${lastIndex} of ${totalTags.value} entries`;
});

// Call fetchWorkshop to initialize data
fetchDeviceStatus();


  

 
  const searchReport = () => {
    // Create the search object
    var range = []
    i=0
    if (DateTime.value){
     range = dateRangeValue(DateTime.value)
    }
   
    const searchParams = {};
    if (name.value) searchParams["name"] = Name.value;
    if (Group.value) searchParams["group"] = Group.value;
    if (HostName.value) searchParams["hostname"] = HostName.value;
    if (IPAddress.value) searchParams["ipaddress"] = IPAddress.value;
    if (CurrentState.value) searchParams["current_state"] = CurrentState.value;
    
    
search.value=searchParams
    // Execute the fetchAlert function with the search parameters
    fetchDeviceStatus(0, searchParams);
  };
  
 

 


 const dateRangeValue = (dateRangeString) => {
  const [startDateString, endDateString] = dateRangeString.split(' to ');
  const startDate = moment(startDateString, 'YYYY-MM-DD').format('YYYY-MM-DDTHH:mm:ss');

  if (endDateString) {
    const endDate = moment(endDateString, 'YYYY-MM-DD').format('YYYY-MM-DDTHH:mm:ss');
    return [startDate, endDate];
  } else {
    // If endDateString doesn't exist, it means a single date is provided
    // In this case, set endDate to be the same as startDate, but at the end of the day
    const endDate = moment(startDate).endOf('day').format('YYYY-MM-DDTHH:mm:ss');
    return [startDate, endDate];
  }
}



const exportToPDF = () => {
  let filename = "Device-Status-Report.pdf";
  let element = document.getElementById('element-to-convert');
  const footerText = `Search Parameters: ${JSON.stringify(search.value)}`;
  
  const hiddenElements = element.querySelectorAll('.hidden-on-export');
  hiddenElements.forEach((el) => {
    el.style.display = 'block'; // or 'inline', depending on the element type
  });

  html2pdf(element, {
    margin: 0.50,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { dpi: 100, letterRendering: true },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  });

  // Restore the "hidden-on-export" class after exporting
  hiddenElements.forEach((el) => {
    el.style.display = 'none';
  });
};


const prepareDataForExport = () => {
  return tags.value.map(user => {
    return {
      'ID': i++,
      'Date/Time': user.event_time ? moment(user.event_time, 'YYYY-MM-DD').format('YYYY-MMM-DD HH:mm') : '',
      'Name': user.name,
      'Group': user.group,
      'Host Name': user.hostname,
      'IP Address': user.ipaddress,
      'Current State': user.current_state
      
    };
  });
};
const downloadXLSX = () => {
  const data = prepareDataForExport();
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const fileName = 'Device-Status-report.xlsx';

  if (navigator.msSaveBlob) {
    // For Internet Explorer and Edge
    navigator.msSaveBlob(blob, fileName);
  } else {
    // For other browsers
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
};





const exportToPRINT = () => {
  let elementToConvert = document.getElementById('element-to-convert');
  const hiddenElements = elementToConvert.querySelectorAll('.hidden-on-export');

  // Make hidden elements visible for printing
  hiddenElements.forEach((el) => {
    el.style.display = 'block'; // or 'inline', depending on the element type
  });

  // Get the HTML content of the element
  let divContents = elementToConvert.innerHTML;

  // Define the styles for the print
  let styles = '<style type="text/css">' +
        'table th, table td {' +
        'border: 1px solid #000;' +
        'padding: 0.5em;' +
        '}' +
        '.header-logo img {' +
        
        '   height: 6% !important; /* Maintain aspect ratio */' +
        '}' +
        '</style>';

  // Open a new window and write the HTML content
  let printWindow = window.open('', '', 'height=500, width=500');
  printWindow.document.write('<html><head>' + styles + '</head><body>');
  printWindow.document.write(divContents);
  printWindow.document.write('</body></html>');
  printWindow.document.close();

  // Print the content and close the print window
  printWindow.print();
  printWindow.close();

  // Hide hidden elements again after printing
  hiddenElements.forEach((el) => {
    el.style.display = 'none';
  });
};
const isDialogVisible = ref(false)
const isTooltipVisible = ref(false)



const onTextFieldKeydown = event => {
  if (event.key === 'Enter') {
    event.preventDefault();
    // Prevent the default behavior (filtering) when the "Enter" key is pressed
  }
}
</script>

<template>

<section v-if="$can('read', 'RFID_RS_DEVICE_STATUS_REPORT')">
     <!-- ?? Alert messages   -->
    <div class="alert-demo-v-model-wrapper">
    <VAlert
      v-model="isErrorAlertVisible"
      color="error"
      variant="tonal"
    >
    {{$t('err')}}
         </VAlert>
         <VAlert
      v-model="isAlertVisible"
      color="success"
      variant="tonal"
    >
    {{$t('message')}}
         </VAlert>
  </div>
    <VRow>
      
      <VCol cols="12">
       
        <VCard >
       
          <VCardText>
          <!-- <VForm @submit.prevent="() => {}"> -->
            <VRow>
           
               <!-- ?? Select Date -->
               <!-- <VCol
                cols="12"
                sm="3"
              >
              <AppDateTimePicker
                    v-model="DateTime"
                    label="Date/Time"
                    placeholder="Date/Time"
                    :config="{ mode: 'range' }"
                    density="compact"
                  />
             
              </VCol>        -->
              
              
            
              <VCol 
                cols="12"
                sm="2"
              >
              
             <VTextField
             
                  v-model="Name"
                  label=" Name"
                  placeholder=" Name"
                  density="compact"
                  @keydown="onTextFieldKeydown"
                /> 
              </VCol>

              <VCol 
                    cols="12"
                    sm="2"
                  >
                  <VTextField
                  v-model="Group"
                  label="Group"
                  placeholder="Group"
                  density="compact"
                />
                </VCol>
                <VCol 
                    cols="12"
                    sm="2"
                  >
                  <VTextField
                  v-model="HostName"
                  label="Host Name"
                  placeholder="Host Name"
                  density="compact"
                />
                </VCol>
                <!-- <VCol 
                    cols="12"
                    sm="4"
                  >
                  <VTextField
                  v-model="IPAddress"
                  label="IPAddress"
                  placeholder="IPAddress"
                  density="compact"
                />
                </VCol> -->
                <!-- <VCol 
                    cols="12"
                    sm="4"
                  >
                  <VTextField
                  v-model="CurrentState"
                  label="Current State"
                  placeholder="Current State"
                  density="compact"
                />
                </VCol>  -->
              <VRow style="margin:0px !important; ">
              <VCol
                cols="6"
                sm="3"
              >
              <VBtn color="primary" @click="searchReport">
              Submit
            </VBtn>
           
            </VCol>
           
           
            </VRow>
            <VCol
            cols="6"
            sm="1"
            >
            <VDialog
            v-model="isDialogVisible"
            max-width="600"
            style="margin-bottom:160px !important"
          >
    <!-- Dialog Activator -->
    <!-- <VTooltip location="top"> -->
          <!-- <template #activator="{ props }">
          <VBtn v-bind="props"
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                   
                   
                  >
                    <VIcon
                      size="22"
                      class="icn"
                      icon="tabler-adjustments-horizontal"
                    />
                  </VBtn>
      
    </template> -->
    <!-- <span>Tooltip on Icon</span>
    </VTooltip> -->
    

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

    <!-- Dialog Content -->
    <VCard title="Search Here">
      <VCardText>
        <VRow>
                
                  <!-- <VCol 
                    cols="12"
                    sm="4"
                  >
                  <VTextField
                  v-model="Name"
                  label="Name"
                  placeholder="Name"
                  density="compact"
                />
                </VCol>
                <VCol 
                    cols="12"
                    sm="4"
                  >
                  <VTextField
                  v-model="Group"
                  label="Group"
                  placeholder="Group"
                  density="compact"
                />
                </VCol>
                <VCol 
                    cols="12"
                    sm="4"
                  >
                  <VTextField
                  v-model="HostName"
                  label="Host Name"
                  placeholder="Host Name"
                  density="compact"
                />
                </VCol>
                <VCol 
                    cols="12"
                    sm="4"
                  >
                  <VTextField
                  v-model="IPAddress"
                  label="IPAddress"
                  placeholder="IPAddress"
                  density="compact"
                />
                </VCol>
                <VCol 
                    cols="12"
                    sm="4"
                  >
                  <VTextField
                  v-model="CurrentState"
                  label="Current State"
                  placeholder="Current State"
                  density="compact"
                />
                </VCol>  -->
                
                
              
               
        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn
          variant="tonal"
          color="secondary"
          @click="isDialogVisible = false"
        >
          Close
        </VBtn>
        <VBtn color="primary" @click="searchReport">Submit</VBtn>
      </VCardText>
    </VCard>
  </VDialog>
          </VCol>
        
          <VCol 
          cols="12"
         sm="2"
          >
          <VBtn
        color="default"
        variant="tonal"
        prepend-icon="tabler-screen-share"
        append-icon="tabler-chevron-down"
      >
        Export
        <VMenu activator="parent">
          <VList density="compact">
            <VListItem
             
            >
              <VListItemTitle @click="exportToPDF" class="cursor-pointer" >PDF</VListItemTitle>
              <VListItemTitle @click="downloadXLSX" class="cursor-pointer">XLSX</VListItemTitle>
              <!-- <VListItemTitle @click="exportToCSV" class="cursor-pointer">CSV</VListItemTitle> -->
              <VListItemTitle @click="exportToPRINT" class="cursor-pointer">Print</VListItemTitle>
            </VListItem>

           
          </VList>
        </VMenu>
      </VBtn>
        </VCol>
        
      
            </VRow>
<!-- </VForm> -->
          </VCardText>
          <VDivider />
          <div class="text-wrap html2pdf__page-break" id="element-to-convert">
          <div class="hidden-on-export">
            <VRow>
          <VCol cols="6" sm="4">
            <img src="https://omp.mudunuru.com/assets/omp-logo.b14ad369.png" alt="Logo" class="header-logo" style="width: 150px; height: auto;"  />
            </VCol>
            <VCol cols="6" sm="6"> 
          <h3 class="" style="">Rolling Stocks Device Status Report</h3>
          </VCol>
        </VRow>
          <div class="header-timestamp ">
            Date: {{ new Date().toLocaleString() }}
          </div>
          </div>
          <VTable>
            <!-- ?? table head -->
            <thead>
            <tr>
                <th scope="col" class="text-capitalize  ">
                  {{$t('ID')}}
                </th>
                <!-- <th scope="col">
                 {{$t('Date')}}
                </th> -->
                <th scope="col" class="text-capitalize  ">
                 {{$t('Name')}}
                </th>
                <th scope="col" class="text-capitalize  ">
                 {{$t('Group')}}
                </th>
                <th scope="col" class="text-capitalize  ">
                 {{$t('Host Name')}}
                </th>
                <th scope="col" class="text-capitalize  ">
                 {{$t('IP Address')}}
                </th>
                
                <th scope="col" class="text-capitalize  ">
                 {{$t('Current State')}}
                </th>
               
                
                
             
              </tr>
            </thead>
            <!-- ?? table body -->
            <tbody>
            <tr
                v-for="(user, index) in tags"
                :key="index"
                style="height: 3.75rem;"
              >
                <!-- ?? User -->
                 <!-- ?? Plan -->
                 <td>
                 {{ i=i+1 }}
                </td>
                <!-- <td>
                  <span >{{(user.event_time) ? moment(user.event_time , 'YYYY-MM-DD').format('YYYY-MMM-DD HH:mm') : ''}}</span>
                </td> -->
                <td>
                  <span >{{user.name}}</span>
                </td>
                <td>
                  <span >{{user.group}}</span>
                </td>
                <td>
                  <span >{{user.hostname}}</span>
                </td>
                 
                <td>
                  <span >{{user.ipaddress}}</span>
                </td>
                <td>
                  <span >{{user.current_state}}</span>
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
                  {{$t('No data available')}}
                </td>
              </tr>
            </tfoot>
          </VTable>
          </div>
          <VDivider />

         <!-- SECTION Pagination -->
         <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4 py-3 px-5">
                        <span class="text-sm text-disabled">
                            {{ paginationData }}
                        </span>
              <div style="margin-left:39% !important">         
              <VSelect v-model="rowPerPage" @change="handlePerPageChange" density="compact" variant="outlined" :items="[5,10, 20, 30, 50]" />
            </div>
             
            <VPagination v-model="currentPage" @change="handlePageChange" size="small" :total-visible="10" :length="totalPage" />
                    </VCardText>
    <!-- !SECTION -->
        </VCard>
      </VCol>
    </VRow>

   
  </section>
</template>

<style lang="scss">
.hidden-on-export {
  display: none;
}

.header-logo {
    max-width: 100px; /* Adjust the logo size as needed */
  }

  /* Styles for the header timestamp */
  .header-timestamp {
    font-size: 14px;
    margin-top: 10px;
  }

</style>
<route lang="yaml">
  meta:
    action: read
    subject: RFID_RS_DEVICE_STATUS_REPORT
  </route>

