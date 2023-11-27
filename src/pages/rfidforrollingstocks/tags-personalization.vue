<script setup>
// import AddNewTagDrawer from '@/views/apps/rfidforrolloingstocks/list/AddNewTagDrawer.vue'
import ViewTagDrawer from '@/views/apps/rfidforrolloingstocks/list/ViewTagDrawer.vue'
import EditTagDrawer from '@/views/apps/rfidforrolloingstocks/list/EditTagDrawer.vue'

import axios from '@axios'
import {URL, token} from '@/helpers/token'

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
const rtags = ref([])
const tags = ref([])

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
// ?? Fetching users
const fetchTags = (offset) => {
  

  axios
            .post(
                URL() + `/rolling_stock`,
                {
                    requestType: "view",
                    offset: offset,
                    limit: rowPerPage.value,
                  //  tag_epc: "TAG-EPC-ID",
                    searchParams:{}
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
                    perPage =rowPerPage.value,
                    currentPage = 1;
                const queryLower = q.toLowerCase();

                rtags.value = data;
                const firstIndex = response.data.count ? (currentPage.value - 1) * rowPerPage.value + 1 : 0;
                const lastIndex = firstIndex + rowPerPage.value;
                tags.value = data;
                totalPage.value = Math.ceil(response.data.count / perPage) ? Math.ceil(response.data.count / perPage) : 1;
                totalTags.value = response.data.count;
        
      })
      .catch((error) => {
        isErrorAlertVisible.value = true;
                isAlertVisible.value = false;
                err.value = error;
                console.error(error);
                console.log(error);
      })
      

      
     
}

watchEffect(fetchTags(totalTags.value ? (currentPage.value - 1) * rowPerPage.value  : 0));

// ?? watching current page



// ?? watching current page
watchEffect(() => {
  fetchTags(totalTags.value ? (currentPage.value - 1) * rowPerPage.value : 0)

    if (currentPage.value > totalPage.value) currentPage.value = totalPage.value
});

// ?? Computing pagination data
const paginationData = computed(() => {
    const firstIndex = totalTags.value ? (currentPage.value - 1) * rowPerPage.value : 1;
    const lastIndex = firstIndex + tags.value.length;
    i = firstIndex;
    return `Showing ${firstIndex} to ${lastIndex} of ${totalTags.value} entries`;
});





const isAddNewTagDrawerVisible = ref(false)

const isViewTagDrawerVisible = ref(false)
const getDataTag= ref([])

//Edi device data
const isEditTagDrawerVisible = ref(false)
const editDataTag= ref([])



const addNewTag = tagData => {
  // userListStore.addUser(tagData)

  // // refetch User
  // fetchTags()

  i=0

if (tagData.status == "success") {
    isAlertVisible.value = true;
    isErrorAlertVisible.value = false;

    watchEffect(fetchTags(totalReaders.value ? (currentPage.value - 1) * rowPerPage.value  : 0));

    console.log(tagData);
    // refetch role
    message.value = tagData.message;
    console.log("Refech Reader");
    console.log(readers);
}

if (tagData.status == "failed") {
    isErrorAlertVisible.value = true;
    isAlertVisible.value = false;
    err.value = tagData.message;
    console.log("Refech Reader failed");
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

// ?? delete an Location
const deleteEvent = (tagid, index) => {
        if (confirm("are you sure, Do you want to delete this Data?")) {
            axios
                .post(
                    URL() + "/rolling_stock",
                    {
                        requestType: "delete",
                        rolling_stock_id: tagid,
                    },
                    { headers: { Authorization: token(), "Content-Type": "application/json" } }
                )
                .then((response) => {
                    console.log(response.data.data);
                    isErrorAlertVisible.value = false;
                    isAlertVisible.value = true;
                    message.value = "Tag Deleted ";
                    readers.value.splice(index, 1);
                    //   this.listings = response.data;
                })
                .catch((error) => {
                    isErrorAlertVisible.value = true;
                    isAlertVisible.value = false;
                    err.value = error;
                    console.log(error);
                });
        }
    }
</script>

<template>
<section v-if="$can('read', 'RS_TAGS')">
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
             <h3 class="title-header">{{$t('Tags')}}</h3>
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
           <!--VBtn
                prepend-icon="tabler-plus"
                v-if="$can('create', 'RS_TAGS')"
                @click="isAddNewTagDrawerVisible = true"
              >
                Add Tag Personalization
              </VBtn -->
           </div>
         </VCardText>	

        

          <VDivider />

          <VTable class="text-no-wrap">
            <!-- ?? table head -->
            <thead>
              <tr>
              <th scope="col">
                  #{{$t('ID')}}
                </th>
                <th scope="col">
                 {{$t('RS Type')}}
                </th>
                <th scope="col">
                {{$t('RS Number')}}
                </th>
                <th scope="col">
              {{$t('EPC ID - 1')}}
                </th>
                <th scope="col">
                {{$t('EPC ID - 2')}}
                </th>
                <th scope="col">
              {{$t('Photo')}}
                </th>
                
                <th scope="col">
                  {{$t('Actions')}}
                </th>
              </tr>
            </thead>
            <!-- ?? table body -->
            <tbody>
              <tr
                v-for="tag in tags"
                :key="tag.id"
                style="height: 3.75rem;"
              >
                <!-- ?? User -->
                <td>
            <RouterLink :to="{ name: '', params: { id: tag.id } }">
              {{i=i+1 }}
            </RouterLink>
          </td>

                <!-- ?? Role -->
                <td>
                  <span class="text-capitalize text-base font-weight-semibold">{{ tag.rolling_stock_type.rolling_stock_name }}</span>
                </td>

                <!-- ?? Plan -->
                <td>
                  <span class="text-capitalize text-base font-weight-semibold">{{ tag.rolling_stock_id }}</span>
                </td>

                <td v-if="tag.tags[0]">            
                  
                  {{ tag.tags[0].epc }}
                 
                  <!-- <span class="text-base">{{ user.is_active }}</span> -->
                </td>
                <td v-if="!tag.tags[0]">            
                  
                  
                 
                  <!-- <span class="text-base">{{ user.is_active }}</span> -->
                </td>
                <!-- <td>
                  <span class="text-base">{{ tag.rs_type }}</span>
                </td> -->
                <td v-if="tag.tags[1]">
                  {{ tag.tags[1].epc }}
                </td>
                <td v-if="!tag.tags[1]">
                 
                </td>
                <td>
                 <div class="d-flex align-center" v-if="tag.tags[0]">
                    <VAvatar
                      variant="tonal"
                      style="color: #009a3e;"
                      class="me-3"
                      size="38"
                    >
                      <VImg
                        v-if="tag.tags[0].image_data"
                        :src="tag.tags[0].image_data"
                      />
                      <span v-else >{{ avatarText(tag.tags[0].image_data) }}</span>
                    </VAvatar>
                   
                  </div>
              </td>


                <!-- ?? Status -->
               
               

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
                    v-if="$can('read', 'RS_TAGS')"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-eye"
                     
                      @click="(isViewTagDrawerVisible = true), (getDataTag= tag)"
                    />
                  </VBtn>
                
                  <!--VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    v-if="$can('update', 'RS_TAGS')"

                  >
                    <VIcon
                      size="22"
                      icon="tabler-edit"
                      @click="(isEditTagDrawerVisible = true), (editDataTag= tag)"
                    />
                  </VBtn -->

                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    v-if="$can('delete', 'RS_TAGS')"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-trash"
                      @click="deleteEvent(tag.id,index)"
                    />
                  </VBtn>

                 
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
    <AddNewTagDrawer
      v-model:isDrawerOpen="isAddNewTagDrawerVisible"
      @tag-data="addNewTag"
    />

     <!-- ?? View  -->
     <ViewTagDrawer
      v-model:isDrawerOpen="isViewTagDrawerVisible"
      v-bind:getData= "getDataTag"
    />

    <!-- ?? Edit  -->
    <EditTagDrawer
      v-model:isDrawerOpen="isEditTagDrawerVisible"
      v-bind:editData= "editDataTag"
      @tag-data="updateTag"
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
<route lang="yaml">
  meta:
    action: read
    subject: RS_TAGS
  </route>

