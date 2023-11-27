<script setup>
// Import the QueueServiceClient from the package
import { QueueServiceClient } from '@azure/storage-queue';

async function main() {
  const connectionString = 'DefaultEndpointsProtocol=https;AccountName=mudunurust;AccountKey=KQeKrT98nw3ZY773nw9MfxJLWpOyKDJWY34MoSmjDKnAH9KlXn+1Q9qwS4kyrezoXdHCBNm9EdI6+AStjqV3aw==;EndpointSuffix=core.windows.net';
  const queueServiceClient = new QueueServiceClient(connectionString);
   console.log('--QueueServiceClient')
   console.log(QueueServiceClient)
  // Now you can use the queueServiceClient to work with Azure Storage Queues
  // For example, you can create a queue:
  const queueName = 'mudunuru-test-queue';
  const queueClient = queueServiceClient.getQueueClient(queueName);
  console.log('--QueueServiceClient')
   console.log(queueClient)
 // await queueClient.create();
 

  console.log('--client create')
   
  // You can send a message to the queue:
  const message = 'Hello, Azure Queue Storage!';
  console.log('--client send message')
  await queueClient.sendMessage(message);

  // You can receive messages from the queue:
  const { receivedMessageItems } = await queueClient.receiveMessages();
  if (receivedMessageItems.length > 0) {
    console.log('Received message:', receivedMessageItems[0].messageText);
  }
}

main().catch((error) => {
  console.error('Error:', error);
});

</script>

<template>

  <div>

<VBtn >Retrive</VBtn>
    
  </div>
</template>

<route lang="yaml">
  meta:
    action: read
    subject: TEMPLATE_LAYOUT_WIZARD
  </route>