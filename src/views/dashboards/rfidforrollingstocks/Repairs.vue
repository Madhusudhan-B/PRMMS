
<script setup>

import ApexChartRepairs from '@/views/dashboards/rfidforrollingstocks/ApexChartRepairs.vue'

const props = defineProps({
 
 date:{
   type:String,
   required:true,
 }
})

</script>
<template>
  <VCard>
    
    <VCardText>
      <div class="pb-2">
        <h6 class="text-h6 mt-1">
          {{$t('Repairs')}}
        </h6>
       
      </div>     
      
          <ApexChartRepairs :date="props.date"/>
      
    </VCardText>
  </VCard>
</template>
