<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import axios from 'axios';

import {location} from '@/helpers/helper'
import {URL, token} from '@/helpers/token'

const monday_value = ref([0,3])
const tuesday_value = ref([2,4])
const wednessday_value = ref([0,3])
const thursday_value = ref([2,4])
const friday_value = ref([3,5])
const saturday_value = ref([0,3])
const sunday_value = ref([0,3])
const holiday_type1 = ref([0,3])
const holiday_type2 = ref([0,3])
const holiday_type3 = ref([0,3])

let hBarMinValue= 120
  let hBarMaxValue = 600

  
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
  'timezoneData',
])

const isFormValid = ref(false)
const refForm = ref()

const locationList=location()
const show2 = ref(false)
const rules = {
required: (value) => !!value || 'Required.',
min: (v) => v.length >= 8 || 'Min 8 characters',
}

// ?? drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
  nextTick(() => {
    refForm.value?.reset()
    refForm.value?.resetValidation()
  })
}
// const updateHoursValues =(e) => {
//       hoursLabel()
//       console.log('update monday')
//       hBarMinValue = e.minValue
//       hBarMaxValue = e.maxValue
//       monday_value=[hBarMinValue,hBarMaxValue]
//     }
  const hoursLabel=()=>{
      let labels = [];
      for (let i = 0; i <= 12; i++) {
        labels.push(`${i.toString().length === 1 ? "0" : ""}${i}:00`)
      }
      console.log('label'+label);

      return labels;
    }

    const hoursMinCaption =()=>{
      let h = Math.floor(hBarMinValue / 60)
      let m = hBarMinValue % 60
      let hh = h.toString().length === 1 ? "0" : ""
      let mm = m.toString().length === 1 ? "0" : ""

      return `${hh}${h}:${mm}${m}`
    }

    const hoursMaxCaption = () => {
      let h = Math.floor(hBarMaxValue / 60)
      let m = hBarMaxValue % 60
      let hh = h.toString().length === 1 ? "0" : ""
      let mm = m.toString().length === 1 ? "0" : "";
      return `${hh}${h}:${mm}${m}`
    }
const onSubmit = () => {
 
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      axios.post(URL()+'/controller',{
        'Authorization': token(),
       
      
      },{'headers': { Authorization: token()}, }).then((response) => {
        console.log(response.data.data);
        let data = response.data.data
       
      })
      .catch((error) => {
          console.log(error)
      })
      emit('timezoneData', {
        id: 0,       
      
      
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

const status =[
  {
    title: 'UP',
    value: 'UP',
  },
  {
    title: 'DOWN',
    value: 'DOWN',
  },
]

const enabled =[
  {
    title: 'YES',
    value: 'true',
  },
  {
    title: 'NO',
    value: 'no',
  },
]

const devicetype =[
  {
    title: 'Standalone',
    value: 'Standalone',
  },
  {
    title: 'Two-Door',
    value: 'Two-Door',
  },
  {
    title: 'Three-Door',
    value: 'Three-Door',
  },
  
]

const sliderValues = ref([
  0.0,
  24.0,
])
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
    <h3 class="title-header">Timezone - Create</h3>
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
                  v-model="timezone_name"
                  :rules="[requiredValidator]"
                  label="Timezone Name"
                />
              </VCol>

              <!-- ?? Email -->
              <VCol cols="12">
                <VTextField
                  v-model="remarks"
                  :rules="[requiredValidator]"
                  label="Remarks"
                />
              </VCol>
             

            
             

              <VCol cols="12">
                <VRangeSlider v-model="monday_value" label="Monday" step="0.5" min="00" max="24"/>
              </VCol>
              <VCol cols="12">
                <VRangeSlider v-model="tuesday_value" label="Tuesday" step="0.5" min="00" max="24"/>
              </VCol>
              <VCol cols="12">
                <VRangeSlider v-model="wednessday_value" label="Wednessday" step="0.5" min="00" max="24"/>
              </VCol>
              <VCol cols="12">
                <VRangeSlider v-model="thursday_value" label="Thursday" step="0.5" min="00" max="24"/>
              </VCol>
              <VCol cols="12">
                <VRangeSlider v-model="friday_value" label="Friday" step="0.5" min="00" max="24"/>
              </VCol>
              <VCol cols="12">
                <VRangeSlider v-model="saturday_value" label="Saturday" step="0.5" min="00" max="24"/>
              </VCol>
              <VCol cols="12">
                <VRangeSlider v-model="sunday_value" label="Sunday" step="0.5" min="00" max="24"/>
              </VCol>

              <VCol cols="12">
                <VRangeSlider v-model="holiday_type1" label="Holiday 1" step="0.5" min="00" max="24" color="success" track-color="secondary"/>
              </VCol>
              <VCol cols="12">
                <VRangeSlider v-model="holiday_type2" label="Holiday 2" step="0.5" min="00" max="24"  color="success" track-color="secondary"/>
              </VCol>
              <VCol cols="12">
                <VRangeSlider v-model="holiday_type3" label="Hliday 3" step="0.5" min="00" max="24"  color="success" track-color="secondary"/>
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
