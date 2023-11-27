<script setup>


import {URL, token} from '@/helpers/token'

import axios from '@axios'
import { useRoute, useRouter } from 'vue-router';
import { avatarText, formatDate } from "@core/utils/formatters";

const route = useRoute()
const router = useRouter()
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

// const userListStore = useUserListStore()
    const searchQuery = ref("")
    const dateQuery = ref("")
    const selectedRole = ref()
    const selectedPlan = ref()
    const selectedStatus = ref()
    const rowPerPage = ref(10)
    const currentPage = ref(1)
    const totalPage = ref(1)
    const totalEmployees = ref(0)
    const employees = ref([])
    const remployees = ref([])


let i=0
const filteredEmployees = computed(() => {
    const query = searchQuery.value ? searchQuery.value.toLowerCase() : '';
    return employees.value.filter((employee) => {
        if (employee) {
            const employeeId = employee.staff_id ? employee.staff_id.toLowerCase() : '';
            const firstName = employee.first_name ? employee.first_name.toLowerCase() : '';
            const lastName = employee.last_name ? employee.last_name.toLowerCase() : '';
            const designation = employee.designation ? employee.designation.toLowerCase() : '';
            const email = employee.email ? employee.email.toLowerCase() : '';
            const phoneNumber = employee.phone_number ? employee.phone_number.toLowerCase() : '';
            const accessCardNo = employee.access_card_no ? employee.access_card_no.toLowerCase() : '';

            return (
                employeeId.includes(query) ||
                firstName.includes(query) ||
                lastName.includes(query) ||
                designation.includes(query) ||
                email.includes(query) ||
                phoneNumber.includes(query) ||
                accessCardNo.includes(query)
            );
        }
        return false; // Return false for undefined employee
    });
});

// ?? Fetching Role list
const fetchEmployees = (offset) => {
        axios
            .post(
                URL() + `/employee`,
                {
                    requestType: "view",
                    offset: offset,
                    limit: rowPerPage.value,
                    search: searchQuery.value, // Include search query in the request
                },
                { headers: { Authorization: token() } }
            )
            .then((response) => {
                //   this.listings = response.data;
                console.log(response.data.data);
                const data = response.data.data;
                const q = searchQuery.value,
                    d = "",
                    role = null,
                    plan = null,
                    status = null,
                    perPage = rowPerPage.value,
                    currentPage = 1;
                const queryLower = q.toLowerCase()
                
                remployees.value = data;
                const firstIndex = response.data.count ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
                const lastIndex = firstIndex + rowPerPage.value
                employees.value = data
                totalPage.value = Math.ceil(response.data.count / perPage) ? Math.ceil(response.data.count / perPage) : 1
                totalEmployees.value = response.data.count
            })
            .catch((error) => {
                isErrorAlertVisible.value = true
                isAlertVisible.value = false
                err.value = error
                console.error(error)
                console.log(error)
            })
    }



    watch([currentPage, rowPerPage], ([newPage, newPerPage]) => {
    const offset = (newPage - 1) * newPerPage;
    fetchEmployees(offset, searchQuery.value);
});

watch(currentPage, () => {
    i = (currentPage.value - 1) * rowPerPage.value;
  });

const updatePage = async (newPage, newPerPage) => {
  currentPage.value = newPage;
  rowPerPage.value = newPerPage;
  await fetchEmployees();
};

const handlePageChange = (newPage) => {
  currentPage = newPage;
  fetchEmployees((newPage - 1) * rowPerPage.value); // Calculate the offset based on the new page number
};

const handlePerPageChange = (newPerPage) => {
  updatePage(1, newPerPage);
};

const handleSearchChange = (newValue) => {
  currentPage.value = 1;
  fetchEmployees();
};
const calculateI = (index) => {
  return (currentPage.value - 1) * rowPerPage.value + index + 1;
};
 
const paginationData = computed(() => {
  const firstIndex = totalEmployees.value ? (currentPage.value - 1) * rowPerPage.value + 1 : 0;
  const lastIndex = Math.min(firstIndex + rowPerPage.value - 1, totalEmployees.value);
  return `Showing ${firstIndex} to ${lastIndex} of ${totalEmployees.value} entries`;
});

// Call fetchWorkshop to initialize data
fetchEmployees();


const deleteEvent = (tagid, index) => {
        if (confirm("are you sure, Do you want to delete this Data?")) {
            axios
                .post(
                    URL() + "/employee",
                    {
                        requestType: "delete",
                        staff_id: tagid,
                    },
                    { headers: { Authorization: token(), "Content-Type": "application/json" } }
                )
                .then((response) => {
                    console.log(response.data.data)
                    isErrorAlertVisible.value = false
                    isAlertVisible.value = true
                    message.value ='Employee Deleted '
                    employees.value.splice(index, 1)
                    //   this.listings = response.data;
                })
                .catch((error) => {
                    isErrorAlertVisible.value = true
                    isAlertVisible.value = false
                    err.value = error
                    console.log(error)
                });

           
        }
    };

    const resolveUserStatusVariant = (stat) => {
       // if (stat === false) return "warning";
        if (stat === true) return "success"
        if (stat === false) return "secondary"

        return "primary"
    };

    

</script>

<template>
    <section  v-if="$can('read', 'PEOPLE_EMPLOYEE')">
        <!-- ?? Alert messages   -->
        <div class="alert-demo-v-model-wrapper">
            <VAlert v-model="isErrorAlertVisible" color="error" variant="tonal">
                {{err}}
            </VAlert>
            <VAlert v-model="isAlertVisible" color="success" variant="tonal">
                {{message}}
            </VAlert>
        </div>
        <!-- ?? Alert messages   -->
        <VRow>
            <VCol cols="12">
                <VCard>
                    <!-- ?? Filters -->

                    <VDivider />

                    <VCardText class="d-flex flex-wrap py-4 gap-4">
           
           <div>
             <h3 class="title-header">{{$t('Staff Profile')}}</h3>
             
           </div>
           <VSpacer />
         

           <div class="d-flex align-center flex-wrap gap-4">
           <VSelect
               v-model="rowPerPage"
               @change="handlePerPageChange"
               density="compact"
               variant="outlined"
               :items="[5, 10, 20, 30, 50]"
             />
             <!-- ?? Search  -->
             <div style="width: 10rem;">
               <VTextField v-model="searchQuery" placeholder="Search" density="compact"
               />
             </div>

             <VBtn 
                            v-if="$can('create', 'PEOPLE_EMPLOYEE')" 
                            prepend-icon="tabler-plus" 
                            :to="{ 
                                action:'create',
                                subject:'PEOPLE_EMPLOYEE',
                                name: 'rfidpeople-addemployee-addnewemployee' }" 
                            >
                                {{$t('Add Staff')}}
                            </VBtn>
           </div>
         </VCardText>	

                    

                    <VDivider />

                    <VTable class="text-no-wrap">
                        <!-- ?? table head -->
                        <thead>
                            <tr>
                                <th scope="col" class="text-capitalize  ">
                                    #{{$t('ID')}}
                                </th>
                                <th scope="col" class="text-capitalize  ">
                                    {{$t('Staff ID')}}
                                </th>
                                <th scope="col" class="text-capitalize  ">
                                    {{$t('Staff Name')}}
                                </th>
                                <th scope="col" class="text-capitalize  ">
                                    {{$t('Designation')}}
                                </th>
                                <th scope="col" class="text-capitalize  ">
                                    {{$t('Email')}}
                                </th>
                                <th scope="col" class="text-capitalize  ">
                                    {{$t('Phone Number')}}
                                </th>
                                <th scope="col" class="text-capitalize  ">
                                    {{$t('ID Card Number')}}
                                </th>
                                <th scope="col" class="text-capitalize  ">
                                    {{$t('Status')}}
                                </th>
                              
                                <th scope="col" class="text-capitalize  ">
                                    {{$t('Actions')}}
                                </th>
                            </tr>
                        </thead>
                        <!-- ?? table body -->
                        <tbody>
                            <tr v-for="(employee,index) in filteredEmployees" :key="employee.id" style="height: 3.75rem;">
                                <td>
                                {{ calculateI(index) }}
                                </td>
                               

                                <!-- ?? Employee ID -->
                                <td>
                                    <span >{{ employee.staff_id }}</span>
                                </td>
                                <!-- ?? Employee name -->
                                <td>
                                    <div class="d-flex align-center">
                                        <VAvatar variant="tonal" class="me-3" size="40">
                                            <VImg v-if="employee.image_data " :src="employee.image_data " />
                                            <span v-else>{{ avatarText(employee.first_name ) }}</span>
                                        </VAvatar>

                                        <div class="d-flex flex-column">
                                            <h6 style="font-weight: 500; font-size: 12px;">
                                                <span class="">{{ employee.first_name }} {{ employee.last_name }}</span>
                                            </h6>
                                        </div>
                                    </div>
                                </td>
                                <!-- ?? Designation -->
                                <td>
                                    <span >{{ employee.designation }}</span>
                                </td>
                                <!-- ?? Email -->
                                <td>
                                    <span class=" ">{{ employee.email }}</span>
                                </td>
                                <!-- ?? Phone number -->
                                <td>
                                  <span >    {{employee.phone_number}}
                                  </span>
                                </td>
                                <!-- ?? Access card number -->
                                <td>
                                  <span > 
                                        {{employee.access_card_no}}
                                  </span>
                                </td>
                                <!-- ?? Status -->
                                <td>
                                    <VChip label :color="resolveUserStatusVariant(employee.is_active)" size="small" class="text-capitalize">
                                    {{ employee.is_active ? 'Active' : 'Inactive'}}
                                    </VChip>
                                </td>
                                <td class="text-center" style="width: 5rem;">
                                        <VBtn  v-if="$can('read', 'PEOPLE_EMPLOYEE')" icon size="x-small" color="default" variant="text" :to="{ name: 'rfidpeople-viewemployee-id', params: { id: employee.staff_id } }">
                                            <VIcon size="22" icon="tabler-eye" />
                                        </VBtn>
                                        <VBtn  v-if="$can('update', 'PEOPLE_EMPLOYEE')" icon size="x-small" color="default" variant="text" :to="{ name: 'rfidpeople-editemployee-id', params: { id: employee.staff_id } }">
                                            <VIcon size="22" icon="tabler-edit" />
                                        </VBtn>
                                 
                                        <VBtn icon size="x-small" color="default" variant="text">
                                            <VIcon v-if="$can('delete', 'PEOPLE_EMPLOYEE')" size="22" icon="tabler-trash" @click="deleteEvent(employee.staff_id,index)" />
                                        </VBtn>
                                        <VBtn v-if="$can('read', 'PEOPLE_EMPLOYEE')"  icon size="x-small" color="default" variant="text" :to="{ name: 'rfidpeople-card-id', params: { id: employee.staff_id } }">
                                            <VIcon size="22" icon="tabler-album" />
                                        </VBtn>
                                </td>
                            </tr>
                        </tbody>

                        <!-- ?? table footer  -->
                        <tfoot v-show="!filteredEmployees.length">
                            <tr>
                                <td colspan="7" class="text-center">
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
            
             
            <VPagination v-model="currentPage" @change="handlePageChange" size="small" :total-visible="10" :length="totalPage" />
                    </VCardText>
                </VCard>
            </VCol>
        </VRow>
    </section>
</template>

<style lang="scss">
.app-Role-search-filter {
  inline-size: 31.6rem;
}

.text-capitalize {
  text-transform: capitalize;
}

.Role-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}
</style>
<route lang="yaml">
  meta:
    action: read
    subject: PEOPLE_EMPLOYEE
  </route>
