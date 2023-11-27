<script setup>
import AppDateTimePicker from '@core/components/AppDateTimePicker.vue'

import {departmentlist, readerlocationlist, shifts} from '@/helpers/helper'

import {location} from '@/helpers/helper'

import {URL, token} from '@/helpers/token'

import { avatarText,formatDate } from '@core/utils/formatters'
import { watch } from 'vue'

import { ref, reactive, computed } from 'vue';
import * as XLSX from 'xlsx'

import moment from "moment" 
import image from '@images/pages/file-search.png'
import iconimage from '@images/pages/male-icon.jpg'
import axios from '@axios'

const route = useRoute();
    const router = useRouter();
    /********Error variables declaration start**********/
    const isAlertVisible = ref(false);
    const isErrorAlertVisible = ref(false);
    const err = ref("");
    const message = ref("");

    if (router.currentRoute.value.query.message_type) {
        //console.log("route redirect message");
       // console.log(router.currentRoute.value.query.message);
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

const rowPerPage = ref(10);
const currentPage = ref(1);
const totalPage = ref(1);
const totalTags = ref(0);
const tags = ref([]);
const rtags = ref([]);

const department_id= ref('')
const controller_reader_id = ref('')
const selectedDepartment= ref('')
const DepartmentList= departmentlist()
const selectedLocation= ref('')
const LocationList= readerlocationlist()
const DateTime = ref('')
var search = ref('')
let  i=0;
const image_data = ref('')

// ?? Fetching users
// const search = reactive({
//   department_id: '',
//   controller_reader_id: '',
// });



const fetchWorkshop = async ( offset, search) => {
  try {
    let j = 0;
    if (selectedDepartment.value) {
      search['department_id'] = selectedDepartment.value;
      j = j + 1;
    }
    if (selectedLocation.value) {
      search['controller_reader_id'] = selectedLocation.value;
      j = j + 1;
    }

    let range = [];
    if (DateTime.value) {
      range = dateRangeValue(DateTime.value);
    }

    const response = await axios.post(
      URL() + `/reports/people_audit`,
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
    fetchWorkshop(offset, search.value);
});
watch(currentPage, () => {
    i = (currentPage.value - 1) * rowPerPage.value;
  });
const updatePage = async (newPage, newPerPage) => {
  currentPage.value = newPage;
  rowPerPage.value = newPerPage;
  await fetchWorkshop();
};

const handlePageChange = (newPage) => {
  currentPage = newPage;
  fetchWorkshop((newPage - 1) * rowPerPage.value); // Calculate the offset based on the new page number
};

const handlePerPageChange = (newPerPage) => {
  updatePage(1, newPerPage);
};

const handleSearchChange = (newValue) => {
  currentPage.value = 1;
  fetchWorkshop();
};

const paginationData = computed(() => {
  const firstIndex = totalTags.value ? (currentPage.value - 1) * rowPerPage.value + 1 : 0;
  const lastIndex = Math.min(firstIndex + rowPerPage.value - 1, totalTags.value);
  return `Showing ${firstIndex} to ${lastIndex} of ${totalTags.value} entries`;
});

// Call fetchWorkshop to initialize data
fetchWorkshop();

  const searchReport = () => {
    // Create the search object

  //   if (!DateTime.value) {
  //   // Show an alert message indicating that the date picker is required
   
  //   alert("Please select a date range.");
  //   return;
  // }
    var range = []
    i=0
    if (DateTime.value){
     range = dateRangeValue(DateTime.value)
    }
   
    const searchParams = {};
    if (selectedDepartment.value) searchParams["department_id"] = selectedDepartment.value;
   if (selectedLocation.value) searchParams["controller_reader_id"] = selectedLocation.value;
    
   
    // if (DateTime.value){
    //   searchParams['start_date'] = range[0]
    //   searchParams['end_date'] = range[1]
    // } 

search.value=searchParams
    // Execute the fetchAlert function with the search parameters
    fetchWorkshop(0, searchParams);
  };
  
 
  fetchWorkshop(0);
 
  const dateRangeValue = (dateRangeString) => {
  const [startDateString, endDateString] = dateRangeString.split(' to ');

  const formatDateTime = (dateTime) => moment(dateTime, 'YYYY-MM-DDTHH:mm:ssZ').format('YYYY-MM-DDTHH:mm:ssZ');

  const startDate = formatDateTime(startDateString);

  if (endDateString) {
    const endDate = formatDateTime(endDateString);
    return [startDate, endDate];
  } else {
    // If endDateString doesn't exist, it means a single date is provided
    // In this case, set endDate to be the same as startDate, but at the end of the day
    const endDate = moment(startDate).endOf('day').format('YYYY-MM-DDTHH:mm:ssZ');
    return [startDate, endDate];
  }
};


const exportToPDF = () => {
  let filename = "Audit-Log-Report.pdf";
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


function downloadXLSX() {

  let element = document.getElementById('element-to-convert');

  const hiddenElements = element.querySelectorAll('.hidden-on-export');
  hiddenElements.forEach((el) => {
    el.style.display = 'block'; // or 'inline', depending on the element type
  });

  const worksheet = XLSX.utils.json_to_sheet(tags.value);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Generate an XLSX file and trigger the download
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  
  if (navigator.msSaveBlob) {
    // For Internet Explorer and Edge
    navigator.msSaveBlob(data, 'table_data.xlsx');
  } else {
    // For other browsers
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(data);
    a.href = url;
    a.download = 'Audit-Log-Report.xlsx';
    document.body.appendChild(a); // Append the link to the DOM (required for Firefox)
    a.click();
    // Remove the link from the DOM
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
      hiddenElements.forEach((el) => {
        el.style.display = 'none';
      });
}





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
// const fetchImageDetails = async (staffId, timeStamp) => {
//   try {
//     const response = await axios.post(
//       URL() + `/employee`,
//       {
//         requestType: "view",
//         staffId,
//         timeStamp,
//       },
//       { headers: { Authorization: token() } }
//     );

//     const imageData = response.data.data;
//     // Update the selectedUser object with the fetched image details
//     selectedUser.image_data = imageData;
//     // Open the dialog after fetching the image details
//     isDialogVisible.value = true;
//   } catch (error) {
//     console.error(error);
//   }
// };

const fetchImageDetails = async (id) => {
  try {
    const response = await axios.post(
      URL() + `/employee`,
      {
        requestType: "view",
        'staff_id': id,
        
      },
      { headers: { Authorization: token() } }
    );

    const data = response.data.data;
    console.log(data);
    console.log(data.image_data);
    console.log(data.staff_id)
    // Assuming this is part of a Vue component, use Vue's reactive properties
    selectedUser.image_data = data.image_data;
    console.log(selectedUser.image_data);
    // Open the dialog after fetching the image details
    isDialogVisible.value = true;
  } catch (error) {
    console.error(error);
  }
};

const selectedUser = reactive({
  staffId: '',
  staffName: '',
  accessCardNo: '',
  departmentName: '',
  readerName: '',
  timeStamp: '',
  image_data: '', // Initialize image_data property
  photo:'',
  // Add more properties as needed
});

const showImagePreview = async (user) => {
  // Set the properties directly on selectedUser instead of user.image_data


  selectedUser.staffId = user.staff_id;
  selectedUser.staffName = user.staff_name;
  selectedUser.accessCardNo = user.access_card_no;
  selectedUser.departmentName = user.department_name;
  selectedUser.readerName = user.reader_name;
  selectedUser.timeStamp = user.access_timestamp;
  selectedUser.imageData = user.image_data;
  selectedUser.photo = 'https://mudunurust.blob.core.windows.net/' + user.photo;
  console.log(user.image_data);

  // Fetch image details asynchronously
  await fetchImageDetails(user.staff_id, user.image_data);

  // Now, the selectedUser.image_data is updated, and you can display it
  // Note: You might want to remove or update the v-else condition based on your requirements
  isDialogVisible.value = true;
};

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
      <VCol cols="12" >
        <Vcard>
          <VCardText>
            <VRow>
                
              <VCol cols="12"  sm="3">
              <AppDateTimePicker
                    v-model="DateTime"
                    label="Date/Time"
                    placeholder="Date/Time"
                    :config="{ mode: 'range', enableTime: true,  dateFormat: 'Y-m-d H:i' }"
                  
                  />
              
              </VCol>
              <VCol cols="12"  sm="2">
              <VAutocomplete
              clearable
              v-model="selectedDepartment"
              label=" Department"
              :rules="[requiredValidator]"
              :items="DepartmentList"
              :menu-props="{ maxHeight: '200px' }"
                /> 
              
              </VCol>
              <VCol cols="12"  sm="2">
              <VAutocomplete
              clearable
              v-model="selectedLocation"
              label=" Readre Location"
              :rules="[requiredValidator]"
              :items="LocationList"
              :menu-props="{ maxHeight: '200px' }"
                />
              </VCol>
              <VCol
                cols="6"
                sm="2"
              >
              <VBtn color="primary" @click="searchReport">
              Submit
            </VBtn>
           
            </VCol>

            <VCol 
          cols="12"
         sm="2"
        
          >
          <!-- <VBtn
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
              <VListItemTitle @click="exportToCSV" class="cursor-pointer">CSV</VListItemTitle>
              <VListItemTitle @click="exportToPRINT" class="cursor-pointer">Print</VListItemTitle>
            </VListItem>

           
          </VList>
        </VMenu>
      </VBtn> -->
        </VCol>
            </VRow>
          </VCardText>
          </Vcard>
</VCol>


    <VRow>
      <VCol cols="12">
       
        <VCard >
       
          <VCardText>
         
            <VRow>
              
              <VRow style="margin:0px !important; ">
              
           
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
    

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

    <!-- Dialog Content -->
    <VCard title="Search Here">
      <VCardText>
        <VRow>
               
        </VRow>
      </VCardText>

    </VCard>
  </VDialog>
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
          <h3 class="" style="">RFID People Audit Log Report</h3>
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
           
            <th scope="col">
                  {{$t('ID')}}
                </th>
               
                <th scope="col" class="text-capitalize  ">
                 {{$t('Date/Time')}}
                </th>
                <th scope="col" class="text-capitalize  ">
                 {{$t('Staff ID')}}
                </th>
                
                <th scope="col" class="text-capitalize  ">
                 {{$t('Staff Name')}}
                </th>
                <th scope="col" class="text-capitalize  ">
                 {{$t('Card Number')}}
                </th>
                <th scope="col" class="text-capitalize  ">
                 {{$t('Department')}}
                </th>
                <!-- <th scope="col" class="text-capitalize  ">
                 {{$t('Door Name')}}
                </th> -->
                <th scope="col" class="text-capitalize  ">
                 {{$t('Reader Name')}}
                </th>
                <!-- <th scope="col" class="text-capitalize  ">
                 {{$t('Category')}}
                </th> -->
                <th scope="col" class="text-capitalize  ">
                 {{$t('IN/Out Status')}}
                </th>
                <th scope="col" class="text-capitalize  ">
                 {{$t('Image')}}
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
                <td>
                <span>{{ moment(user.access_timestamp, 'YYYY-MM-DDTHH:mm:ssZ').format('DD-MMM-YY HH:mm:ss') }}</span>
                <!-- <span>{{ (user.access_timestamp) ? moment(user.access_timestamp).format('YYYY-MMM-DD HH:mm') : '' }}</span> -->
                </td>
                <td>
                  <span>{{user.staff_id}}</span>
                </td>
                <td>
                  <span >{{user.staff_name}}</span>
                </td>
                <td>
                  <span >{{user.access_card_no}}</span>
                </td>
                <td>
                  <span >{{user.department_name}}</span>
                </td>
                <!-- <td>
                  <span >{{user.door_name}}</span>
                </td> -->
                <td>
                  <span >{{user.reader_name}}</span>
                </td>
                <!-- <td>
                  <span >{{user.category}}</span>
                </td> -->
                
                <td>
                  <span style="text-transform: uppercase;">{{user.in_out_state}}</span>
                </td>
                <td>
                <VDialog
    v-model="isDialogVisible"
    width="900"
  >
    <!-- Activator -->
    <template #activator="{ props }">
    <VBtn v-bind="props" color="" @click="showImagePreview(user)">
    <img
            max-width="505"
            :src="image"
            style="height: 40px; margin-bottom: 30px; object-fit: contain !important; "
          />
</VBtn>
    </template>

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

    <!-- Dialog Content -->
    <VCard title="Staff Access Report">
    <VDivider />
    <VCardText>
        <!-- ?? Form -->
        
            <VRow>
              <VCol cols="5">
              <VRow>
            <VCol cols="5">
           <span style=" font-weight: bold;"> Date/Time</span>
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{ moment(selectedUser.timeStamp, 'YYYY-MM-DDTHH:mm:ssZ').format('DD-MMM-YY HH:mm:ss') }}
              <!-- {{(selectedUser.timeStamp) ? moment(selectedUser.timeStamp , 'YYYY-MM-DD').format('YYYY-MMM-DD HH:mm') : ''}} -->
              </VCol>

              <VCol cols="5">
              <span style=" font-weight: bold;">Staff ID</span>
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{ selectedUser.staffId }}
              </VCol>

              <VCol cols="5">
              <span style=" font-weight: bold;">Staff Name</span>
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{selectedUser.staffName}}
            
              </VCol>

              <VCol cols="5">
             
              </VCol>
              <VCol cols="1">
              
              </VCol>
              <VCol cols="6"  class="think">
             
            
              </VCol>
             
              <VCol cols="12">
              <h3 style=" font-weight: bold;"> Profile Image</h3>
              <img v-if="selectedUser.image_data" :src="selectedUser.image_data" alt="User Image" />
              <img v-else :src="iconimage" alt="Default Image" style="height: 50%; margin-bottom: 30px; object-fit: contain !important; margin-left:20%" />
              </VCol>
              <!-- <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
             
              <img v-if="selectedUser.image" :src="selectedUser.image" alt="User Image" /> 
          <img v-else :src="iconimage" alt="Default Image"  style="height: 50%; margin-bottom: 30px; object-fit: contain !important; "/> 
              </VCol> -->
              
              
            </VRow>
              </VCol>
              <VCol cols="7">
              <VCard flat>
        



<VCardText>
          <!-- ?? Form -->
          
            <VRow>
            <VCol cols="5">
            <span style=" font-weight: bold;">Card Number</span>
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{selectedUser.accessCardNo}}
              </VCol>

              <VCol cols="5">
              <span style=" font-weight: bold;"> Department</span>
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{selectedUser.departmentName}}
              </VCol>

              <VCol cols="5">
              <span style=" font-weight: bold;">Reader Location</span>
              </VCol>
              <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
              {{selectedUser.readerName}}
              </VCol>
              <VCol cols="5">
             
             </VCol>
             <VCol cols="1">
             
             </VCol>
             <VCol cols="6"  class="think">
            
           
             </VCol>
             
              <VCol cols="12">
              <h3 style=" font-weight: bold;">Access Image</h3>
              <!-- <img v-if="selectedUser.photo" :src="selectedUser.photo" alt="User Image" /> -->
              <img
              v-if="selectedUser.photo && selectedUser.photo !== ''"
                :src="selectedUser.photo"
                alt="No Image"
                style="object-fit: contain; height: 13%;"
              />
              <img
                v-else
                :src="iconimage"
                alt="Default Image"
                style="height: 50%; margin-bottom: 30px; object-fit: contain !important; margin-left: 20%"
              />
              </VCol>
              <!-- <VCol cols="1">
               :
              </VCol>
              <VCol cols="6"  class="think">
             
              <img v-if="selectedUser.image" :src="selectedUser.image" alt="User Image" /> 
          <img v-else :src="iconimage" alt="Default Image"  style="height: 47%; margin-bottom: 30px; object-fit: contain !important; "/> 
              </VCol> -->
              
            </VRow>
         
        </VCardText>
      </VCard>
      <VCardText>
      <VBtn @click="isDialogVisible = false">
          Cancel
        </VBtn>
                
              </VCardText>
              </VCol>

            </VRow>
      
    </VCardText>

      <VCardText class="d-flex justify-end">
       
      </VCardText>
    </VCard>
  </VDialog>
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
              <div style="margin-left:31% !important">         
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

