export default {
    auth: {
        // clientId: '94adce56-91a8-4db1-9ed9-94fa69ab9613',
        // authority: 'https://login.microsoftonline.com/a2ab47da-3b49-4f99-be15-0cc2cd3ec287',
        // redirectUri: 'https://omp.mudunuru.com/',
        // graphendpoint: 'https://graph.microsoft.com/v1.0/me',
        // graphscopes: ['user.read', 'mail.read']

        clientId: import.meta.env.VITE_MSAL_CLIENTID,
        authority: import.meta.env.VITE_MSAL_AUTHORITY,
        redirectUri: import.meta.env.VITE_MSAL_REDIRECTURI,
        graphendpoint: import.meta.env.VITE_MSAL_GRAPHENDPOINT,
        graphscopes: ['user.read', 'mail.read'],
        vault_authority: import.meta.env.VITE_MSAL_VAULT_AUTHORITY,

    },
    cache: {

        cacheLocation: "localStorage",
        storeAuthStateInCookie: true,
        // 10 minutes in seconds
    },


}