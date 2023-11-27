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
import logo from '@images/pages/omp-logo.png'
import avatar1 from '@images/avatars/avatar-1.png'
import {users} from '@/helpers/helper'
//import {msalLogin} from '@/helpers/MSALhelper'
import {hostURL} from '@/helpers/token'
import * as msal from 'msal';
import msalConfig from '../config'



const msalLogin =()=>{
  const loginRequest = {
    scopes: ['openid', 'profile'],
    expiresIn: 600
  };
  const msalInstance = new msal.UserAgentApplication(msalConfig)
  msalInstance.loginPopup(loginRequest)
        .then((response) => {
          console.log('Login success:', response);
         // msalInstance.logout()
         const accessToken = response.idToken.rawIdToken

         const idToken = response.idToken.rawIdToken;
          console.log('ID token:', idToken);
          // Decode the ID token to access the user data
          const decodedToken = jwt_decode(idToken);
          console.log('Decoded token:', decodedToken);

          // Extract the user data from the decoded token
          // const userData = {
          //   name: decodedToken.name,
          //   email: decodedToken.email,
          //   role: decodedToken.roles[0],
          // };
          // console.log('User data:', userData);

          const  userData = {
    id: 1,
    fullName: decodedToken.name,
    username: decodedToken.name,
    //password: 'admin',
    avatar: avatar1,
    email: decodedToken.email,
    role: 'admin',
    abilities: [
      {
        action: 'manage',
        subject: 'all',
      },
    ],
  }
    const userAbilities = [
      {
        action: 'manage',
        subject: 'all',
      },
    ]

    
    localStorage.setItem('userAbilities', JSON.stringify(userAbilities))
    ability.update(userAbilities)
    localStorage.setItem('userData', JSON.stringify(userData))
    localStorage.setItem('accessToken', JSON.stringify(accessToken))

    // Redirect to `to` query if exist or redirect to index route
    router.replace(route.query.to ? String(route.query.to) : '/')
   
        })
        .catch((error) => {
          console.log('Login error:', error);
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

const errors = ref({
  username: undefined,
  password: undefined,
})




const refVForm = ref()
const username = ref('apiuser')
const password = ref('zxcv4321')
const rememberMe = ref(false)
const usersdata= ref([])
const usertoken=ref('')

const login = () => {
  

  var urlencoded = new URLSearchParams();
                            urlencoded.append("grant_type", "password");
                            urlencoded.append("username",username.value);
                            urlencoded.append("password", password.value);
                            urlencoded.append("client_id", "client1");
                            urlencoded.append("client_secret", "zxcv4321");
  axios.post(hostURL()+'/o/token/',urlencoded).then(r => {
    const accessToken = r.data.access_token

    const  userData = {
    id: 1,
    fullName: 'John Doe',
    username: 'johndoe',
    password: 'admin',
    avatar: avatar1,
    email: 'admin@demo.com',
    role: 'admin',
    abilities: [
      {
        action: 'manage',
        subject: 'all',
      },
    ],
  }
    const userAbilities = [
      {
        action: 'manage',
        subject: 'all',
      },
    ]

    
    localStorage.setItem('userAbilities', JSON.stringify(userAbilities))
    ability.update(userAbilities)
    localStorage.setItem('userData', JSON.stringify(userData))
    localStorage.setItem('accessToken', JSON.stringify(accessToken))

    // Redirect to `to` query if exist or redirect to index route
    router.replace(route.query.to ? String(route.query.to) : '/')
   

   }).catch(e => {
    console.log(e)
    // const { errors: formErrors } = e.response.data

    // errors.value = formErrors
    // console.error(e.response.data)
  })
}

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      login()
  })
}
</script>

<template>
  <VRow
    no-gutters
    class="auth-wrapper"
  >
    <VCol
      lg="8"
      class="d-none d-lg-flex"
    >
      <div class="position-relative auth-bg rounded-lg w-100 ma-8 me-0">
      <VImg
            max-width="100%"
            :src="authThemeImg"
           
          />
        

        <!-- <VImg
          :src="authThemeMask"
          class="auth-footer-mask"
        /> -->
      </div>
    </VCol>

    <VCol
      cols="12"
      lg="4"
      class="d-flex align-center justify-center"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-4"
      >
        <VCardText>
        <VImg
            max-width="505"
            :src="logo"
            style="height: 135px; margin-bottom:30px"
          />

        
          <p class="mb-0">
            Please sign-in to your account and start the adventure
          </p>
        </VCardText>
        <!-- <VCardText>
          <VAlert
            color="primary"
            variant="tonal"
          >
            <p class="text-caption mb-2">
              Admin Email: <strong>admin@demo.com</strong> / Pass: <strong>admin</strong>
            </p>
            <p class="text-caption mb-0">
              Client Email: <strong>client@demo.com</strong> / Pass: <strong>client</strong>
            </p>
          </VAlert>
        </VCardText> -->
        <VCardText>
          <VForm
            ref="refVForm"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <VTextField
                  v-model="username"
                  label="Username"
                 
                  :rules="[requiredValidator]"
                  :error-messages="errors.username"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <VTextField
                  v-model="password"
                  label="Password"
                  :rules="[requiredValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :error-messages="errors.password"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex align-center flex-wrap justify-space-between mt-2 mb-4">
                  <VCheckbox
                    v-model="rememberMe"
                    label="Remember me"
                  />
                  <RouterLink
                    class="text-primary ms-2 mb-1"
                    :to="{ name: 'forgot-password' }"
                  >
                    Forgot Password?
                  </RouterLink>
                </div>

                <VBtn
                  block
                  type="submit"
                >
                  Login
                </VBtn>


              </VCol>

              <!-- create account -->
              <!-- <VCol
                cols="12"
                class="text-center"
              >
                <span>New on our platform?</span>
                <RouterLink
                  class="text-primary ms-2"
                  :to="{ name: 'register' }"
                >
                  Create an account
                </RouterLink>
              </VCol>
              <VCol
                cols="12"
                class="d-flex align-center"
              >
                <VDivider />
                <span class="mx-4">or</span>
                <VDivider />
              </VCol> -->

              <!-- auth providers -->
              <!-- <VCol
                cols="12"
                class="text-center"
              >
                <AuthProvider />
              </VCol> -->
            </VRow>

            <VRow>
            <VCol>

              <VBtn
                  block
                  type="button"
                  @click="msalLogin"
                >
                Sign in with Microsoft
                </VBtn>
            </VCol>

            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>