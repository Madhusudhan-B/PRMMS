<script setup>
import InvoiceEditable from '@/views/apps/invoice/InvoiceEditable.vue'
import avatar1 from '@images/avatars/avatar-14.png'
import idcard_logo_bottom_photo from '@images/pages/idcard_logo_bottom_photo.png'
import idcard_top_photo from'@images/pages/idcard_top_photo.png'
const route = useRoute()
console.log(route.params)
const invoiceData = ref({
  invoice: {
    id: 5037,
    issuedDate: '',
    service: '',
    total: 0,
    avatar: avatar1,
    invoiceStatus: '',
    balance: '',
    dueDate: '',
    client: {
      address: '',
      company: '',
      companyEmail: '',
      contact: '',
      country: '',
      name: '',
    },
  },
  paymentDetails: {
    totalDue: '$12,110.55',
    bankName: 'American Bank',
    country: 'United States',
    iban: 'ETD95476213874685',
    swiftCode: 'BR91905',
  },
  purchasedProducts: [{
    title: '',
    cost: 0,
    hours: 0,
    description: '',
  }],
  note: '',
  paymentMethod: '',
  salesperson: '',
  thanksNote: '',
})

const paymentTerms = ref(true)
const clientNotes = ref(false)
const paymentStub = ref(false)
const selectedPaymentMethod = ref('Bank Account')

const paymentMethods = [
  'Bank Account',
  'PayPal',
  'UPI Transfer',
]

const exportToPDF = ()=>{


let filename = "employee-id-card.pdf";
let element = document.getElementById('element-to-convert');

html2pdf(element, {
  margin:       0.25,
  filename:     filename,
  image:        { type: 'jpeg', quality: 0.98 },
  html2canvas:  { dpi: 96, letterRendering: true },
  jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  });



// html2pdf(document.getElementById('element-to-convert'),{
//   margin: 1,
// 	filename: "User-Daily-login-report.pdf",
//   pagebreak: { mode: 'avoid-all', before: '#page2el' }
// });
}

</script>
<style>
.cardid {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  border-radius: 2%;
  text-align: center;
 
  margin:auto;
}

.card-title {
  color: grey;
  font-size: 18px;
}

#overlay {
  position: fixed; /* Sit on top of the page content */
  display: none; /* Hidden by default */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5); /* Black background with opacity */
  z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
  cursor: pointer; /* Add a pointer on hover */
}

</style>

<template>
  <VRow>
    <!-- 👉 InvoiceEditable -->
    <VCol
      cols="12"
      md="9"
    >
    <VCard class="mb-8" id="element-to-convert">
    <div class="cardid p-5" >
      <VCardText>
     
        <div style=" z-index:-1;" id="overlay">
          <h1>John Doe           {{route.params.id}}</h1>
          <p class="card-title">CEO & Founder, Example</p>
          <p>Harvard University</p>
          <qrcode :value="number" /> 
          <VImg  :src="avatar1" />         
        </div>
                    
      
          
          </VCardText>
       
 
          <a href="#"><i class="fa fa-dribbble"></i></a>
  <a href="#"><i class="fa fa-twitter"></i></a>
  <a href="#"><i class="fa fa-linkedin"></i></a>
  <a href="#"><i class="fa fa-facebook"></i></a>
 
</div>
</VCard>
      <!--InvoiceEditable :data="invoiceData" /-->
    </VCol>

    <!-- 👉 Right Column: Invoice Action -->
    <VCol
      cols="12"
      md="3"
    >
      <VCard class="mb-8">
        <VCardText>
          <!-- 👉 Send Invoice -->
          <VBtn
            block
            prepend-icon="tabler-send"
            class="mb-2"
            @click="exportToPDF"
          >
           PDF
          </VBtn>

        </VCardText>
      </VCard>

      <!-- 👉 Select payment method -->
      <VSelect
        v-model="selectedPaymentMethod"
        :items="paymentMethods"
        label="Accept Payment Via"
        class="mb-6"
      />

      <!-- 👉 Payment Terms -->
      <div class="d-flex align-center justify-space-between">
        <VLabel for="payment-terms">
          Payment Terms
        </VLabel>
        <div>
          <VSwitch
            id="payment-terms"
            v-model="paymentTerms"
          />
        </div>
      </div>

      <!-- 👉  Client Notes -->
      <div class="d-flex align-center justify-space-between">
        <VLabel for="client-notes">
          Client Notes
        </VLabel>
        <div>
          <VSwitch
            id="client-notes"
            v-model="clientNotes"
          />
        </div>
      </div>

      <!-- 👉  Payment Stub -->
      <div class="d-flex align-center justify-space-between">
        <VLabel for="payment-stub">
          Payment Stub
        </VLabel>
        <div>
          <VSwitch
            id="payment-stub"
            v-model="paymentStub"
          />
        </div>
      </div>
    </VCol>
  </VRow>
</template>

<script> 
import Qrcode from 'vue-qrcode' 
 
export default { 
  name: 'QRCode', 
  components: { 
    Qrcode 
  }, 
  data() { 
    return { 
      number: '123456' // Replace with the actual number 
    } 
  } 
} 
</script>
<route lang="yaml">
  meta:
    action: read
    subject: PEOPLE_EMPLOYEE
  </route>
