<script setup>
import { VForm } from 'vuetify/components'
import { useAppAbility } from '@/plugins/casl/useAppAbility'
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import axios from '@axios'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import jwt_decode from 'jwt-decode'

import { themeConfig } from '@themeConfig'
import {
  emailValidator,
  requiredValidator,
} from '@validators'
import authV2LoginIllustrationBorderedDark from '@images/pages/port-4.jpg'
import authV2LoginIllustrationBorderedLight from '@images/pages/port-4.jpg'
import authV2LoginIllustrationDark from '@images/pages/port-4.jpg'
import authV2LoginIllustrationLight from '@images/pages/port-4.jpg'
import authV2MaskDark from '@images/pages/port-4.jpg'
import authV2MaskLight from '@images/pages/port-4.jpg'
import prmmslogo from '@images/pages/prmms.png'
import logo from '@images/pages/omp-logo.png'
import microsoft from '@images/pages/microsoft.jpg'
import avatar1 from '@images/avatars/avatar-1.png'
import {users} from '@/helpers/helper'
//import {msalLogin} from '@/helpers/MSALhelper'
import {hostURL,URL} from '@/helpers/token'
import * as msal from 'msal';
import msalConfig from '../config'


const idToken=ref('')
const accessToken=ref('')

const isAlertVisible = ref(false)

const errors = ref({
  username: undefined,
  password: undefined,
  message: undefined
})
const err=ref('')

const msalLogin =()=>{
  const loginRequest = {
    scopes: ['openid', 'profile'],
    expiresIn: 600
  };
  const msalInstance = new msal.UserAgentApplication(msalConfig)
  msalInstance.loginPopup(loginRequest)
        .then((response) => {
         // console.log('Login success:', response);
         // msalInstance.logout()
          accessToken.value = response.idToken.rawIdToken

          idToken.value = response.idToken.rawIdToken;
        

      axios.post(URL()+`/user_management`,{
      
        'requestType':'view',
      
      }, { 'headers': { Authorization: 'Bearer '+accessToken.value } })
      .then((response) => {
        //console.log('Check user status')
        //console.log(response.data);
        let data = response.data.data
        //console.log(data);
          // Decode the ID token to access the user data
          const decodedToken = jwt_decode(idToken.value);
        //  console.log('Decoded token:', decodedToken);

          // Extract the user data from the decoded token
          // const userData = {
          //   name: decodedToken.name,
          //   email: decodedToken.email,
          //   role: decodedToken.roles[0],
          // };
          // console.log('User data:', userData);
           const abilitiesList =data.abilities

           if (abilitiesList.length === 0) {
             console.log("Abilities is empty!") 
             isAlertVisible.value = true
             err.value = 'Abilities not allowed to this user. Please contact the administrator for assistance.'
              return false
            
            }

           var abilitiesData=[]
           
           abilitiesList.forEach(item => {
           
            //console.log(item.sub_module.short_code);
            if(item.add_permission){
             
              abilitiesData.push({    action: 'create',subject: item.sub_module.short_code,})
                  }

            if(item.delete_permission){
            
              abilitiesData.push({    action: 'delete',subject: item.sub_module.short_code,})
           
            }

            if(item.edit_permission){
             
              abilitiesData.push({    action: 'update',subject: item.sub_module.short_code,})
                 }


            if(item.view_permission){

           
              abilitiesData.push({    action: 'read',subject: item.sub_module.short_code,})
           
            }

          });
         // console.log('abilitiesData')
          //console.log(abilitiesData)

          var roles=''
          if(data.access_type=='user'){
            roles=data.id
            abilitiesData=[]
            abilitiesData.push({    action: 'manage',subject: 'all',})
          }
          if(data.access_type=='role'){

            roles=data.role
            abilitiesData.push({    action: 'read',subject: 'USER_PROFILE',})
           
          }

          const  userData = {
    id: data.id,
    loginName: data.login_name,
    fullName: data.login_name,
    username: data.user_name,
    department: data.department,
    avatar: data.image_data,
    email: data.email,
    role: 'admin',
    abilities:abilitiesData
  
  }

  
    const userAbilities = abilitiesData
    
    localStorage.setItem('userAbilities', JSON.stringify(userAbilities))
      ability.update(userAbilities)
      localStorage.setItem('userData', JSON.stringify(userData))
      localStorage.setItem('accessToken', JSON.stringify(accessToken.value))

//       localStorage.setItem('accessDepartments', JSON.stringify(data.access_departments))
// console.log(userAbilities)
      // Redirect to `to` query if exist or redirect to index route
      router.replace(route.query.to ? String(route.query.to) : '/')

      
       
          })
          .catch((error) => {
             // console.log(error)
              isAlertVisible.value = true
              // console.log(error.message)
              // console.log(error.config)
             //console.log(error.response)
             if(error.response.status >= 400){
              err.value = "Application access is restricted. Please contact the administrator for assistance."
             }
             if(error.response.status < 400){
              err.value = error.response.data.error
            }
             
          })
   
        })
        .catch((error) => {
          //console.log('Login error:', error);
          isAlertVisible.value = true

         err.value = error
         //console.error(error)
         // msalInstance.logout()
        });
    
      // this.$AuthService.loginPopup() //with a popup
      //this.$AuthService.loginRedirect() //with a redirect
      
     // console.log(this.$AuthService)
    }



const authThemeImg = useGenerateImageVariant(authV2LoginIllustrationLight, authV2LoginIllustrationDark, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
// const authLogo = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
const isPasswordVisible = ref(false)
const route = useRoute()
const router = useRouter()
const ability = useAppAbility()
const refVForm = ref()

</script>

<template>
<div id="wrapper">
      <div id="right">
        <div id="signin">
        </div>
        <img :src="logo" style="height: 15%; position: absolute; top: 70%; left: 5%; background-color: #ffffff; padding: 15px 24px 15px 24px; border-radius: 24px; z-index: 2;"/>
      </div>
      <div id="left">
        <div id="showcase">
          <div class="showcase-content">
          <VCard  >
        <VCardText>
          <img
            max-width="505"
            :src="prmmslogo"
            style="height: 200px; margin-bottom: 30px; object-fit: contain !important; "
          />

          <p class="mb-0">
            Please sign-in to your account and start the adventure
          </p>
        </VCardText>

        <VCardText>
          <VForm ref="refVForm" @submit.prevent="onSubmit">
            <VRow>
              <VCol>
                <div class="alert-demo-v-model-wrapper">
                  <VAlert v-model="isAlertVisible" color="error" variant="tonal">
                    {{ err }}
                  </VAlert>
                </div>

                <VBtn style="padding-left: 72px; padding-right: 72px; margin-left: 33px;" type="button" @click="msalLogin">
                  <VImg style="position: absolute; z-index: 20; width: 21px; left: 40px;" :src="microsoft" />
                  Sign in with MICROSOFT
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
          </div>
        </div>
      </div>
    </div>
</template>

<style scoped>


html, body {
    min-block-size: 100% !important;
    padding: 0px !important;
}
#wrapper {
  display: flex;
  flex-direction: row;
}

#left {
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

#right {
  flex: 2;
}

/* Sign In */
#signin {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
/*   padding-bottom: 10rem; */
  height: 100%;
   background: url('https://omp.mudunuru.com/assets/port-4.b6211b0b.jpg') no-repeat center center / cover;
   box-shadow: 8px 0 8px -5px #333;
}

#signin form {
  width: 80%;
  padding-bottom: 3rem;
}

#signin .logo {
  margin-bottom: 8vh;
}

#signin .logo img {
  width: 300px;
}

#signin label {
  font-size: 0.9rem;
  line-height: 2rem;
  font-weight: 500;
}

#signin .text-input {
  margin-bottom: 1.3rem;
  width: 100%;
  border-radius: 2px;
  background: #181818;
  border: 1px solid #555;
  color: #ccc;
  padding: 0.5rem 1rem;
  line-height: 1.3rem;
}

#signin .primary-btn {
  width: 100%;
}

#signin .secondary-btn,
.or,
.links {
  width: 60%;
}

#signin .links a {
  display: block;
  color: #fff;
  text-decoration: none;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 0.9rem;
}

#signin .or {
  display: flex;
  flex-direction: row;
  margin-bottom: 1.2rem;
  align-items: center;
}

#signin .or .bar {
  flex: auto;
  border: none;
  height: 1px;
  background: #aaa;
}

#signin .or span {
  color: #ccc;
  padding: 0 0.8rem;
}

/* Showcase */
#showcase {
  display: flex;
  justify-content: center;
  align-items: center;
 
  height: 100vh;
  text-align: center;
}

#showcase .showcase-text {
  font-size: 3rem;
  width: 100%;
  color: #fff;
  margin-bottom: 1.5rem;
}

#showcase .secondary-btn {
  width: 60%;
  margin: auto;
}

/* Footer */
#main-footer {
  color: #ccc;
  text-align: center;
  font-size: 0.8rem;
  max-width: 80%;
  padding-top: 5rem;
}

#main-footer a {
  color: #f96816;
  text-decoration: underline;
}

/* Button */
.primary-btn {
  padding: 0.7rem 1rem;
  height: 2.7rem;
  display: block;
  border: 0;
  border-radius: 2px;
  font-weight: 500;
  background: #f96816;
  color: #fff;
  text-decoration: none;
  cursor: pointer;
  text-align: center;
  transition: all 0.5s;
}

.primary-btn:hover {
  background-color: #ff7b39;
}

.secondary-btn {
  padding: 0.7rem 1rem;
  height: 2.7rem;
  display: block;
  border: 1px solid #f4f4f4;
  border-radius: 2px;
  font-weight: 500;
  background: none;
  color: #fff;
  text-decoration: none;
  cursor: pointer;
  text-align: center;
  transition: all 0.5s;
}

.secondary-btn:hover {
  border-color: #ff7b39;
  color: #ff7b39;
}

/* Media Queries */
@media (min-width: 1200px) {
  #left {
    flex: 1;
  }

  #right {
    flex: 2;
  }
}

@media (max-width: 768px) {
  body {
    overflow: auto;
  }

  #right {
    display: none;
  }

  #left {
    justify-content: start;
    margin-top: 4vh;
  }

  #signin .logo {
    margin-bottom: 2vh;
  }

  #signin .text-input {
    margin-bottom: 0.7rem;
  }

  #main-footer {
    padding-top: 1rem;
  }
}

  </style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>