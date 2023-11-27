<script setup>
import { useTheme } from 'vuetify'
import videowall from '@/views/dashboards/wallpanel/panel.vue'
import {URL, token} from '@/helpers/token'
import axios from '@axios'

const rowPerPage = ref(5)
    const currentPage = ref(1)
    const totalPage = ref(1)
    const totalpanels = ref(0)
    const panel = ref([])
    const rpanel = ref([])
    


const fetchPanel = () => {
        axios
            .post(
                URL() + `/wallpanel_template`,
                {
                    requestType: "view",
                    offset: 0,
                    limit: 100,
                },
                { headers: { Authorization: token() } }
            )
            .then((response) => {
                //   this.listings = response.data;
                console.log(response.data.data);
                const data = response.data.data;
           
                
                rpanel.value = data;
               
                panel.value = data
              
            })
            .catch((error) => {
                // isErrorAlertVisible.value = true
                // isAlertVisible.value = false
                // err.value = error
                console.error(error)
                console.log(error)
            })
    }




    watchEffect(fetchPanel())


</script>

<template>
   <section>
  <VRow >
    <!-- 👉 Earning Report Weekly Overview    -->
 

    <VCol
    v-for="(paneldata,index) in panel" :key="paneldata.id"
        :title="paneldata.template_name"
        cols="12"
        sm="6"
        lg="3"
        
      >
      
        <VCard>
          <VCardText>
              <h3 class="title-header">{{paneldata.template_name}}</h3>
          </VCardText>
           <!-- 👉 Add New User -->
          <videowall
           :rowid=paneldata.id
           
          />
          <!--VCardText class="d-flex justify-space-between">
            <div v-for=" i in paneldata.no_of_rows" style="border:1px solid #cdcdcd; float:left" >
              
              <div v-for=" j in paneldata.no_of_columns" style="border:1px solid #cdcdcd;float:left; width:10px; height:20px" >
               
              </div>
             
            </div>

            
          </VCardText -->
        </VCard>
      </VCol>

  </VRow>

</section>
</template>

<route lang="yaml">
  meta:
    action: read
    subject: TEMPLATE_LAYOUT_WIZARD
  </route>
