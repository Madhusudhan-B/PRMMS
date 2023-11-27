<script setup>
import RfidforPeople from '@/pages/dashboards/rfid-for-people.vue'

import RfidForRollingStocks from '@/pages/dashboards/rfid-for-rolling-stocks.vue'

import PerimeterMap from '@/pages/dashboards/perimeter.vue'

import cctvmap from '@/pages/dashboards/cctv.vue'

import Attendance from '@/views/dashboards/rfidforpeople/Attendance.vue'
import Logs from '@/views/dashboards/rfidforpeople/Logs.vue'
import Inout from '@/views/dashboards/rfidforpeople/Inout.vue'



//document.getElementById('btn-rfidmap').style.display="none" 
</script>

<template>
    <VCard>
        <VRow>
            <!-- ?? RFID For People -->
            <VCol cols="6" class="custom-element" >
              <RfidforPeople />
            </VCol>
              <!-- ?? RFID For Rolling stock -->
              <VCol cols="6" class="custom-element">
                <RfidForRollingStocks />
              </VCol>
                 <!-- ??perimeter -->
                <VCol cols="6" class="custom-element">
                    <PerimeterMap />
                </VCol>

                  <!-- ?? cctv -->
                  <VCol cols="6" class="custom-element" >
                    <cctvmap />
                    </VCol>





        </VRow>


    </VCard>

</template>
<style>
  .custom-element {
    height: 50vh; /* 50% of the viewport height */
    /* Other styling properties */
   
    overflow-y: scroll;
  }

  @media (max-width: 768px) {
    /* Adjust height for smaller screens */
    .custom-element {
      height: 40vh; /* Adjusted height for smaller screens */
    }
  }
</style>


