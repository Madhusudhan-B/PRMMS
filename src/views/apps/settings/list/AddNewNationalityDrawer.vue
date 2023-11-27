<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import {requiredValidator } from '@validators'
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
  'nationalityData',
])

const isFormValid = ref(false)
const refForm = ref()
const nationality_name = ref('')


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
                URL() + `/nationality`,
                {
                            Authorization: token(),

                            requestType: "create",
                            nationality_data: {
                              nationality_name:nationality_name.value,
                            },
                        },
                { headers: { Authorization: token() } }
            )
      .then((response) => {
       console.log(response.data);
       let data = response.data
       emit("nationalityData", {
                            status: "success",
                            data: {
                                id:data.nationality_id,
                                nationality_name:nationality_name.value,
                            },
                            message: "Nationality Successfully Created",
                        });
    
      
     })
     .catch((error) => {
      emit("nationalityData", {
                            status: "failed",
                            data: {
                                id: 0,
                                nationality_name:nationality_name.value,
                            },
                            message: error,
                        });
     })
     
     
     emit('update:isDrawerOpen', false)
     nextTick(() => {
       refForm.value?.reset()
       refForm.value?.resetValidation()
     })
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
    <h3 class="title-header">{{$t('Nationality - Create')}}</h3>

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
                  v-model="nationality_name"
                  :rules="[requiredValidator]"
                  label="Nationality Name"
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
