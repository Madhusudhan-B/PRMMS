<script setup>
  import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
  import axios from 'axios';
  
  import { location,getnvrList,getsegmentList, cctvzoneList} from '@/helpers/helper'
  import {URL, token} from '@/helpers/token'
  
  
  import {
    //emailValidator,
    requiredValidator,
  } from '@validators'
  
  
  const props = defineProps({
    isDrawerOpen: {
      type: Boolean,
      required: true,
    },
    datacctv: {
      type: String,
      required: true,
    },
  })
  
  const emit = defineEmits([
    'update:isDrawerOpen',    
    'datacctv',
    'cctvData',
  ])
  
  const isFormValid = ref(false)
  const refForm = ref()
  const ip = ref('')
  const devicename = ref('')
  const port = ref('')
  const password = ref('')
   const user_id = ref('')
    const nvr = ref('')
    const segment=ref('')
    const selectedLocation = ref()
   const selectedSegment = ref()
   const selectedStatus = ref()
   const subsystem_id = ref('')

   const locationList=location()
   const nvrList=getnvrList()
   const segmentList=getsegmentList()
   const zonelist=cctvzoneList()

  
  // ?? drawer close
  const closeNavigationDrawer = () => {
    emit('update:isDrawerOpen', false)
    // nextTick(() => {
    //   refForm.value?.reset()
    //   refForm.value?.resetValidation()
    // })
  }
  
  const onUpdate = () => {
   

    refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      axios.post(URL()+'/cctv', {
       
        'requestType':'update',
        'cctv_data':{
          cctv_id:props.datacctv.id,
          device_name:props.datacctv.device_name,
          ip_address: props.datacctv.ip_address,
          port:props.datacctv.port,
         
          location: props.datacctv.location.id,
          cctv_zone_id:props.datacctv.cctv_zone_id,
          nvr:props.datacctv.nvr.id,
          segment:props.datacctv.segment.id
          
      
        } ,
        subsystem_id:1,
       
       
      
        
       
      },{'headers': { Authorization: token()}, })
      .then((response) => {
     
        console.log(response.data.data);
        let data = response.data.data
        emit('cctvData', {
              status:'success',
            data:{
              id:props.datacctv.id,
          device_name:props.datacctv.device_name,
          ip_address: props.datacctv.ip_address,
          port:props.datacctv.port,
         
          location: props.datacctv.location.id,
         
          nvr:props.datacctv.nvr.id,
          segment:props.datacctv.segment.segment_id
          },
          subsystem_id:1,
            message:'CCTV Successfully Updated'     
          
          
          })
       
      })
      .catch((error) => {
        console.log(error)
          emit('cctvData', {
      status:'failed',
      data:{
        id:props.datacctv.id,
          device_name:props.datacctv.device_name,
          ip_address: props.datacctv.ip_address,
          port:props.datacctv.port,
         
          location: props.datacctv.location.id,
         
          nvr:props.datacctv.nvr.id,
          segment:props.datacctv.segment.segment_id
      },
      subsystem_id:1,
      message:error
     
      })
      })

      emit('update:isDrawerOpen', false)
      // emit('datadevice', {
      //   id: 0,       
      //   device_name:props.datadevice.device_name,
      //   ip_address:props.datadevice.ip_address,
      //   port:props.datadevice.port,
       
       
      
      // })
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
        <h3 class="title-header" >
        {{$t('CCTV - Update')}}
      </h3>
  
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
              @submit.prevent="onUpdate"
            >
              <VRow>
                <!-- ?? Full name -->
                 <VCol cols="12" hidden>
               <VTextField 
                  v-model="props.datacctv.id"
                  :rules="[requiredValidator]"                 
                  
                />
                </VCol>
                <VCol cols="12">
                  <VTextField
                    v-model="props.datacctv.ip_address"
                    :rules="[requiredValidator]"
                    label="IP"
                    
                  />
                </VCol>
  
                <!-- ?? Email -->
                <VCol cols="12">
                  <VTextField
                    v-model="props.datacctv.port"
                    :rules="[requiredValidator]"
                    label="Port"
                   
                  />
                </VCol>
               
  
             
  
  
                 <VCol cols="12">
                <VTextField
                    v-model="props.datacctv.device_name"
                    label="Device Name"
                    :rules="[requiredValidator]"
                  
                  />
                </VCol>
                <VCol cols="12">
                <VSelect
                    v-model="props.datacctv.location"
                    label="Select Location"
                    :rules="[requiredValidator]"
                    :items="locationList"
                  />
                </VCol>
                 <!--VCol cols="12">
                  <VTextField
                    v-model="props.datacctv.user_name"
                    :rules="[requiredValidator]"
                    label="User ID"
                   
                  />
                </VCol>
               
                <VCol cols="12">
                  <VTextField
                    v-model="props.datacctv.password"
                    :rules="[requiredValidator]"
                    label="Password"
                  />
                </VCol -->
               
                <VCol cols="12">
                <VSelect
                    v-model="props.datacctv.nvr"
                    label="Select NVR"
                    :rules="[requiredValidator]"
                    :items="nvrList"
                  />
                </VCol>
                <VCol cols="12">
              <VSelect
                  v-model="props.datacctv.cctv_zone_id"
                  label="Select Subsystem"
                  :rules="[requiredValidator]"
                  :items="zonelist"
                />
              </VCol>
  
                <VCol cols="12">
                <VSelect
                    v-model="props.datacctv.segment"
                    label="Select Segment"
                    :rules="[requiredValidator]"
                    :items="segmentList"
                  />
                </VCol>
              
                <!-- ?? Submit -->
                <VCol cols="12">
                  <VBtn
                    type="submit"
                    class="me-3"
                  >
                    Update
                  </VBtn>
                  
                </VCol>
              </VRow>
            </VForm>
          </VCardText>
        </VCard>
      </PerfectScrollbar>
    </VNavigationDrawer>
  </template>
  