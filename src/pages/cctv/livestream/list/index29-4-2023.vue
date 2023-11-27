<script setup>

const openhik = () =>{
    window.open("http://192.168.1.172/#/",'winname','directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350');
 
}


const opencam = () =>{
    window.open("http://admin:mudunuru123@192.168.1.232/ISAPI/Streaming/channels/102/httpPreview",'winname','directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350');
 
}

const opennvr = () =>{
    window.open("http://192.168.1.230/doc/page/login.asp?_1682057745088",'winname','directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350');
 
}
</script>

<template>
  <section>
    <VRow>
      

      <VCol cols="12">
      <VCard >
       

          <VDivider />



          <VDivider />

          <VCardText class="d-flex flex-wrap py-4 gap-4">
          
          <!-- ?? Add user button -->
          <VBtn
            
            @click="openhik"
          >
            HIK CENTRAL 
          </VBtn>

          <VBtn
            
            @click="opencam"
          >
            OPEN CAMERA
          </VBtn>

          <VBtn
            
            @click="opennvr"
          >
            OPEN NVR
          </VBtn>
       
       
      </VCardText>
          <VDivider />

         
        </VCard>
      </VCol>
    </VRow>

  

  </section>
</template>

