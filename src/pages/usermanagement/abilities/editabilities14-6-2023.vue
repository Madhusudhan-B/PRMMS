<script setup>


import {rolelist} from '@/helpers/helper'

import {URL, token} from '@/helpers/token'
import axios from '@axios'


const route = useRoute()
const router = useRouter()

console.log(route.params)
console.log('route query')
console.log(route.query)

const rowid = route.query.id
const access_type = route.query.access_type
const role_name = route.query.roleName




const selected = ref(['view'])

const moduleselected = ref(['view'])
const radioGroup = ref(1)
// const userListStore = useUserListStore()
const show=ref(false)
const roles=rolelist()


const refForm = ref();
const searchQuery = ref('')
const dateQuery = ref('')
const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()
const rowPerPage = ref(30)
const currentPage = ref(1)
const totalPage = ref(1)
const totalTags = ref(0)
const tags = ref([])
const rtags = ref([])
const subtags = ref([])
const selectedrole= ref()
const abilites=ref([])
let i=0


const onSubmit = () => {
    
    refForm.value?.validate().then(({ valid }) => {
        if (valid) {
          console.log('Add Abilities')
          console.log(selected.value)
          const list = ref([
                [],
                []
              ]);
          const newabilities=ref([])
          var arr=[]
         
          if(radioGroup.value==''){
            alert('Choose Access Type')
            return false
          }

          if(radioGroup.value=='role' && selectedrole ==''){
            alert('Select Role is empty')
            return false
          }
         
          console.log('access type'+radioGroup.value)
          console.log('selectedrole'+selectedrole)

         

          selected.value.forEach(element => {
           
          

            let data=element.split('-')
            if(data.length>=2){
            console.log(data[2])
            var module= [];
            if(data[2]=='Add'){
             
             module={add_permission:true}
            }else{
              module={add_permission:false} 
            }
            if(data[2]=='Edit'){
              module={edit_permission:true}
            }else{
              module={edit_permission:false} 
            }
            if(data[2]=='Delete'){
              module={delete_permission:true}
            }else{
              module={delete_permission:false} 
            }
            if(data[2]=='View'){
              module={view_permission:true}
            }else{
              module={view_permission:false} 
            }
            if (!list.value[data[1]]) {
              list.value[data[1]] = [];
            }
            arr.push(data[1])
            list.value[data[1]].push(module)
            console.log(list)
           }
          })
          var unique = arr.filter(onlyUnique);
         
          unique.forEach((row) => {
            console.log('module')
            console.log(row)
            // list.value[row].forEach((newlist) => {
            //   console.log('newlist')
            // console.log(newlist)

            
            // })
            console.log('multi module')
            console.log(moduleselected.value)

            console.log('data')
            console.log(list.value[row])

            const mainarr={
              access_type: radioGroup.value,
            access_user: "9389e691f6ef11eda8d9375a1e874ce7",
            access_role: selectedrole.value,
            sub_module: row,
            
            }

            // const reducedArr = list.value[row].reduce((result, item) => {
                
            //     return Object.assign(result, item);
            //   }, {});

              
           
            list.value[row].forEach((obj) => {
                Object.entries(obj).forEach(([key, value]) => {
                  mainarr[key]=value
                  console.log(`Key: ${key}, Value: ${value}`);
                });
            })

           
           


            newabilities.value.push(mainarr)
            console.log(newabilities)
            // row.forEach((element) => {
            //   // Perform operations on each element of the array
            //   console.log('module')
            //   console.log(element);
            // });

           
          });

         // console.log(list)
        
            // axios
            //     .post(
            //         URL() + "/abilities",
            //         {
            //             requestType: "update",
            //             abilitiesData:newabilities.value,
            //         },
            //         { headers: { Authorization: token() } }
            //     )
            //     .then((request, response) => {
            //         console.log(request.body);
            //         // Inside your component or method
            //         router.push({
            //         name: 'usermanagement-ability-management',
            //         query: { message_type:'success',message: 'Employee Updated Successfully' }
            //         });

            //     })
            //     .catch((error) => {
            //         console.log(error);

            //         // Inside your component or method
            //         router.push({
            //         name: 'rfidpeople-employee-setup',
            //         query: { message_type:'failed',message: 'Employee update failed' }
            //         });
            //     });
        }
    });
}

    // ?? Fetching Controller list






    const fetchTags = () => {
  console.log('Abilities started')
  axios
                .post(
                    URL() + "/abilities",
                    {
                        requestType: "view",
                        searchParams: {
                          access_type: "role",
                          access_id: rowid},  
                        offset: 0,
                        limit: 100
                    },
                    { headers: { Authorization: token() } }
                )
 
      .then((response) => {
       
       //   this.listings = response.data;       
       console.log(response.data.data);
       abilites.value=response.data.data
   
        
      })
      .catch((error) => {
          console.log(error)
      })



      console.log('Abilities ended')   
      console.log('Module started')
      axios
                .post(
                    URL() + "/module",
                    {
                        requestType: "view"
                        
                    },
                    { headers: { Authorization: token() } }
                )
      .then((response) => {
       
       //   this.listings = response.data;       
       console.log(response.data.data);
       const data=response.data.data;
          const  q = searchQuery.value, d='', role = null, plan = null, status = null, perPage = 5
    const queryLower = q.toLowerCase()
    let filteredTags = data.filter(tag => ((tag.module_name.toLowerCase().includes(queryLower) || tag.id.toLowerCase().includes(queryLower)) )).reverse()
 
  
 
  console.log("current page")
  console.log(currentPage.value)
 
  
  rtags.value=data
  const firstIndex = rtags.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = firstIndex+rowPerPage.value
  tags.value = rtags.value.slice(firstIndex-1, lastIndex)
      
        totalTags.value =rtags.length
        
      })
      .catch((error) => {
          console.log(error)
      })
      
      
     
}



watchEffect(fetchTags)

const getDataModule=ref([])
const getIndex=ref('')


const fetchSubmodule = () => {
 
        axios
                .post(
                    URL() + "/sub_module",
                    {
                        requestType: "view",
                        offset:0,
                        limit:100
                        
                    },
                    { headers: { Authorization: token() } }
                )
      .then((response) => {
      
      //   this.listings = response.data;       
      console.log(response.data.data);
      const data=response.data.data;
      subtags.value=data
     })
     .catch((error) => {
         console.log(error)
     })
     
     
    
}

watchEffect(fetchSubmodule)


const filteredSubmodules= (module_id) =>{
  console.log(module_id)
  return subtags.value.filter(submodule => submodule.module === module_id);

}

const showMessage = ()=>{
    // Display your desired message based on the selectedRadio value
    switch (radioGroup.value) {
      case 'role':
      show.value=true
       document.getElementById('roleid').style.display='block'
        break;
      case 'user':
      show.value=false
        break;
      // Add more cases for other radio button values
    }
  }

  const handabilities=(module,short_code,access,id)=>{
    console.log('filter short code'+short_code+' access'+access)
    const query = new RegExp(access, 'i');
    console.log('abilites filter')
    console.log(abilites.value)
    const filterData=abilites.value.filter(item => (item.sub_module.short_code === short_code) && query.test(item.sub_module.access_config))
    console.log(filterData)
    if(filterData.length>0){
     // selected[short_code+'-'+access]=true
     console.log('checked true')
    //return short_code+'-'+id+'-'+access  
    return true
    }
    console.log('checked false')
    document.getElementById(module).checked=false

    return false
    
  }
  const toggleSubmodules = (classname)=>{
    const checkbox=document.getElementById(classname)
    const boxes = document.querySelectorAll("."+classname)
      for (const box of boxes) {
      if (checkbox.checked) {
        box.checked = true
      } else {
        box.checked = false
      }
    }
  }

  const togglemodules = (classname)=>{
    const checkbox=document.getElementById(classname)
    const boxes = document.querySelectorAll("."+classname)
    var count=1
      for (const box of boxes) {
      if (box.checked) {
        count=1
      } else {
        count=0
      }
    }

    if(count==0){
      checkbox.checked=false
    }
  }

</script>

<template>
  <section v-if="$can('create', 'UM_ABILITIES')">
    <VRow>      
      
      <VCol cols="12">
      <VCard >
        <VDivider />

          <VCardText class="d-flex flex-wrap py-4 gap-4">
            
            <div
              class=""
              style="margin-left: 181px; margin-left: 72px;font-size: 24px;"
            >
              <h3 style="color: #2f2774;">Add New Abilities</h3>
            </div>


              <!-- ?? Export button -->
              <!-- <VBtn
                variant="tonal"
                color="secondary"
                prepend-icon="tabler-screen-share"
              >
                Export
              </VBtn> -->

          
            
          </VCardText>
      

          <VDivider />
          <VForm ref="refForm" v-model="isFormValid" @submit.prevent="onSubmit">

    
            <!-- 👉 Main Card  -->
            <VCardText >Access Type: {{access_type}}</VCardText>
             
           

             <VCardText id="roleid" >
           
              Role name: {{role_name}} 

              
             </VCardText>
                <AppCardActions
                  :title="tag.module_name"
                  action-collapsed
                  v-for="(tag,index) in tags"
                >
                <input type="checkbox" :id="tag.short_code" @change="toggleSubmodules(tag.short_code)" checked=true  />ALL
       
          <VCardText>
            <VTable>
              <thead>
                <tr>
                  <th scope="col">
                    Sub Module
                  </th>
                  <th scope="col">
                    Short Code
                  </th>
                  <th scope="col">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                v-for="submodule in filteredSubmodules(tag.id)" 
                
                >
                  <td>
                     {{ submodule.sub_module_name }}
                  </td>
                  <td>
                    {{ submodule.short_code }}
                  </td>
                  <td>
                            <div class="demo-space-x">
                              <ul>
                                  <li   v-for="(data, index) in submodule.access_config.split(',')" :key="index" style="float:left;" v-if="tag.short_code!=submodule.short_code">                                 
                                    
                                   

                                    <VCheckbox
                                    v-model="selected"
                                    class="mr-2 tag.short_code"
                                    :label="data"
                                    :id="submodule.short_code+'-'+data" :value="submodule.short_code+'-'+submodule.id+'-'+data" :checked="selected.includes(handabilities(tag.short_code,submodule.short_code,data,submodule.id))" @change="togglemodules(tag.short_code)"
                                  />
                                  
                                  </li>
                                  <li v-if="tag.short_code==submodule.short_code">
                                    <input type="textbox" v-model="moduleselected" :value="submodule.short_code+'-'+submodule.id+'-'+'View'"  v-if="tag.short_code==submodule.short_code"/> Second level View
                                  
                                  </li>
                                

                              </ul>
                          
                           
                          </div>
                  </td>
                </tr>
              </tbody>
            </VTable>
          </VCardText>
        </AppCardActions>


         <!-- ?? Submit and Cancel -->
    <VCardText>
                <VBtn
                  type="submit"
                  class="me-3"
                >
                  Submit
                </VBtn>
                <VBtn
                  type="reset"
                  variant="tonal"
                  color="secondary"
                  @click="closeNavigationDrawer"
                >
                  Cancel
                </VBtn>
              </VCardText>
        
 </VForm>
          <VDivider />
         
        
    
        </VCard>
       
      </VCol>
     
           
    </VRow>

  
  </section>
</template>

<style lang="scss">
.app-user-search-filter {
  inline-size: 31.6rem;
}

.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}
</style>
<route lang="yaml">
  meta:
    action: create
    subject: UM_ABILITIES
  </route>
