<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { requiredValidator } from '@validators'
import axios from 'axios';

import {location} from '@/helpers/helper'
import {URL, token} from '@/helpers/token'
const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'bloodgroupData',
])

const isFormValid = ref(false)
const refForm = ref()
const blood_group_name = ref('')


// ?? drawer close
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
                URL() + `/blood_group`,
                {
                            Authorization: token(),

                            requestType: "create",
                            blood_group_data: {
                              blood_group_name:blood_group_name.value,
                            },
                        },
                { headers: { Authorization: token() } }
            )
    .then((response) => {
       console.log(response.data);
       emit("bloodgroupData", {
                            status: "success",
                            data: {
                                id: response.data.blood_group_id,
                                blood_group_name:blood_group_name.value,
                            },
                            message: "Blood Group Successfully Created",
                        });
      
     })
     .catch((error) => {
      console.log(error);
                        emit("bloodgroupData", {
                            status: "failed",
                            data: {
                                id: 0,
                                blood_group_name:blood_group_name.value,
                            },
                            message: error,
                        });
     })
    //  emit('bloodgroupData', {
    //    id: 0,       
    //    blood_group_name:blood_group_name.value,
       
      
     
    //  })
     
     emit('update:isDrawerOpen', false)
    //  nextTick(() => {
    //    refForm.value?.reset()
    //    refForm.value?.resetValidation()
    //  })
   }
 })
}

const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
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
    <h3 class="title-header">{{$t('Blood Group - Create')}}</h3>

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
                  v-model="blood_group_name"
                  :rules="[requiredValidator]"
                  label="Blood Group"
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
