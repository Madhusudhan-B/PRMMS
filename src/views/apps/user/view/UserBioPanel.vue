
<script setup>
import axios from "axios";
    import { URL, token } from "@/helpers/token";
    import { location, departmentlist, nationalities, bloodgroups, shifttypes, shifts } from "@/helpers/helper";
    import { emailValidator, requiredValidator } from "@validators";
    import { Cropper } from "vue-advanced-cropper";
    import "vue-advanced-cropper/dist/style.css";
    const route = useRoute()
    const router = useRouter()
    const rowid = route.params.id

    const getimage = ref("");

    const isFormValid = ref(false);
    const refForm = ref();
  
    const reader_name = ref("");
    const location_short_code = ref("");
    const host_name = ref('');
    const port = ref("");

    

    

    const fetchEmployee = (id) => {

axios.post(URL()+`/devices/reader`,{
      
      'requestType':'view',
      'id': id,
     
    
    }, { 'headers': { Authorization: token() } }) 

  .then((response) => {

    //   this.listings = response.data;       
    console.log(response.data.data);
    const emp = response.data.data;

    reader_name.value = emp.reader_name 
    location_short_code.value =  emp.location.location_short_code
    host_name.value = emp.host_name
    port.value = emp.port
    
    
  

  })
  .catch((error) => {
    console.log(error)
  })



}



fetchEmployee(rowid)


</script>


<template>
  <VRow >
    <!-- SECTION User Details -->
    <VCol cols="12">
      <VCard style="height: 299px !important;">

        <!-- 👉 Details -->
        <VCardText>
          <p class="text-sm text-uppercase text-disabled">
           Reader Details
          </p>

          <!-- 👉 User Details list -->
          <VList class="card-list mt-2">
            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                 Reader Name:
                  <span class="text-body-2">
                    {{ reader_name }}
                  </span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                 Location:
                  <span class="text-body-2">{{ location_short_code }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                 Host Name:
                  <span class="text-body-2">{{ host_name }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                  Port:
                  <span class="text-capitalize text-body-2">{{ port }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

          </VList>
        </VCardText>

        <!-- 👉 Edit and Suspend button -->
        <!-- <VCardText class="d-flex justify-center">
          <VBtn
            variant="elevated"
            class="me-3"
            @click="isUserInfoEditDialogVisible = true"
          >
            Edit
          </VBtn>
          <VBtn
            variant="tonal"
            color="error"
          >
            Suspend
          </VBtn>
        </VCardText> -->
      </VCard>
    </VCol>
    <!-- !SECTION -->

    <!-- SECTION Current Plan -->
    
    <!-- !SECTION -->
  </VRow>

  <!-- 👉 Edit user info dialog -->
  <!-- <UserInfoEditDialog
    v-model:isDialogVisible="isUserInfoEditDialogVisible"
    :user-data="props.userData"
  /> -->

  <!-- 👉 Upgrade plan dialog -->
  <!-- <UserUpgradePlanDialog v-model:isDialogVisible="isUpgradePlanDialogVisible" /> -->
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.7rem;
}

.text-capitalize {
  text-transform: capitalize !important;
}
</style>

<route lang="yaml">
  meta:
    action: create
    subject: RS_READER
  </route>
