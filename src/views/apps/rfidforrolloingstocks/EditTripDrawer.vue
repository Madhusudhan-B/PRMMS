<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import axios from 'axios';

import { tripstatus } from '@/helpers/helper'
import { URL, token } from '@/helpers/token'

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  datatrip: {
    type: Object, // Assuming datatrip is an object
    required: true,
  },
})

const emit = defineEmits(['update:isDrawerOpen', 'tripData'])

const isFormValid = ref(false)
const refForm = ref()
const trip_status = ref('')
const status_name = ref('')
const trip_number = ref('')
const trip_date = ref('')
const no_of_locos = ref('')
const no_of_wagons = ref('')
const selectedStatus= ref('')
const StatusList= tripstatus()

const onSubmit = () => {
  if (isFormValid.value) {
    axios.post(
      URL() + `/trip`,
      {
        requestType: "update",
        trip_data: {
          id: props.datatrip.id,
          trip_number: props.datatrip.trip_number,
          trip_date: props.datatrip.trip_date,
          no_of_locos: props.datatrip.no_of_locos,
          no_of_wagons: props.datatrip.no_of_wagons,
          trip_status: props.datatrip.trip_status.id,
        },
      },
      { headers: { Authorization: token() } }
    )
      .then((response) => {
        console.log(response.data);
        emit("tripData", {
          status: "success",
          data: response.data, // Assuming the response contains updated data
          message: "Trip Successfully Updated",
        });
        emit('update:isDrawerOpen', false);
      })
      .catch((error) => {
        console.error(error);
        emit("tripData", {
          status: "failed",
          data: props.datatrip, // Send the original data in case of failure
          message: error.message || "Error updating trip",
        });
      });
  }
}

const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false);
}

const handleDrawerModelValueUpdate = (val) => {
  emit('update:isDrawerOpen', val);
}
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
      <h3 style="color: #2f2774;"> {{$t('Trip - Update')}}</h3>

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
                  v-model="props.datatrip.trip_number"
                  :rules="[requiredValidator]"
                  label="Trip Number"
                />
              </VCol>
              <VCol cols="12">
                <AppDateTimePicker
                  v-model="props.datatrip.trip_date"
                  :rules="[requiredValidator]"
                  label="Date"
                />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="props.datatrip.no_of_locos"
                  :rules="[requiredValidator]"
                  label="Number of Locomotives"
                />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="props.datatrip.no_of_wagons"
                  :rules="[requiredValidator]"
                  label="Number of wegons"
                />
              </VCol>
              <VCol cols="12">
                <VSelect
                  v-model="props.datatrip.trip_status.id"
                  label=" Status"
                  :rules="[requiredValidator]"
                  :items="StatusList"
                />
              </VCol>

             
             

              <!-- ?? Submit and Cancel -->
              <VCol cols="12">
                <VBtn
                  type="submit"
                  class="me-3"
                >
                  Update
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
