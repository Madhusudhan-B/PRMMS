<script setup>

import UserBioPanel from '@/views/apps/user/view/UserBioPanel.vue'

 import UserTabOverview from '@/views/apps/user/view/UserTabOverview.vue'

</script>

<template>

  <VRow>
    <VCol
      cols="12"
      md="5"
      lg="4"
    >
      <UserBioPanel />
    </VCol>

    <VCol
      cols="12"
      md="7"
      lg="8"
    >
    <UserTabOverview />
    </VCol>
    <VCol cols="12" md="6">
                        
                        <VBtn
                 
                  :to="{ name: 'rfidforrollingstocks-rolling-stocks-reader' }"
                  color="secondary"
                 
                >
                Back
                </VBtn>
                           
                      
                    </VCol>
                            
              
     
  </VRow>
</template>
<route lang="yaml">
  meta:
    action: create
    subject: RS_READER
  </route>
