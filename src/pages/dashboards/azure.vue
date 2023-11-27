<template> 
  <div> 
    <h1>Secrets from Azure Key Vault</h1> 
    <div> 
      <h2>Get Secrets</h2> 
      <ul v-if="secrets.length"> 
        <li v-for="secret in secrets" :key="secret.name">{{ secret.name }}</li> 
      </ul> 
      <p v-else>No secrets found.</p> 
    </div> 
    <div> 
      <h2>Set Secret</h2> 
      <div> 
        <input v-model="secretName" type="text" placeholder="Secret Name" /> 
        <input v-model="secretValue" type="text" placeholder="Secret Value" /> 
        <button @click="setSecret">Set Secret</button> 
      </div> 
    </div> 
  </div> 
</template> 
 
<script> 
import { SecretClient } from '@azure/keyvault-secrets' 
import { DefaultAzureCredential,InteractiveBrowserCredential } from '@azure/identity' 
import axios from 'axios'
import { serverURL, URL, token } from "@/helpers/token"

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

 
export default { 
  data() { 
    return { 
      secrets: [], 
      secretName: '', 
      secretValue: '', 
    }; 
  }, 
  async created() { 
    try { 
      //const token = await this.getAccessToken(); 
      const vaultUrl = import.meta.env.VITE_AZURE_VALUE_URI; // Replace with your Azure Key Vault URL 
     // Get the access token
      // client_id:94adce56-91a8-4db1-9ed9-94fa69ab9613
      //client_secret:'PfN8Q~wXbZ.AeyzH-zRpadAHpV~VRwbzlUBOLbVU',
     const credential = new InteractiveBrowserCredential({
                      //  clientId: import.meta.env.VITE_MSAL_CLIENTID,
                        grant_type:'client_credentials',
                        // clientId:'72095d19-16c0-4354-b43a-605ffc55cf78',
                        // clientSecret:'kv_8Q~F16V2tkCYGtRkStH6p-Ee3lJaC_vcvbcos',
                        clientId:'94adce56-91a8-4db1-9ed9-94fa69ab9613',
                        clientSecret:'PfN8Q~wXbZ.AeyzH-zRpadAHpV~VRwbzlUBOLbVU',
                        resource:'https://vault.azure.net',
                        scope:'api://a2ab47da-3b49-4f99-be15-0cc2cd3ec287/.default',
                       
                        // client_secret:'PfN8Q~wXbZ.AeyzH-zRpadAHpV~VRwbzlUBOLbVU',
                        // scope:'api://a2ab47da-3b49-4f99-be15-0cc2cd3ec287/.default'
                      });
      
      const tokenResponse = await credential.getToken('https://mudunuru-vault.vault.azure.net/.default');
      const accessToken = tokenResponse?.token;
      console.log(accessToken)
      const secretClient = new SecretClient(vaultUrl, new InteractiveBrowserCredential({
                      //  clientId: import.meta.env.VITE_MSAL_CLIENTID,
                        grant_type:'client_credentials',
                        clientId:'72095d19-16c0-4354-b43a-605ffc55cf78',
                        clientSecret:'kv_8Q~F16V2tkCYGtRkStH6p-Ee3lJaC_vcvbcos',
                        resource:'https://vault.azure.net',
                        scope:'api://a2ab47da-3b49-4f99-be15-0cc2cd3ec287/.default',
                       
                        // client_secret:'PfN8Q~wXbZ.AeyzH-zRpadAHpV~VRwbzlUBOLbVU',
                        // scope:'api://a2ab47da-3b49-4f99-be15-0cc2cd3ec287/.default'
                      })); 
 
      const secrets = await secretClient.listPropertiesOfSecrets(); 
      console.log(secrets)
      this.secrets = secrets.map((secret) => ({ 
       
        name: secret.name, 
      })); 
    } catch (error) { 
      console.error('Error fetching secrets:', error); 
    } 
  }, 
  methods: { 
    async getAccessToken() { 
      // Replace the following values with your Azure AD credentials and tenant ID 
      const clientId = import.meta.env.VITE_MSAL_CLIENTID; 
      const clientSecret = import.meta.env.VITE_MSAL_CLIENTSECRET; 
      const tenantId = import.meta.env.VITE_MSAL_TENANTID; 
 
      const url = import.meta.env.VITE_MSAL_VAULT_AUTHORITY; 
 
      const requestBody = new URLSearchParams(); 
      requestBody.append('grant_type', 'client_credentials'); 
      requestBody.append('client_id', clientId); 
      requestBody.append('client_secret', clientSecret); 
      requestBody.append('resource', 'https://vault.azure.net/'); 
      requestBody.append('scope', 'api://a2ab47da-3b49-4f99-be15-0cc2cd3ec287/.default'); 
      
      //requestBody.append('scope', 'api://94adce56-91a8-4db1-9ed9-94fa69ab9613/.default');
      const response = await axios.post(url, requestBody).catch(error => {
                  // Handle the error
                  if (error.response) {
                    // The request was made, but the server responded with an error status code (e.g., 404, 500, etc.)
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                  } else if (error.request) {
                    // The request was made, but no response was received
                    console.log(error.request);
                  } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                  }
                  console.log(error.config);
                }); 
 
      return response.data.access_token; 
    }, 
    async setSecret() { 
      try { 
       // const token = await this.getAccessToken(); 
        const vaultUrl = import.meta.env.VITE_AZURE_VALUE_URI; // Replace with your Azure Key Vault URL 
        const secretClient = new SecretClient(vaultUrl, new InteractiveBrowserCredential({
                      //  clientId: import.meta.env.VITE_MSAL_CLIENTID,
                        grant_type:'client_credentials',
                        clientId:'72095d19-16c0-4354-b43a-605ffc55cf78',
                        clientSecret:'kv_8Q~F16V2tkCYGtRkStH6p-Ee3lJaC_vcvbcos',
                        resource:'https://vault.azure.net',
                        scope:'api://a2ab47da-3b49-4f99-be15-0cc2cd3ec287/.default',
                       
                        // client_secret:'PfN8Q~wXbZ.AeyzH-zRpadAHpV~VRwbzlUBOLbVU',
                        // scope:'api://a2ab47da-3b49-4f99-be15-0cc2cd3ec287/.default'
                      })); 
 
        await secretClient.setSecret(this.secretName, this.secretValue); 
        alert('Secret set successfully!'); 
      } catch (error) { 
        console.error('Error setting secret:', error); 
      } 
    }, 
  }, 
}; 
</script>

<route lang="yaml">
  meta:
    action: read
    subject: TEMPLATE_LAYOUT_WIZARD
  </route>
