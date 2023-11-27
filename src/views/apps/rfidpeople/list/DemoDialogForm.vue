<script setup>
const isDialogVisible = ref(false)


const props = defineProps({

  valueUpdated: {
    type: String,
  
  },
})

const emit = defineEmits([
 
  'valueUpdated',
  
])


const handleCardData =(event)=>{
  
     // const keyCode = event.keyCode || event.which;
     // if (keyCode === 13) { // 13 is the Enter key code
        const cardInput = event.target.value;
        console.log('card input'+cardInput)
        emit('valueUpdated',cardInput)
      //}
      
    }

</script>

<template>
  <VDialog
    v-model="isDialogVisible"
    @update:model-value="handleDrawerModelValueUpdate"
    max-width="600"
  >
    <!-- Dialog Activator -->
    <template #activator="{ props }">
      <VBtn v-bind="props" style="font-size:10px !important">
      Card Reader
      </VBtn>
    </template>

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

    <!-- Dialog Content -->
    <VCard >
      <VCardText>
        <VRow>
          <VCol
          cols="12"
         
        >
        <h2>Tap the card on the card reader</h2>
        </VCol>
          <VCol
            cols="12"
           
          >
            <VTextField
              v-model="props.dataCard"
              label="Card no"
              @input="handleCardData"
            />
          </VCol>
         
          
          <VCol
          cols="12"
         
        >
        </VCol>
        
          
         
        </VRow>
      </VCardText>

     
    </VCard>
  </VDialog>
</template>



