
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
const alert_timestamp = ref('')
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

const RsNumber= ref('')
const RsType= ref('')
const Location = ref('')
const rs_type = ref('')
const rs_number = ref('')
const location = ref('')

const DateTime = ref('')
var search = ref('')
let  i=0;
const fetchCurrentlyPresentRS = async ( offset, search) => {
  try {

          var j = 0
          if(RsType.value ){
            search['rs_type']=RsType.value
            j = j+1
          }
          if(RsNumber.value){
            search['rs_number']=RsNumber.value
            j = j+1
          }
          if(Location.value ){
            search['Location']=Location.value
            j = j+1
          }
        
        
          
         
          const currentDate = new Date();
          const response = await axios.post(
      URL() + `/reports/rs_currently_present`,
      {
        requestType: "view",
                        offset: offset,
                        limit: rowPerPage.value,
                        query_date:DateTime.value ? moment(DateTime.value, 'YYYY-MM-DD').format('YYYY-MM-DD'): moment(currentDate , 'YYYY-MM-DD').format('YYYY-MM-DD'),
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
    fetchCurrentlyPresentRS(offset, search.value);
});
watch(currentPage, () => {
    i = (currentPage.value - 1) * rowPerPage.value;
  });
const updatePage = async (newPage, newPerPage) => {
  currentPage.value = newPage;
  rowPerPage.value = newPerPage;
  await fetchCurrentlyPresentRS();
};

const handlePageChange = (newPage) => {
  currentPage = newPage;
  fetchCurrentlyPresentRS((newPage - 1) * rowPerPage.value); // Calculate the offset based on the new page number
};

const handlePerPageChange = (newPerPage) => {
  updatePage(1, newPerPage);
};

const handleSearchChange = (newValue) => {
  currentPage.value = 1;
  fetchCurrentlyPresentRS();
};

const paginationData = computed(() => {
  const firstIndex = totalTags.value ? (currentPage.value - 1) * rowPerPage.value + 1 : 0;
  const lastIndex = Math.min(firstIndex + rowPerPage.value - 1, totalTags.value);
  return `Showing ${firstIndex} to ${lastIndex} of ${totalTags.value} entries`;
});
  

 
  const searchReport = () => {
    // Create the search object
   // var range = []
    i=0
    //  if (DateTime.value){
    //   range = dateRangeValue(DateTime.value)
    //  }
   
    const searchParams = {};
    if (RsType.value) searchParams["rs_type"] = RsType.value;
    if (RsNumber.value) searchParams["rs_number"] = RsNumber.value;
    if (Location.value) searchParams["Location"] = Location.value;
   
    
    // if (DateTime.value){
    //   searchParams['start_date'] = range[0]
    //   searchParams['end_date'] = range[1]
    // } 

search.value=searchParams
    // Execute the fetchAlert function with the search parameters
    fetchCurrentlyPresentRS(0, searchParams);
  };
  
 

 

const dateRangeValue = (dateRangeString) =>{
  
const [startDateString, endDateString] = dateRangeString.split(' to ');
const startDate = moment(startDateString, 'YYYY-MM-DD').format('YYYY-MM-DDTHH:mm:ss');

if (endDateString) {
    const endDate = moment(endDateString, 'YYYY-MM-DD').format('YYYY-MM-DDTHH:mm:ss');
    return [startDate, endDate];
  } else {
    // If endDateString doesn't exist, it means a single date is provided
    // In this case, set endDate to be the same as startDate
    return [startDate, startDate];
  }

  
// const endDate = endDateString ? moment(endDateString, 'YYYY-MM-DD').format('YYYY-MM-DDTHH:mm:ss') : startDate
// console.log(startDate); 
// console.log(endDate); 
// return [startDate, endDate]


}


const exportToPDF = () => {
  let filename = "Currently-Present-Report.pdf";
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
      'Date/Time': user.in_time ? moment(user.in_time, 'YYYY-MM-DD').format('YYYY-MMM-DD HH:mm') : '',
      'RS Type': user.rs_type,
      'RS Number': user.rs_number,
      'Location': user.Location,
      'Antenna Name': user.AntennaName,
      
      'Duration': user.Duration
    
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
  const fileName = 'Currently-Present-Location-report.xlsx';

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

const rslist=[
  {
    title:'Wagon',
    value:2,
  },
  {
    title:'Locomotive',
    value:1,
  }
]
</script>

<template>
<section v-if="$can('read', 'RFID_RS_PRESENT_REPORT')">
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
          <VForm @submit.prevent="() => {}">
            <VRow>
              
               <!-- ?? Select Date -->
              
               <VCol
                cols="12"
                sm="2"
              >
              <AppDateTimePicker
                    v-model="DateTime"
                    label="Date/Time"
                    placeholder="Date/Time"
                   
                    density="compact"
                  />
             
              </VCol>  
             
              <VCol cols="12"  sm="2">
              <VAutocomplete
                  clearable
                  v-model="RsType"
                  label="Select RS Type"
                  :rules="[requiredValidator]"
                  :items="rslist"
                />
              </VCol>
              <VCol cols="12"  sm="2">
              <VTextField
                  v-model="RsNumber"
                  label="Rs Number"
                  :rules="[requiredValidator]"
               
                />
              </VCol>
              <VCol cols="12"  sm="2">
              <VTextField
                  v-model="Location"
                  label="Location"
                  :rules="[requiredValidator]"
               
                />
              </VCol>
              <VRow style="margin:0px !important; ">
              <VCol
                cols="6"
                sm="2"
              >
              <VBtn color="primary" @click="searchReport">
              Submit
            </VBtn>
           
            </VCol>
           
           
            </VRow>
           
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
        <!-- <VCol
        
        cols="12"
        sm="2"
        class="d-flex gap-4"
      >
        
        <VBtn
          color="secondary"
          variant="tonal"
          type="reset"
          style="position: absolute !important;margin: -65px 0px 0px 685px;"
        >
          Reset
        </VBtn>
      </VCol> -->
            </VRow>
</VForm>
          </VCardText>
          <VDivider />
          <div class="text-wrap html2pdf__page-break" id="element-to-convert">
          <div class="hidden-on-export">
            <VRow>
          <VCol cols="6" sm="4">
            <img src="https://omp.mudunuru.com/assets/omp-logo.b14ad369.png" alt="Logo" class="header-logo" style="width: 150px; height: auto;"  />
            </VCol>
            <VCol cols="6" sm="6"> 
          <h3 class="" style="">Rolling Stocks Currently Present Report</h3>
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
                <th scope="col" class="text-capitalize  ">
                 {{$t('Date')}}
                </th>
                <th scope="col" class="text-capitalize  ">
                 {{$t('RS Type')}}
                </th>
                <th scope="col" class="text-capitalize  ">
                 {{$t('RS Number')}}
                </th>
                <th scope="col" class="text-capitalize  ">
                 {{$t('Location')}}
                </th>
                <th scope="col" class="text-capitalize  ">
                 {{$t('Antenna Name')}}
                </th>
                <th scope="col" class="text-capitalize  ">
                 {{$t('Duration')}}
                </th>
               
                
             
              </tr>
            </thead>
            <!-- ?? table body -->
            <tbody>
            <tr
                v-for="user in tags"
                :key="user.id"
                style="height: 3.75rem;"
              >
                <!-- ?? User -->
                 <!-- ?? Plan -->
                 <td>
                  {{i=i+1}}
                </td>
                 <!-- <td>
                  <span >{{ user.id }}</span>
                </td> -->
                <td>
                  <span >{{user.LastSeenTime}}</span>
                </td>
                <td>
                  <span >{{user.rs_type}}</span>
                </td>
                <td>
                  <span >{{user.rs_number}}</span>
                </td>
                 
                <td>
                  <span >{{user.Location}}</span>
                </td>
                <td>
                  <span >{{user.AntennaName}}</span>
                </td>
                <td>
                  <span >{{user.Duration}}</span>
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


      <!-- ?? Pagination -->
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
    subject: RFID_RS_PRESENT_REPORT
  </route>
