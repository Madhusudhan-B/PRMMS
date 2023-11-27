
<script setup>
import AppDateTimePicker from '@core/components/AppDateTimePicker.vue'

import {departmentlist, readerlocationlist} from '@/helpers/helper'

import {URL, token} from '@/helpers/token'

import { avatarText,formatDate } from '@core/utils/formatters'

import axios from '@axios'

const date = ref('')
const searchQuery = ref('')
// const firstName=ref('')
// const AccessCardNumber=ref('')
const dateQuery = ref('')
const EmployeeNumber = ref('')
const EmployeeName = ref('')
const FirstLogin = ref('')
const LastLogout = ref('')
// const Department = ref('')
// const departmentList=departmentlist()
// const Readerlocation = ref('')
// const readerlocationList=readerlocationlist()
// const selectedPlan = ref()
//const ReaderLocation = ref('')
// const Status = ref('')
// const selectedStatus = ref()
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalUsers = ref(0)
const users = ref([])
const pages = ref([])
const rusers = ref([])
const newtoken=token()
// ?? Fetching users
const fetchUsers = () => {
  
 
 var test='{'
 
  
  test+='}'
 
console.log(test);
            axios.post(URL()+'/login_logout_report',JSON.parse(test),{'headers': { Authorization: token()}, }).then((response) => {
                    console.log(response.data.data);
                    //let data = response.data.data
                    const data=response.data.data;
                    const  perPage = rowPerPage.value
                  //  console.log(perPage)
                   users.value=data
        //            if (perPage) {
        //   const firstIndex = (currentPage - 1) * perPage
        //   const lastIndex = perPage * currentPage

        //   users.value = data.slice(firstIndex, lastIndex)
        // }
        // totalPage.value = Math.ceil(data.length / perPage) ? Math.ceil(data.length / perPage) : 1
        // totalUsers.value =data.length
                  
                  
                  })
                  .catch((error) => {
                      console.log(error)
                  })
      
      
     
}

const filterUsers = () => {
  
 
  var test='{'
   
   if(EmployeeName.value){
     test+= '"employee_name":"'+EmployeeName.value+'"'
   }
   if(FirstLogin.value){
    test+= '"first_login":"'+FirstLogin.value+'"'
   }
   if(LastLogout.value){
    test+= '"last_logout":"'+LastLogout.value+'"'
   }
   if(dateQuery.value){
    test+= '"date":"'+dateQuery.value+'"'
   }
   
   
   
   test+='}'

   
  
 console.log(test);
             axios.post(URL()+'/login_logout_report',JSON.parse(test),{'headers': { Authorization: token()}, }).then((response) => {
                     console.log(response.data.data);
                     //let data = response.data.data
                     const data=response.data.data;
                     const  perPage = rowPerPage.value
                   //  console.log(perPage)
                    users.value=data
         //            if (perPage) {
         //   const firstIndex = (currentPage - 1) * perPage
         //   const lastIndex = perPage * currentPage
 
         //   users.value = data.slice(firstIndex, lastIndex)
         // }
         // totalPage.value = Math.ceil(data.length / perPage) ? Math.ceil(data.length / perPage) : 1
         // totalUsers.value =data.length
                   
                   
                   })
                   .catch((error) => {
                       console.log(error)
                   })
       
       
      
 }

 const searchReport = () =>{
  filterUsers()
 }


 

const dateRange = (startDate, endDate, steps = 1) =>{
  const dateArray = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dateArray.push(new Date(currentDate));
    // Use UTC date to prevent problems with time zones and DST
    currentDate.setUTCDate(currentDate.getUTCDate() + steps);
  }

  return dateArray;
}


watchEffect(fetchUsers)

//watchEffect(filterusers)

// ?? watching current page
watchEffect(() => {
  fetchUsers()
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})


//const locations= devicelocation()
// ?? search filters
const roles = [
  {
    title: 'Employee',
    value: 'employee',
  },
  {
    title: 'Trainee',
    value: 'trainee',
  },
]

// const plans = departmentlist()

// console.log(plans);

//const status = loginstatus()

const resolveUserRoleVariant = role => {
  if (role === 'subscriber')
    return {
      color: 'warning',
      icon: 'tabler-user',
    }
  if (role === 'author')
    return {
      color: 'success',
      icon: 'tabler-circle-check',
    }
  if (role === 'maintainer')
    return {
      color: 'primary',
      icon: 'tabler-chart-pie-2',
    }
  if (role === 'editor')
    return {
      color: 'info',
      icon: 'tabler-pencil',
    }
  if (role === 'admin')
    return {
      color: 'secondary',
      icon: 'tabler-device-laptop',
    }
  
  return {
    color: 'primary',
    icon: 'tabler-user',
  }
}

const resolveUserStatusVariant = stat => {
  
  if (stat === 'IN')
    return 'success'
  if (stat === 'OUT')
    return 'secondary'
  
  return 'primary'
}



// ?? watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// ?? Computing pagination data
const paginationData = computed(() => {
  const firstIndex = users.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = users.value.length + (currentPage.value - 1) * rowPerPage.value
  totalUsers.value =users.value.length
  return `Showing ${ firstIndex } to ${ lastIndex } of ${ totalUsers.value } entries`
})





const exportToPDF = ()=>{


  let filename = "User-Daily-login-report.pdf";
let element = document.getElementById('element-to-convert');

html2pdf(element, {
		margin:       0.25,
		filename:     filename,
		image:        { type: 'jpeg', quality: 0.98 },
		html2canvas:  { dpi: 96, letterRendering: true },
		jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
	  });


  
  // html2pdf(document.getElementById('element-to-convert'),{
  //   margin: 1,
  // 	filename: "User-Daily-login-report.pdf",
  //   pagebreak: { mode: 'avoid-all', before: '#page2el' 
  // });
}

const exportToXLSX = ()=>{
  
  html2pdf(document.getElementById('element-to-convert'),{
    margin: 1,
  	filename: "Daily-login.pdf"
  });
}

const exportToCSV = ()=>{
  
  html2pdf(document.getElementById('element-to-convert'),{
    margin: 1,
  	filename: "Daily-login.pdf"
  });
}



const exportToPRINT = ()=>{
  

  var divContents = document.getElementById("table").innerHTML;
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

let i=0
</script>

<template>

<section v-if="$can('read', 'REPORTS_PEOPLE_DAILY_LOGIN_OUT')">
     <!-- ?? Alert messages   -->
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

    <VRow>
      
      <VCol cols="12">
       
        <VCard >
        
          <VCardText>
          <VForm @submit.prevent="() => {}">
            <VRow>
            <VCol
                cols="12"
                sm="1"
              >
              <VSelect
                v-model="rowPerPage"
                density="compact"
                variant="outlined"
                :items="[10, 20, 30, 50]"
              />
             
              </VCol>     
               <!-- ?? Select Date -->
               <VCol
                cols="12"
                sm="3"
              >
              <AppDateTimePicker
                    v-model="dateQuery"
                    label="Date Range"
                    :config="{ mode: 'range' }"
                  />
             
              </VCol>       
              
              
            
              <VCol 
                cols="12"
                sm="2"
              >
              <VTextField
             
                  v-model="EmployeeName"
                  placeholder="Employee Name"
                  density="compact"
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
                      v-model="EmployeeName"
                      placeholder="Employee Name"
                      density="compact"
                    />
                </VCol>
                <VCol 
                    cols="12"
                    sm="4"
                  >
                  <VTextField
                      v-model="FirstLogin"
                      placeholder="First Login"
                      density="compact"
                    />
                </VCol>
                <VCol 
                    cols="12"
                    sm="4"
                  >
                  <VTextField
                      v-model="LastLogout"
                      placeholder="Last Logout"
                      density="compact"
                    />
                </VCol>
                  
                  
              <VCol
                cols="12"
                sm="3"
              >
                <AppDateTimePicker
                      v-model="dateQuery"
                      label="Date Range"
                      :config="{ mode: 'range' }"
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
        <VBtn  @click="searchReport">
          Search
        </VBtn>
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
              <VListItemTitle @click="exportToXLSX" class="cursor-pointer">XLSX</VListItemTitle>
              <VListItemTitle @click="exportToCSV" class="cursor-pointer">CSV</VListItemTitle>
              <VListItemTitle @click="exportToPRINT" class="cursor-pointer">Print</VListItemTitle>
            </VListItem>

           
          </VList>
        </VMenu>
      </VBtn>
        </VCol>
        <VCol
        
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
      </VCol>
            </VRow>
</VForm>
          </VCardText>
          <VDivider />
        
          <VTable class="text-no-wrap html2pdf__page-break" id="table">
            <!-- ?? table head -->
            <thead>
            <tr>
                <th scope="col">
                  S.No
                </th>
                <!-- <th scope="col">
                  ID
                </th> -->
                
                <th scope="col">
                  Employee Name
                </th>
                
                <th scope="col">
                  First Login
                </th>
                <th scope="col">
                Last Logout
                </th>
                <th scope="col">
               Date
                </th>
                
              </tr>
            </thead>
            <!-- ?? table body -->
            <tbody>
            <tr
                v-for="user in users"
                :key="user.id"
                style="height: 3.75rem;"
              >
                <!-- ?? User -->
                 <!-- ?? Plan -->
                 <td>
                  {{i=i+1}}
                </td>
                 <!-- <td>
                  <span class="text-capitalize text-base font-weight-semibold">{{ user.id }}</span>
                </td> -->
                <td>
                  <span class="text-capitalize text-base font-weight-semibold">{{ user.employee_name }}</span>
                </td>
                <td>
                  <span class="text-capitalize text-base font-weight-semibold">{{ user.first_login }}</span>
                </td>
                <td>
                  <span class="text-capitalize text-base font-weight-semibold">{{ user.last_logout }}</span>
                </td>
                
                 <td>
                  <span class="text-capitalize text-base font-weight-semibold">{{ user.date }}</span>
                </td>
                
               

               </tr>
            </tbody>

            <!-- ?? table footer  -->
            <tfoot v-show="!users.length">
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

         <!-- SECTION Pagination -->
    <VCardText class="d-flex align-center flex-wrap gap-4 py-3">
      <!-- ?? Pagination meta -->
      <span class="text-sm text-disabled">
        {{ paginationData }}
      </span>

      <VSpacer />

      <!-- ?? Pagination -->
      <VPagination
        v-model="currentPage"
        size="small"
        :total-visible="5"
        :length="totalPage"
        @next="selectedRows = []"
        @prev="selectedRows = []"
      />
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
    subject: REPORTS_RFID_FOR_PEOPLE_DAILY
  </route>
