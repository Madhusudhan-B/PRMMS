<script setup>
import { initialAbility } from '@/plugins/casl/ability'
import { useAppAbility } from '@/plugins/casl/useAppAbility'
// import * as msal from 'msal';
// import msalConfig from '@/config'

const router = useRouter()
const ability = useAppAbility()
const userData = JSON.parse(localStorage.getItem('userData') || 'null')
const logout = () => {
  console.log('logout page test')
   
  // Remove "userData" from localStorage
  localStorage.removeItem('userData')

// Remove "accessToken" from localStorage
localStorage.removeItem('accessToken')
 // Remove "userAbilities" from localStorage
 localStorage.removeItem('userAbilities')
  // Reset ability to initial ability
  ability.update(initialAbility)
  window.location="/"

}
// const logout1 = () => {
//   console.log('logout page')

//  // Remove "userData" from localStorage
//   localStorage.removeItem('userData')

// // Remove "accessToken" from localStorage
// localStorage.removeItem('accessToken')
// router.push('/').then(() => {

//   // Remove "userAbilities" from localStorage
//   localStorage.removeItem('userAbilities')

//   // Reset ability to initial ability
//   ability.update(initialAbility)

// })

 
// }
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    bordered
    color="success"
  >
    <VAvatar
      class="cursor-pointer"
      color="primary"
      variant="tonal"
    >
      <VImg
        v-if="userData && userData.avatar"
        :src="userData.avatar"
        id="profile_pic"
      />
      <VIcon
        v-else
        icon="tabler-user"
      />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar
                    color="primary"
                    variant="tonal"
                  >
                    <VImg
                      v-if="userData && userData.avatar"
                      :src="userData.avatar"
                    />
                    <VIcon
                      v-else
                      icon="tabler-user"
                    />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ userData.fullName }}
            </VListItemTitle>
            <VListItemSubtitle>{{ userData.role }}</VListItemSubtitle>
          </VListItem>

          <VDivider class="my-2" />

          <!-- 👉 Profile -->
          <VListItem
          
          :to="{ name: 'userprofile-view',
          action: 'read',
          subject: 'USER_PROFILE' }">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-user"
                size="22"
              />
            </template>

            <VListItemTitle>Profile</VListItemTitle>
          </VListItem>

          <!-- 👉 Settings -->
          <!-- <VListItem :to="{ name: 'pages-account-settings-tab', params: { tab: 'account' } }">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-settings"
                size="22"
              />
            </template>

            <VListItemTitle>Settings</VListItemTitle>
          </VListItem> -->

          <!-- 👉 Pricing -->
          <!-- <VListItem :to="{ name: 'pages-pricing' }">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-currency-dollar"
                size="22"
              />
            </template>

            <VListItemTitle>Pricing</VListItemTitle>
          </VListItem> -->

          <!-- 👉 FAQ -->
          <!-- <VListItem :to="{ name: 'pages-faq' }">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-help"
                size="22"
              />
            </template>

            <VListItemTitle>FAQ</VListItemTitle>
          </VListItem> -->

          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem
            link
            @click="logout"
            v-if="$can('read', 'USER_PROFILE')"
          >
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-logout"
                size="22"
              />
            </template>

            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>


<route lang="yaml">
  meta:
    action: read
    subject: USER_PROFILE
  </route>


