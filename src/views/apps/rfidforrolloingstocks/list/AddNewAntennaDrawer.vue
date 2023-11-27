<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import axios from 'axios';
import {URL, token} from '@/helpers/token'
const route = useRoute()
    const router = useRouter()
    const id = route.params.id

// import {
//   emailValidator,
//   requiredValidator,
// } from '@validators'

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'userData',
])

const isFormValid = ref(false)
const refForm = ref()
const antenna_name = ref('')
const antenna_port = ref('')
const transmit_power = ref('')
 const rf_mode = ref('')
  const search_mode = ref('')
 const session = ref()
 const subsystem_id = ref(2)
// const plan = ref()
// const status = ref()

const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
  nextTick(() => {
    refForm.value?.reset()
    refForm.value?.resetValidation()
  })
}

const onSubmit = () => {
 
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      axios
        .post(
            URL() + "/devices/antenna", {
                requestType: "create",
                antenna_data:{
                  reader: id,
                  antenna_name: antenna_name.value,
                  antenna_port: antenna_port.value,
                  transmit_power: transmit_power.value,
                  rf_mode: rf_mode.value,
                  search_mode: search_mode.value,
                  session: session.value,
                },
                subsystem_id: 2,
            }, { headers: { Authorization: token() } }
        )
        .then((response) => {
       console.log(response.data);
       emit("userData", {
                            status: "success",
                            data: {
                              id:0,
                              antenna_name: antenna_name.value,
                              antenna_port: antenna_port.value,
                              transmit_power: transmit_power.value,
                              rf_mode: rf_mode.value,
                              search_mode: search_mode.value,
                              session: session.value,
                            },
                            subsystem_id: 2,
                            message: "Antenna Successfully Created",
                        });
      
     })
     .catch((error) => {
      console.log(error);
                        emit("userData", {
                            status: "failed",
                            data: {
                               id:0,
                                antenna_name: antenna_name.value,
                                antenna_port: antenna_port.value,
                                transmit_power: transmit_power.value,
                                rf_mode: rf_mode.value,
                                search_mode: search_mode.value,
                                session: session.value,
                            },
                            subsystem_id: 2,
                            message: error,
                        });
     })
  
      
      emit('update:isDrawerOpen', false)
      // nextTick(() => {
      //   refForm.value?.reset()
      //   refForm.value?.resetValidation()
      // })
    }
  })
}

const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}
let i=0;
</script>

<template>
  <VNavigationDrawer
    temporary
    :width="400"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
  >
    <!-- ?? Title -->
    <div class="d-flex align-center pa-6 pb-1">
    <h3 class="title-header">{{$t('Antenna - Create')}}</h3>

      <VSpacer />

      <!-- ?? Close btn -->
      <VBtn
        variant="tonal"
        color="default"
        icon
        size="32"
        class="rounded"
        @click="closeNavigationDrawer"
      >
        <VIcon
          size="18"
          icon="tabler-x"
        />
      </VBTn>
    </div>

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- ?? Form -->
          <VForm
            ref="refForm"
            v-model="isFormValid"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- ?? Full name -->
              <VCol cols="12">
                <VTextField
                  v-model="antenna_name"
                  :rules="[requiredValidator]"
                  label="Antenna Name"
                />
              </VCol>
              <VCol cols="12">
              <VSelect
                  v-model="antenna_port"
                  label="Select Port"
                  :rules="[requiredValidator]"
                  :items="[ 1,2,3,4]"
                />
              </VCol>
             

              <!-- ?? company -->
              <VCol cols="12">
                <VTextField
                  v-model="transmit_power"
                  :rules="[requiredValidator]"
                  label="Transmit Power"
                />
              </VCol>

              <VCol cols="12">
              <VSelect
                  v-model="rf_mode"
                  label="Select Mode"
                  :rules="[requiredValidator]"
                  :items="['0', '1', '2', '3', '5', '1002', '1003', '1004','1006','201','221','242','240','282','283','284','1210','1211','1212']"
                />
              </VCol>
              <VCol cols="12">
              <VSelect
                  v-model="search_mode"
                  label="Select Search Mode"
                  :rules="[requiredValidator]"
                  :items="[ 'single-target', 'dual-target', 'single-target-with-tagfocus', 'single-target-b-to-a',' dual-target-with-b-to-a-select']"
                />
              </VCol>
              <VCol cols="12">
              <VSelect
                  v-model="session"
                  label="Select Search Mode"
                  :rules="[requiredValidator]"
                  :items="[ '0', '1', '2', '3']"
                />
              </VCol>

              
            <VCol cols="12">
              <VTextField
                  v-model="subsystem_id"
                  label="SubSystem ID"
                  :rules="[requiredValidator]"
                 
                />
              </VCol>

            
              <!-- ?? Submit and Cancel -->
              <VCol cols="12">
                <VBtn
                  type="submit"
                  class="me-3"
                >
                  Create
                </VBtn>
                <VBtn
                  type="reset"
                  variant="tonal"
                  color="secondary"
                  @click="closeNavigationDrawer"
                >
                  Cancel
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
