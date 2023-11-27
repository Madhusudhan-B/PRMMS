// utils.js
import axios from '@axios'
import {  token } from "@/helpers/token"

export const encrypt = (plaintext)=>{
    try {
        // # Azure Key Vault URL and key name 
        const   key_vault_url =import.meta.env.VITE_MSAL_KEY_VAULT_URL //Replace with your Azure Key Vault URL
        const key_name =import.meta.env.VITE_MSAL_KEY_NAME  // Replace with your Key Vault key name
        //# Azure Key Vault access token endpoint
       // const token_url = 'https://login.microsoftonline.com/a2ab47da-3b49-4f99-be15-0cc2cd3ec287/oauth2/token'  //# Replace with your Azure AD tenant ID

        //# Azure AD authentication parameters
       // const client_id = '94adce56-91a8-4db1-9ed9-94fa69ab9613'  //# Replace with your Azure AD application's client ID
       //const client_secret = '6PV8Q~GfgPnhtZy5vpuhHOeeCNX3TR6luZ7EsaED' /// # Replace with your Azure AD application's client secret
        //const tenant_id = 'a2ab47da-3b49-4f99-be15-0cc2cd3ec287' // # Replace with your Azure AD tenant ID

        const response =  axios.post( 
            key_vault_url+'/keys/'+ key_name+'/encrypt?api-version=7.2',
       
          { 
            
            'alg': 'RSA-OAEP',
            'value':plaintext
          }, 
          { 
            headers: { 
              'Content-Type': 'application/json', 
              'Authorization': token() 
            } 
          } 
        ); 
 
        let encryptedText = response.data.result
        console.log('encryption test'+encryptedText)
      } catch (error) { 
        console.error(error); 
      } 
  }