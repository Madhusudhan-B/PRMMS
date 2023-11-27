<script setup>
import RfidforPeople from '@/views/dashboards/rfidforpeople/RfidForPeople.vue'

import RfidForRollingStocks from '@/views/dashboards/rfidforrollingstocks/RfidForRollingStocks.vue'

import PerimeterMap from '@/views/dashboards/perimeter/PerimeterMap.vue'

import cctvmap from '@/views/dashboards/cctv/cctvmap.vue'



//document.getElementById('btn-rfidmap').style.display="none" 
</script>

<template>
    <VCard>
        <VRow>
            <!-- ?? RFID For People -->
            <VCol cols="6">
                <RfidforPeople  />
            </VCol>
              <!-- ?? RFID For Rolling stock -->
              <VCol cols="6">
                <RfidForRollingStocks />
              </VCol>
                 <!-- ??perimeter -->
                <VCol cols="6">
                    <PerimeterMap />
                </VCol>

                  <!-- ?? cctv -->
                  <VCol cols="6">
                    <cctvmap />
                    </VCol>





        </VRow>


    </VCard>

</template>


