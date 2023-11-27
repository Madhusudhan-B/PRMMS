
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

// const date = ref('')
const ip_address= ref('')
const reader_name= ref('')
const exception_description = ref('')



const IPAddress = ref('')
const ReaderName = ref('')
 

const isExporting = ref(false);
const DateTime = ref('')
var search = ref('')
let  i=0;
const exportSearch = ref({});
// ?? Fetching users
const fetchDailyLogin = async ( offset, search) => {
  try {

          var j = 0
          if(IPAddress.value ){
            search['ip_address']=IPAddress.value
            j = j+1
          }
          if(ReaderName.value){
            search['reader_name']=ReaderName.value
            j = j+1
          }
         

            var range = []
   
            if (DateTime.value){
            range = dateRangeValue(DateTime.value)
            }

           

            const response = await axios.post(
      URL() + `/reports/people_exception`,
      {
        requestType: "view",
        offset: offset ,
        limit: rowPerPage.value,
        start_date: range[0],
        end_date: range[1],
        searchParams: j ? search : {},
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
    fetchDailyLogin(offset, search.value);
});

watch(currentPage, () => {
    i = (currentPage.value - 1) * rowPerPage.value;
  });

const updatePage = async (newPage, newPerPage) => {
  currentPage.value = newPage;
  rowPerPage.value = newPerPage;
  await fetchDailyLogin();
};

const handlePageChange = (newPage) => {
  currentPage = newPage;
  fetchDailyLogin((newPage - 1) * rowPerPage.value); // Calculate the offset based on the new page number
};

const handlePerPageChange = (newPerPage) => {
  fetchDailyLogin(1, newPerPage);
};

const handleSearchChange = (newValue) => {
  currentPage.value = 1;
  fetchDailyLogin();
};

const paginationData = computed(() => {
  const firstIndex = totalTags.value ? (currentPage.value - 1) * rowPerPage.value + 1 : 0;
  const lastIndex = Math.min(firstIndex + rowPerPage.value - 1, totalTags.value);
  return `Showing ${firstIndex} to ${lastIndex} of ${totalTags.value} entries`;
});

 
  const searchReport = () => {
    // Create the search object
    var range = []
    i=0
    if (DateTime.value){
     range = dateRangeValue(DateTime.value)
    }
    const searchParams = {};
    if (IPAddress.value) searchParams["ip_address"] = IPAddress.value;
    if (ReaderName.value) searchParams["reader_name"] = ReaderName.value;
   
    // if (DateTime.value){
    //   searchParams['start_date'] = range[0]
    //   searchParams['end_date'] = range[1]
    // } 

      search.value=searchParams
    // Execute the fetchAlert function with the search parameters
      fetchDailyLogin(0, searchParams);

      exportSearch.value = {
    ...searchParams, // Copy the search criteria
    export: true, // Add a flag to indicate it's for exporting
  };
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
  

const exportToPDF = async () => {
  let filename = "Exception-Report.pdf";
  let element = document.getElementById('element-to-convert');

  const hiddenElements = element.querySelectorAll('.hidden-on-export');
  hiddenElements.forEach((el) => {
    el.style.display = 'block';
  });

  // Define the styles for the print
  let styles = '<style type="text/css">' +
    'table th, table td {' +
    'border: 0px  #fff;' +
    'padding: 0.5em;' +
    '}' +
    '.header-logo img {' +
    '   height: 6% !important; /* Maintain aspect ratio */' +
    '}' +
    '@page { size: A4 landscape; margin: 0.5cm; @bottom-center { content: counter(page); } }' +
    '</style>';

    
  let divContents = '<html><head>' + styles + '</head><body>' + element.innerHTML + '</body></html>';

  html2pdf(divContents, {
    margin: 0.50,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { dpi: 100, letterRendering: true },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'landscape',
    },
    pagebreak: { mode: ['avoid-all'] },
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
      'Date/Time': user.timestamp ? moment(user.timestamp, 'YYYY-MM-DD').format('YYYY-MMM-DD HH:mm') : '',
      'IP Address': user.ip_address,
      'Exception type': user.exception_type,
      'Exception Descroption': user.exception_description,
     
      'Reader Name': user.reader_name
     
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
  const fileName = 'Exception-report.xlsx';

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

<section v-if="$can('read', 'RFID_RS_ENTRY_EXIT_REPORT')">
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
        
            <VRow>
            <VCol 
                cols="12"
                sm="3"
              >
              
              
               <AppDateTimePicker
                    v-model="DateTime"
                    label="Date/Time"
                    placeholder="Date/Time"
                    :config="{ mode: 'range' }"
                   
                  />
               
              </VCol> 
              
            
              <VCol 
                cols="12"
                sm="2"
              >
              
             <VTextField
             
                  v-model="IPAddress"
                  label="IP Address"
                  placeholder="IP Address"
                /> 
              </VCol>

              <VCol 
                    cols="12"
                    sm="2"
                  >
                  <VTextField
                  v-model="ReaderName"
                  label="Reader Name"
                  placeholder="Reader Name"
                 
                />
                </VCol>
                
               
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
    
    <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

    <!-- Dialog Content -->
    <VCard title="Search Here">
      <VCardText>
        <VRow>
                
               
                
              
               
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
          </VCardText>
          <VDivider />
          <div class="text-wrap html2pdf__page-break  " id="element-to-convert" >
          <div class="hidden-on-export">
            <VRow>
          <VCol cols="6" sm="4">
            <img src="https://omp.mudunuru.com/assets/omp-logo.b14ad369.png" alt="Logo" class="header-logo" style="width: 150px; height: auto;margin-left:15px; margin-top:15px"  />
            </VCol>
            <VCol cols="6" sm="6"> 
          <h3 class="" style="color:#2f2774; margin-top:15px">RFID People Daily Login Report</h3>
          </VCol>
        </VRow>
        <div class="search-params">{{ searchParamsString }}</div>
          </div>
          <VTable>
            <!-- ?? table head -->
            <thead>
            <tr>
          
                <th scope="col" class="text-capitalize">
                  {{$t('ID')}}
                </th>
                <th scope="col" class="text-capitalize">
                 {{$t('Date/Time')}}
                </th>
                  <!-- <th scope="col">
                 {{$t('Log IN')}}
                </th> -->
                <th scope="col" class="text-capitalize">
                 {{$t('IP Address')}}
                </th>
                <th scope="col" class="text-capitalize">
                 {{$t('Reader')}}
                </th>
                <th scope="col" class="text-capitalize">
                 {{$t('Remarks')}}
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
                 {{ (currentPage - 1) * rowPerPage + index + 1 }}
                </td>
                 <!-- <td>
                  <span>{{ user.id }}</span>
                </td> -->
                <td>
                <span>{{ moment(user.timestamp, 'YYYY-MM-DDTHH:mm:ssZ').format('DD-MMM-YY HH:mm') }}</span>
                  <!-- <span >{{(user.timestamp) ? moment(user.timestamp , 'YYYY-MM-DD').format('YYYY-MMM-DD HH:mm') : ''}}</span> -->
                </td>
                 <!-- <td>
                  <span>{{user.In_Out}}</span>
                </td> -->
                <td>
                  <span>{{user.ip_address}}</span>
                </td>
                 
                <td>
                  <span>{{user.reader_name}}</span>
                </td>
                <td>
                  <span>{{user.exception_description}}</span>
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
          <div class="hidden-on-export">
            <VRow>
          <VCol cols="6" sm="4">
            <div class="header-timestamp " styles="margin-left:15px">
            Date Genarate: {{ new Date().toLocaleString() }}
          </div>
            </VCol>
            <VCol cols="6" sm="6"> 
            User:<span> {{ userData.username }}</span>
          </VCol>
        </VRow>
         
          </div>
          </div>
          <VDivider />

          <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4 py-3 px-5">
                        <span class="text-sm text-disabled">
                            {{ paginationData }}
                        </span>
              <div style="margin-left:31% !important">         
              <VSelect v-model="rowPerPage" @change="handlePerPageChange" density="compact" variant="outlined" :items="[5,10, 20, 30, 50]" />
            </div>
             
            <VPagination v-model="currentPage" @change="handlePageChange" size="small" :total-visible="10" :length="totalPage" />
                    </VCardText>
    <!-- !SECTION -->
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
    subject: RFID_RS_ENTRY_EXIT_REPORT
  </route>
