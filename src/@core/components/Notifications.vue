<script setup>
import { avatarText } from '@core/utils/formatters'
import { serverURL, URL, token } from "@/helpers/token"
import axios from 'axios'
import Azureconfig from '../../config/Azureconfig.js'

import moment from 'moment'
const isDialogVisible = ref(false)
const msgtitle=ref('')


const props = defineProps({
  
  notifications: {
    type: Array,
    required: true,
  },
  totalcount:{
   type:null,
   required:true
  },
  badgeProps: {
    type: null,
    required: false,
    default: undefined,
  },
  location: {
    type: null,
    required: false,
    default: 'bottom end',
  },
})

const emit = defineEmits(['click:readAllNotifications','click:readFiveNotifications'])

const conversion = (msg) =>{
  return atob(msg.replace(/"/g, ''))
}
const opendialog = (msg,messageId,popReceipt) =>{
  isDialogVisible.value = true
  // msgtitle.value =conversion(msg)
  msgtitle.value =msg
  document.getElementById(messageId).style.display="none"
  const url = Azureconfig.url.server_url+Azureconfig.url.notification_delete
  const userData = JSON.parse(localStorage.getItem('userData') || 'null')
  axios.post(
              url,{
                userId:userData.id,
                messageId:messageId,
                popReceipt:popReceipt
               
              },
              
                { headers: { Authorization: token() } }
            )
.then((response) => {
//   console.log('Check user status')
   console.log(response.data);
   let data = response.data
   emit('click:readFiveNotifications')
   
  // notificationlist.value=data
  //props.notifications=data
 

    })
    .catch((error) => {
        console.log(error)
    
       console.log(error.response)
      
       
    })
}

// const viewmore=() =>{
   
//    watchEffect(notification_list(20))
// }
</script>

<template>
  <VBadge
    :model-value="!!props.badgeProps"
    v-bind="props.badgeProps"
  >
    <VBtn
      icon
      variant="text"
      color="default"
      size="small"
    >
      <VBadge
        :model-value="!!props.notifications.length"
        color="error"
        :content="props.totalcount"
      >
        <VIcon
          icon="tabler-bell"
          size="24"
        />
      </VBadge>

      <VMenu
        activator="parent"
        width="380px"
        :location="props.location"
        offset="14px"
      >
        <VList class="py-0">
          <!-- 👉 Header -->
          <VListItem
            title="Notifications"
            class="notification-section"
            height="48px"
          
          >
            <template #append>
              <VChip
                v-if="props.notifications.length"
                color="primary"
                size="small"
              >
                {{ props.notifications.length }} New
              </VChip>
            </template>
          </VListItem>

          <VDivider />

          <!-- 👉 Notifications list -->
          <template
            v-for="notification in props.notifications"
            :key="notification.messageText"
            
          >
          <!-- :title="conversion($t(notification.messageText))""-->
            <VListItem
            @click="opendialog(notification.messageText,notification.messageId,notification.popReceipt)"
             :title="$t(notification.messageText)"
             :id="notification.messageId"
              link
              lines="one"
              min-height="66px"
            >


          
              <!-- :subtitle="notification.subtitle" Slot: Prepend -->
              <!-- Handles Avatar: Image, Icon, Text >
              <template #prepend>
                <VListItemAction start>
                  <VAvatar
                    :color="notification.color || 'primary'"
                    :image="notification.img || undefined"
                    :icon="notification.icon || undefined"
                    size="40"
                    variant="tonal"
                  >
                    <span v-if="notification.text">{{ avatarText(notification.text) }}</span>
                  </VAvatar>
                </VListItemAction>
              </template>
              <-- Slot: Append -->
              <template #append>
                <small class="whitespace-no-wrap text-medium-emphasis">{{ moment(notification.insertedOn).format('DD-MM-YYYY h:mm:ss') }}</small>
              </template>
            </VListItem>
            <VDivider />
          </template>

          <!-- 👉 Footer   -->
          <VListItem class="notification-section" v-if="totalcount>5">
            <VBtn
              block
            
              @click="$emit('click:readAllNotifications')"
            >
              READ ALL NOTIFICATIONS
            </VBtn>
          </VListItem>
        </VList>
      </VMenu>
    </VBtn>
  </VBadge>

  <template>
 <!-- Dialog -->
 <VDialog
    v-model="isDialogVisible"
    class="v-dialog-sm"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisible = false" />

    <VCard title="Dialog">
      <VCardText id="viewtitle">
       {{$t(msgtitle)}}
         </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn
          variant="tonal"
          color="secondary"
          @click="isDialogVisible = false"
        >
          Close
        </VBtn>
       
      </VCardText>
    </VCard>
  </VDialog>
            </template>
</template>

<style lang="scss">
.notification-section {
  padding: 14px !important;
}
</style>
