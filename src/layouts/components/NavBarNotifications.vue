<script setup>
import Notifications from '@core/components/Notifications.vue'

// Images
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
import avatar5 from '@images/avatars/avatar-5.png'
import paypal from '@images/svg/paypal.svg'

import { serverURL, URL, token } from "@/helpers/token"
import axios from 'axios'
import Azureconfig from '../../config/Azureconfig.js'


// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
const accessToken = JSON.parse(localStorage.getItem('accessToken') || 'null')
const url = Azureconfig.url.server_url+Azureconfig.url.notification_list
console.log('notifications...')
const notificationlist=ref([])
const totalcount=ref(0)
const notification_list = (limit)=>{
  const userData = JSON.parse(localStorage.getItem('userData') || 'null')
  
    axios
            .post(
              url,
              {
                limit:limit,
                userId:userData.id
              },
                { headers: { Authorization: token() } }
            )
 .then((response) => {
//   console.log('Check user status')
   console.log(response.data);
   let data = response.data
   notificationlist.value=data.msg
   totalcount.value=data.count
    
    })
    .catch((error) => {
        console.log(error)
    
       console.log(error.response)
      
       
    })
}
watchEffect(notification_list(5))


onMounted(() => {
 // notification_list(5)
  
  // Set up event listener to update the count automatically (e.g., when a new message is added)
  // const eventSource = new EventSource(Azureconfig.url.server_url+Azureconfig.url.notification_list); // Adjust the endpoint
  
  // eventSource.addEventListener('message', (event) => {
  //   messageCount.value = JSON.parse(event.data).count; // Adjust the property name
  // });

  // eventSource.addEventListener('error', (error) => {
  //   console.error('EventSource error:', error);
  //   eventSource.close();
  // });
});
const notifications = [
  {
    img: avatar4,
    title: 'Congratulation Flora! 🎉',
    subtitle: 'Won the monthly best seller badge',
    time: 'Today',
  },
  {
    text: 'Tom Holland',
    title: 'New user registered.',
    subtitle: '5 hours ago',
    time: 'Yesterday',
  },
  {
    img: avatar5,
    title: 'New message received 👋🏻',
    subtitle: 'You have 10 unread messages',
    time: '11 Aug',
  },
  {
    img: paypal,
    title: 'Paypal',
    subtitle: 'Received Payment',
    time: '25 May',
    color: 'error',
  },
  {
    img: avatar3,
    title: 'Received Order 📦',
    subtitle: 'New order received from john',
    time: '19 Mar',
  },
]


const readAllNotifications = () => {
  // Handle reading all notifications here
  watchEffect(notification_list(20))
}

const readFiveNotifications = () => {
  // Handle reading all notifications here
  watchEffect(notification_list(5))
}
</script>

<template>
  <Notifications :notifications="notificationlist"  @click:readAllNotifications="readAllNotifications" @click:readFiveNotifications="readFiveNotifications" :totalcount="totalcount"  />

</template>
