// Import the necessary packages 
import { MsalPlugin, msalInstance } from 'vue-msal' 
import axios from 'axios' 




// Initialize the MSAL plugin with the Azure AD application ID and redirect URI 
Vue.use(MsalPlugin, { 
  auth: { 
    clientId: '093daaf3-0ca0-450e-970a-50e5f486e2b3', 
    redirectUri: 'https://omp.mudunuru.com/' 
  }, 
  cache: { 
    cacheLocation: 'sessionStorage' 
  } 
}) 


export const msalLogin = () => {
  
    // Initiate the Azure AD authentication flow 
    msalInstance.loginRedirect() 
  


}
