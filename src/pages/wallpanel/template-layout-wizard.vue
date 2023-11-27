<script setup>


import {URL, token} from '@/helpers/token'
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

 /********Error variables declaration end**********/
// const userListStore = useUserListStore()
const searchQuery = ref('')
const dateQuery = ref('')
const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const totalTags = ref(0)
const tags = ref([])
const rtags = ref([])

let i=0
const filteredTags = computed(() => {
    const query = searchQuery.value ? searchQuery.value.toLowerCase() : '';
    return tags.value.filter((tag) => {
        if (tag) {
          
            const templateName = tag.template_name ? tag.template_name.toLowerCase() : '';
            const templateDescription = tag.template_description ? tag.template_description.toLowerCase() : '';
          
           
            return (
              templateName.includes(query) ||
              templateDescription.includes(query)
            
                
            );
        }
        return false; // Return false for undefined employee
    });
});

// ?? Fetching Controller list
const fetchTags = (offset) => {
  axios
            .post(
              URL() + `/wallpanel_template`,
                {
                    requestType: "view",
                    searchParams: {},
                    offset:offset,
                    limit:rowPerPage.value
                },
                { headers: { Authorization: token() } }
            )
  
  
      .then((response) => {
        const data = response.data.data;
        const q = searchQuery.value,
                    d = "",
                    role = null,
                    plan = null,
                    status = null,
                    perPage = rowPerPage.value,
                    currentPage = 1;
                const queryLower = q.toLowerCase();

               
                const firstIndex = response.data.count ? (currentPage.value - 1) * rowPerPage.value + 1 : 0;
                const lastIndex = firstIndex + rowPerPage.value;
                tags.value = data;
                totalPage.value = Math.ceil(response.data.count / perPage) ? Math.ceil(response.data.count / perPage) : 1;
                totalTags.value = response.data.count;
        
      })
      .catch((error) => {
          console.log(error)
      })
      
      
     
}

watch([currentPage, rowPerPage], ([newPage, newPerPage]) => {
    const offset = (newPage - 1) * newPerPage;
    fetchTags(offset, searchQuery.value);
});

watch(currentPage, () => {
    i = (currentPage.value - 1) * rowPerPage.value;
  });

const updatePage = async (newPage, newPerPage) => {
  currentPage.value = newPage;
  rowPerPage.value = newPerPage;
  await fetchTags();
};

const handlePageChange = (newPage) => {
  currentPage = newPage;
  fetchTags((newPage - 1) * rowPerPage.value); // Calculate the offset based on the new page number
};

const handlePerPageChange = (newPerPage) => {
  updatePage(1, newPerPage);
};

const handleSearchChange = (newValue) => {
  currentPage.value = 1;
  fetchTags();
};
const calculateI = (index) => {
  return (currentPage.value - 1) * rowPerPage.value + index + 1;
};
 
const paginationData = computed(() => {
  const firstIndex = totalTags.value ? (currentPage.value - 1) * rowPerPage.value + 1 : 0;
  const lastIndex = Math.min(firstIndex + rowPerPage.value - 1, totalTags.value);
  return `Showing ${firstIndex} to ${lastIndex} of ${totalTags.value} entries`;
});

// Call fetchWorkshop to initialize data
fetchTags();

const getIndex=ref('')



const deleteEvent = (tagid, index) => {
        if (confirm("are you sure, Do you want to delete this Data?")) {
            axios
                .post(
                    URL() + "/wallpanel_template",
                    {
                        requestType: "delete",
                        id: tagid,
                    },
                    { headers: { Authorization: token(), "Content-Type": "application/json" } }
                )
                .then((response) => {
                    console.log(response.data.data)
                    isErrorAlertVisible.value = false
                    isAlertVisible.value = true
                    message.value ='Video Wall item Deleted '
                    tags.value.splice(index, 1)
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




</script>

<template>
<section v-if="$can('read', 'TEMPLATE_LAYOUT_WIZARD')">
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
       

          <VDivider />

          <VCardText class="d-flex flex-wrap py-4 gap-4">
           
           <div>
             <h3 class="title-header">{{$t('Video Wall')}}</h3>
           </div>
           <VSpacer />
         

           <div class="d-flex align-center flex-wrap gap-4">
           <VSelect
               v-model="rowPerPage"
               density="compact"
               variant="outlined"
               :items="[10, 20, 30, 50]"
             />
             <!-- ?? Search  -->
             <div style="width: 10rem;">
               <VTextField v-model="searchQuery" placeholder="Search" density="compact"
               />
             </div>

            <!-- ?? Add user button -->
            <VBtn
              v-if="$can('create', 'TEMPLATE_LAYOUT_WIZARD')"
                prepend-icon="tabler-plus"
                :to="{ 
                action:'create',
                subject:'TEMPLATE_LAYOUT_WIZARD',
                name: 'wallpanel-addtemplate-addnewtemplate' }" 
              >
                {{$t('Add Template')}}
              </VBtn>
           </div>
         </VCardText>	


          

          <VDivider />

          <VTable class="text-no-wrap">
            <!-- ?? table head -->
            <thead>
            <tr>
              <th scope="col" class="text-capitalize">
                  #{{$t('ID')}}
                </th>

                <th scope="col" class="text-capitalize">
                  {{$t('Template Name')}}
                </th>
                <th scope="col" class="text-capitalize">
                 {{$t('Description')}}
                </th>
                <th scope="col" class="text-capitalize">
                 {{$t('Status')}}
                </th>
                
                <th scope="col" class="text-capitalize">
                  {{$t('Actions')}}
                </th>
              </tr>
            </thead>
            <!-- ?? table body -->
            <tbody>
            <tr
                v-for="(tag,index) in filteredTags"
                :key="tag.id"
                style="height: 3.75rem;"
              >
              
                <!-- ?? User -->
                <td>
                {{ calculateI(index) }}
            {{i=i+1}}
          </td>

                <!-- ?? Role -->
                <td>
                  <span >{{ tag.template_name }}</span>
                </td>

                <td>
                <VChip
                    label
                    
                    size="small"
                    class="">
                  
                    {{tag.template_description}}
                  </VChip>
                  <!-- <span class="text-base">{{ user.is_active }}</span> -->
                </td>
               

                <!-- ?? Plan -->
                <td>
                  <span >{{ tag.status ? 'Active' : 'Inactive'}}</span>
                </td>
                
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
                    v-if="$can('read', 'TEMPLATE_LAYOUT_WIZARD')"
                    :to="{ name: 'wallpanel-viewtemplate-id', params: { id: tag.id } }"
                   >
                    <VIcon
                      size="22"
                      icon="tabler-eye"
                    />
                  </VBtn>
                
                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    v-if="$can('update', 'TEMPLATE_LAYOUT_WIZARD')"
                    :to="{ name: 'wallpanel-edittemplate-id', params: { id: tag.id } }"
                      >
                    <VIcon
                      size="22"
                      icon="tabler-edit"
                    />
                  </VBtn>

                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                     v-if="$can('delete', 'TEMPLATE_LAYOUT_WIZARD')"
                     @click="deleteEvent(tag.id,index)"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-trash"
                     />
                  </VBtn>

                 
                </td>
              </tr>
            </tbody>

            <!-- ?? table footer  -->
            <tfoot v-show="!filteredTags.length">
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
            
             
            <VPagination v-model="currentPage" @change="handlePageChange" size="small" :total-visible="10" :length="totalPage" />
                    </VCardText>
        </VCard>
      </VCol>
    </VRow>

  
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
<route lang="yaml">
  meta:
    action: read
    subject: TEMPLATE_LAYOUT_WIZARD
  </route>