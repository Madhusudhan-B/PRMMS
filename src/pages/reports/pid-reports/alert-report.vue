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
const length = ref('')
const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const totalTags = ref(0)
//const shifttypes = ref([])
const tags=ref([])
const rtags = ref([])
const departmentList = departmentlist()
const shiftList = shifts()
const host_name = ref('')
const alert_type= ref('')
const alert_description= ref('')
const location_name = ref('')
const ip_address = ref('')
const alert_timestamp = ref('')
const HostName= ref('')
const IPaddress = ref('')
const AlertType = ref('')
// const AlertDescription = ref('')
const LocationName = ref('')
const DateTime = ref('')
var search = ref('')
let  i=0;

// ?? Fetching users
const fetchAlert = (offset, search) => {
          var j = 0
          if(HostName.value ){
            search['host_name']=HostName.value
            j = j+1
          }
          if(IPaddress.value){
            search['ip_address']=IPaddress.value
            j = j+1
          }
          if(AlertType.value ){
            search['alert_type']=AlertType.value
            j = j+1
          }
        
          if(LocationName.value ){
            search['location_name']=LocationName.value
            j = j+1
          }
          if (DateTime.value){

            var range = []
          
            if (DateTime.value){
            range = dateRangeValue(DateTime.value)
            }

              search['start_date'] = range[0]
              search['end_date'] = range[1]
              j= j+1
            }   
 
          axios
                .post(
                    URL() + `/reports/alert`,
                    {
                        requestType: "view",
                        offset: offset,
                        limit: rowPerPage.value,
                        source_module:"PID",
                        searchParams:j ? search : {}
                    },
                    { headers: { Authorization: token() } }
                )
  
          .then((response) => {
       
          //   this.listings = response.data;       
          console.log(response.data);
                const data = response.data.data;
                const q = searchQuery.value,
                    d = "",
                    role = null,
                    plan = null,
                    status = null,
                    perPage = rowPerPage.value,
                    currentPage = 1;
                const queryLower = q.toLowerCase();

                rtags.value = data;
                const firstIndex = response.data.count ? (currentPage.value - 1) * rowPerPage.value + 1 : 0;
                const lastIndex = firstIndex + rowPerPage.value;
                tags.value = data;
                totalPage.value = Math.ceil(response.data.count / perPage) ? Math.ceil(response.data.count / perPage) : 1;
                totalTags.value = response.data.count;
              
                if (currentPage.value > totalPage.value) currentPage.value = totalPage.value
      })
      .catch((error) => {
        isErrorAlertVisible.value = true;
                isAlertVisible.value = false;
                err.value = error;
                console.error(error);
                console.log(error);
      })
      
}
watch([currentPage, rowPerPage], ([newPage, newPerPage]) => {
    const offset = (newPage - 1) * newPerPage;
    fetchAlert(offset, search.value);
});

// ?? Watching changes to the search object
watch(search, (newValue) => {
    // Reset currentPage to 1 when search changes
    currentPage.value = 1;
    fetchAlert(0, newValue);
});

watchEffect(fetchAlert(totalTags.value ? (currentPage.value - 1) * rowPerPage.value + 1 : 0),search.value)


  watchEffect(() => {
    fetchAlert(totalTags.value ? (currentPage.value - 1) * rowPerPage.value : 0, search.value)

    if (currentPage.value > totalPage.value) currentPage.value = totalPage.value
});

// watchEffect(fetchAlert(totalTags.value ? (currentPage.value - 1) * rowPerPage.value + 1 : 0));

// ?? watching current page

// watchEffect(() => {
//     fetchAlert();
//     if (currentPage.value > totalPage.value) currentPage.value = totalPage.value;
//   });
// ?? watching current page
// watchEffect(() => {
//    fetchAlert(totalTags.value ? (currentPage.value - 1) * rowPerPage.value : 0);

//   if (currentPage.value > totalPage.value) currentPage.value = totalPage.value;
// });

// ?? Computing pagination data
const paginationData = computed(() => {
    const firstIndex = totalTags.value ? (currentPage.value - 1) * rowPerPage.value : 1
    const lastIndex = firstIndex + tags.value.length
    i = firstIndex
    return `Showing ${firstIndex} to ${lastIndex} of ${totalTags.value} entries`
    
})


  

 
  const searchReport = () => {
    // Create the search object
    var range = []
    i=0
    if (DateTime.value){
     range = dateRangeValue(DateTime.value)
    }
   
    const searchParams = {};
    if (HostName.value) searchParams["host_name"] = HostName.value;
    if (IPaddress.value) searchParams["ip_address"] = IPaddress.value;
    if (AlertType.value) searchParams["alert_type"] = AlertType.value;
    if (LocationName.value) searchParams["location_name"] = LocationName.value;
    if (DateTime.value){
      searchParams['start_date'] = range[0]
      searchParams['end_date'] = range[1]
    } 

search.value=searchParams
    // Execute the fetchAlert function with the search parameters
    fetchAlert(0, searchParams);
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


const exportToPDF = ()=>{


  let filename = "PID-alert-report.pdf";
let element = document.getElementById('element-to-convert');

html2pdf(element, {
		margin:       0.25,
		filename:     filename,
		image:        { type: 'jpeg', quality: 0.98 },
		html2canvas:  { dpi: 96, letterRendering: true },
		jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
	  });


 
}

function downloadXLSX() {
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
    a.download = 'PID-alert-report.xlsx';
    document.body.appendChild(a); // Append the link to the DOM (required for Firefox)
    a.click();
    // Remove the link from the DOM
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}

// const exportToCSV = ()=>{
//   let filename = "Alert.CSV";
// let element = document.getElementById('element-to-convert');

// html2csv(element, {
// 		margin:       0.25,
// 		filename:     filename,
// 		image:        { type: 'jpeg', quality: 0.98 },
// 		html2canvas:  { dpi: 96, letterRendering: true },
// 		jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
// 	  });
  
//   html2csv(document.getElementById('element-to-convert'),{
//     margin: 1,
//   	filename: "Audit-login-out-report.CSV"
//   });
// }



const exportToPRINT = ()=>{
  

  var divContents = document.getElementById("element-to-convert").innerHTML;
  var htmlToPrint = '' +
        '<style type="text/css">' +
        'table th, table td {' +
        'border:1px solid #000;' +
        'padding:0.5em;' +
        '}' +
        '</style>';
            var a = window.open('', '', 'height=500, width=500');
            a.document.write('<html>'+htmlToPrint);
            a.document.write('<body >');
            a.document.write(divContents);
            a.document.write('</body></html>');
            a.document.close();
            a.print();
  
}
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

<section v-if="$can('read', 'RFID_PEOPLE_SUMMERY_REPORT')">
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
            <VCol
                cols="12"
                sm="1"
              >
              <VSelect
                v-model="rowPerPage"
                density="compact"
                variant="outlined"
                :items="[5,10, 20, 30, 50]"
              />
             
              </VCol>     
               <!-- ?? Select Date -->
               <VCol
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
                  @keydown="onTextFieldKeydown"
                /> 
              </VCol>
              <VRow style="margin:0px !important; ">
              <VCol
                cols="6"
                sm="3"
              >
              <VBtn color="primary" @click="searchReport">
              Search
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
          <template #activator="{ props }">
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
      
    </template>
    <!-- <span>Tooltip on Icon</span>
    </VTooltip> -->
    

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

    <!-- Dialog Content -->
    <VCard title="Search Here">
      <VCardText>
        <VRow>
                
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
                  v-model="AlertType"
                  label="Alert Type"
                  placeholder="Alert Type"
                  density="compact"
                />
                </VCol>
                <!-- <VCol 
                    cols="12"
                    sm="4"
                  >
                  <VTextField
                  v-model="AlertDescription"
                  label="Description"
                  placeholder="Description"
                  density="compact"
                />
                </VCol> -->
                <VCol 
                    cols="12"
                    sm="4"
                  >
                  <VTextField
                  v-model="LocationName"
                  label="Location Name"
                  placeholder="Location"
                  density="compact"
                />
                </VCol>
                <VCol 
                    cols="12"
                    sm="4"
                  >
                  <VTextField
                  v-model="IPaddress"
                  label="IP Address"
                  placeholder="IP Address"
                  density="compact"
                />
                </VCol>
              
              
               
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
        <VBtn color="primary" @click="searchReport">Search</VBtn>
      </VCardText>
    </VCard>
  </VDialog>
          </VCol>
        
          <VCol 
          cols="12"
         sm="3"
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
        
          <VTable class="text-no-wrap html2pdf__page-break" id="element-to-convert">
            <!-- ?? table head -->
            <thead>
            <tr>
                <th scope="col">
                  {{$t('ID')}}
                </th>
               
                <th scope="col">
                 {{$t('Host Name')}}
                </th>
                <th scope="col">
                 {{$t('IP Address')}}
                </th>
                
                <th scope="col">
                 {{$t('Alert Type')}}
                </th>
                <th scope="col">
                 {{$t('Description')}}
                </th>
                <th scope="col">
                 {{$t('Location Name')}}
                </th>
                <th scope="col">
                 {{$t('Date/Time')}}
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
                  <span class="text-capitalize text-base font-weight-semibold">{{ user.id }}</span>
                </td> -->
                <td>
                  <span class="text-capitalize text-base font-weight-semibold">{{user.host_name}}</span>
                </td>
                <td>
                  <span class="text-capitalize text-base font-weight-semibold">{{user.ip_address}}</span>
                </td>
                <td>
                  <span class="text-capitalize text-base font-weight-semibold">{{user.alert_type}}</span>
                </td>
                 
                <td>
                  <span class="text-capitalize text-base font-weight-semibold">{{user.alert_description}}</span>
                </td>

                <td>
                  <span class="text-capitalize text-base font-weight-semibold">{{user.location_name}}</span>
                </td>
                <!-- <td>
                  <span class="text-capitalize text-base font-weight-semibold">{{user.alert_timestamp}}</span>
                </td> -->
                <td>
                  <span class="text-capitalize text-base font-weight-semibold">{{moment(user.alert_timestamp , 'YYYY-MM-DD').format('YYYY-MM-DD')}}</span>
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

          <VDivider />

         <!-- SECTION Pagination -->
         <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4 py-3 px-5">
                        <span class="text-sm text-disabled">
                            {{ paginationData }}
                        </span>

                        <VPagination v-model="currentPage" size="small" :total-visible="5" :length="totalPage" />
                    </VCardText>
    <!-- !SECTION -->
        </VCard>
      </VCol>
    </VRow>

   
  </section>
</template>

<style lang="scss">


</style>
<route lang="yaml">
  meta:
    action: read
    subject: RFID_PEOPLE_SUMMERY_REPORT
  </route>

