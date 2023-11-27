<script setup>
import pages401 from '@images/pages/401.png'
import miscMaskDark from '@images/pages/misc-mask-dark.png'
import miscMaskLight from '@images/pages/misc-mask-light.png'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import { initialAbility } from '@/plugins/casl/ability'
import { useAppAbility } from '@/plugins/casl/useAppAbility'
import {serverURL} from '@/helpers/token'

const router = useRouter()
const ability = useAppAbility()
const userData = JSON.parse(localStorage.getItem('userData') || 'null')


const load=() =>{

// Remove "userData" from localStorage
localStorage.removeItem('userData')

// Remove "accessToken" from localStorage
localStorage.removeItem('accessToken')




// Reset ability to initial ability
ability.update(initialAbility)

// Remove "userAbilities" from localStorage
localStorage.removeItem('userAbilities')

window.location = serverURL() + "/error/access-denied"

}

watchEffect(load)


</script>


<route lang="yaml">
  meta:
    action: read
    subject: USER_PROFILE
  </route>
