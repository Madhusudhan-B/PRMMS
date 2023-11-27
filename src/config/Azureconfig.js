export default {
    url: {
        server_url:'https://omp.mudunuru.com:9445/',
        notification_list:'api/storage-queue',
        notification_delete:'api/delete-storage-queue',
        create_queue:'api/create-storage-queue',
        qrcode:'api/qrcode'

    },
    credential: {

        cacheLocation: "localStorage",
        storeAuthStateInCookie: true,
        // 10 minutes in seconds
    },


}