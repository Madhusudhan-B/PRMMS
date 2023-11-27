<script setup>

import { emailValidator, requiredValidator } from "@validators";

import {rolelist,roletypelist,userstypelist} from '@/helpers/helper'

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


const selected = ref([])
const moduleselected=ref([])
const radioGroup = ref(access_type)
// const userListStore = useUserListStore()

const show=ref(false)
const show2=ref(false)
const isFormValid = ref(false);
const roles=roletypelist()
const users=userstypelist()
console.log(users)

const refForm = ref();
const searchQuery = ref('')
const dateQuery = ref('')
//const selectedRole = ref()
const selecteduser = ref()
const abilites=ref([])






const tags = ref([])

const subtags = ref([])
const selectedrole= ref()
let i=0

const onlyUnique=(value, index, array)=>{
  return array.indexOf(value) === index;
}

const onSubmit = () => {
    
    refForm.value?.validate().then(({ valid }) => {
        if (valid) {
          const selectedModules = subtags.value.filter(module => module.View.isChecked || module.Edit.isChecked ||  module.Add.isChecked || module.Delete.isChecked )

         

          console.log(selectedModules)
          console.log('Add Abilities')
          console.log(selectedrole.value)
          console.log('moduleselected Add Abilities')
          console.log(moduleselected.value)
          if(selectedModules.length==0){
            alert('Abilities required')
            return false
          }
          const list = ref([
                [],
                []
              ]);
          const newabilities=ref([])
          var arr=[]
          var secondlevelarr=[]
          var access_id=rowid
         
          if(radioGroup.value==''){
            alert('Choose Access Type')
            return false
          }
          console.log(radioGroup.value)


          if(access_id=='')
          {
            alert('Please assign abilities to '+radioGroup.value)
            return false
          }
          
         
        
         

          selectedModules.forEach(element => {
            const mainarr={
              access_type: access_type,
            access_id: access_id,
           // access_role: selectedrole.value,
            sub_module: element.id,
            add_permission:element.Add.isChecked,
            edit_permission:element.Edit.isChecked,
            view_permission:element.View.isChecked,
            delete_permission:element.Delete.isChecked,
            
            }
            newabilities.value.push(mainarr)
            console.log(newabilities)

           var filterdata= moduleselected.value.filter(module => module.module === element.module )
            console.log(filterdata)
            filterdata.forEach(item => {
              if(item.module ==element.module){
                secondlevelarr.push(item.id)  
              }
            
            })

          })
          console.log(secondlevelarr)
          
          var secondlevel_unique_items = secondlevelarr.filter(onlyUnique)
          console.log('unique items')
          console.log(secondlevel_unique_items)
          if(secondlevel_unique_items.length>0){
            secondlevel_unique_items.forEach(element => {
            console.log(element)
            const mainarr={
              access_type: radioGroup.value,
            access_id: access_id,
           // access_role: selectedrole.value,
            sub_module: element,
            add_permission:false,
            edit_permission:false,
            view_permission:true,
            delete_permission:false,
            
            }
            newabilities.value.push(mainarr)
            console.log(newabilities)
          })
          }


   ////////////////////////////////////////////////////

       
        //  console.log(newabilities.value)
        // return false
            axios
                .post(
                    URL() + "/abilities",
                    {
                        requestType: "update",
                        abilitiesData:newabilities.value,
                    },
                    { headers: { Authorization: token() } }
                )
                .then((request, response) => {
                    console.log(request.body);
                    // Inside your component or method
                    router.push({
                    name: 'usermanagement-ability-management',
                    query: { message_type:'success',message: 'Abilities Updated Successfully' }
                    });

                })
                .catch((error) => {
                    console.log(error);

                    // Inside your component or method
                    router.push({
                    name: 'usermanagement-ability-management',
                    query: { message_type:'failed',message: 'Update Abilities failed' }
                    });
                });
        }
    });
}




// ?? Fetching Controller list
const fetchTags = () => {
  
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
       tags.value=data

       tags.value.forEach(obj => {
          obj.isChecked = false;
        });
        console.log(tags.value)
        fetchSubmodule()
        
      })
      .catch((error) => {
          console.log(error)
      })
      
      
     
}




const fetchAbilities = () => {

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
     console.log('abilities data')       
     console.log(response.data.data);
     abilites.value=response.data.data

     
      fetchTags()
 
      
    })
    .catch((error) => {
        console.log(error)
    })



    console.log('Abilities ended')   

}
fetchAbilities()



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
      subtags.value.forEach(obj => {


        obj.Add=[]
        obj.Edit=[]
        obj.View=[]
        obj.Delete=[]
          obj.Add.isChecked = false;
          obj.Edit.isChecked = false;
          obj.View.isChecked = false;
          obj.Delete.isChecked = false;

         

        })
        console.log('is check array')
        console.log(subtags.value)

        subtags.value.forEach(obj => {


 
  var accessdata=abilites.value.filter(ability => ability.sub_module.id === obj.id )

    console.log('Access data'+accessdata.length)

      if(accessdata.length>0){
        accessdata.forEach(access => {
          console.log(access)
          console.log(access.sub_module.short_code)
         // if(access.short_code !=module_short_code){
            obj.Add.isChecked = access.add_permission
          obj.Edit.isChecked = access.edit_permission
          obj.View.isChecked = access.view_permission
          obj.Delete.isChecked = access.delete_permission
         
        
        })
      }   

})

        console.log(subtags.value)
     })
     .catch((error) => {
         console.log(error)
     })
     
     
    
}


const filteredSubmodules= (module_id,module_short_code) =>{
  console.log(module_id)
  
  return subtags.value.filter(submodule => submodule.module === module_id);

}

const filteredSubmodules123= (module_id,module_short_code) =>{
  console.log(module_id)

  var submodules=subtags.value.filter(submodule => submodule.module === module_id)

  submodules.forEach(obj => {

    var accessdata=abilites.value.filter(ability => ability.sub_module.id === obj.id )

    console.log('Access data'+accessdata.length)
    
       if(accessdata.length>0){
        accessdata.forEach(access => {
          console.log(access)
          console.log(access.sub_module.short_code+'---'+module_short_code)
          if(access.short_code !=module_short_code){
            obj.Add.isChecked = access.add_permission
          obj.Edit.isChecked = access.edit_permission
          obj.View.isChecked = access.view_permission
          obj.Delete.isChecked = access.delete_permission
          }else{
            moduleselected.value.push(access)
            console.log('moduleselected')
            console.log(moduleselected.value)
          }
        
        })
       }       

      })
      console.log(submodules)
  
  return submodules

}



const showMessage = ()=>{
    // Display your desired message based on the selectedRadio value
    switch (radioGroup.value) {
      case 'role':
      show.value=true
      show2.value=false
       document.getElementById('roleid').style.display='block'
        break;
      case 'user':
      show.value=false
      show2.value=true
      document.getElementById('userid').style.display='block'
        break;
      // Add more cases for other radio button values
    }
  }

const handlerow =(submodule,shortcode) =>{
  if(submodule.short_code == shortcode){
    return false
  }else{
    return true
  }
 
}

const handleSecondlevel =(data)=>{
  moduleselected.value.push(data)
}

const toggleSubmodules = (module)=>{
    // const checkbox=document.getElementById(classname)
    // const boxes = document.querySelectorAll("."+classname)
    //   for (const box of boxes) {
    //   if (checkbox.checked) {
    //     box.checked = true
    //   } else {
    //     box.checked = false
    //   }
    // }

    let submodules=subtags.value.filter(submodule => submodule.module === module.id)
    console.log(submodules)
    submodules.forEach(submodule => {
      submodule.Add.isChecked = module.isChecked ? true:false
      submodule.Edit.isChecked = module.isChecked ? true:false
      submodule.View.isChecked = module.isChecked ? true:false
      submodule.Delete.isChecked = module.isChecked ? true:false
      
    })
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

  const panel = ref(0)
  const  handleClick=(event)=>{
      event.stopPropagation();
      // Optionally, you can emit a custom event here if needed
    }
 


</script>

<template>
  <section v-if="$can('create', 'UM_ABILITIES')">
    <VRow>      
      
      <VCol cols="12">
      <VCard >
        <VDivider />

          <VCardText class="d-flex flex-wrap py-4 gap-4">
            
            
              <h3 class="title-header">{{$t('Abilities - Update')}}</h3>
           


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
           <!-- 👉 Main Card  -->
           <VCardText >Access Type: {{access_type}}</VCardText>
             
           

             <VCardText id="roleid" >
           
              Role name: {{role_name}} 

              
             </VCardText>
            
             <VCard   v-for="(tag,index) in tags"
                    :key="tag.id">
                    <VDivider />
              <VCardText  > 
                 <label class="textcolor">{{ tag.module_name }}</label>   
              <!--VCheckbox
                        v-model="tag.isChecked"
                        class="ml-5 "
                        label="All"                                   
                        :id="tag.short_code"
                        :value="tag.id"
                        @change="toggleSubmodules(tag)" 
                       
                      /--> 
                </VCardText  >
                <VDivider />
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
                        v-for="submodule in filteredSubmodules(tag.id,tag.short_code)" 
                        v-show="handlerow(submodule,tag.short_code)"
                        >
                          <td>
                            {{ submodule.sub_module_name }}
                          </td>
                          <td>
                            {{ submodule.short_code }}
                          </td>
                          <td >
                            <div class="demo-space-x" v-if="submodule.short_code!=tag.short_code ">
                              <ul>
                                  <li   v-for="(data, index) in submodule.access_config.split(',')"  :key="index" style="float:left; ">
                                  
                                    <input type="checkbox" v-if="data=='Add' || data=='add'"
                                    v-model="submodule.Add.isChecked"
                                    class="ml-2 "
                                    :label="data"
                                    :id="submodule.short_code+'-'+submodule.id+'-'+data"                                   
                                    />
                                  <input type="checkbox" v-if="data=='Edit' || data=='edit'"
                                    v-model="submodule.Edit.isChecked"
                                    class="ml-2"
                                    :label="data"  
                                    :id="submodule.short_code+'-'+submodule.id+'-'+data"                                 
                                    />
                                  <input type="checkbox" v-if="data=='View' || data=='view'" 
                                    v-model="submodule.View.isChecked"
                                    class="ml-2"
                                    :id="submodule.short_code+'-'+submodule.id+'-'+data"
                                    :label="data"                                   
                                    />
                                  
                                  <input type="checkbox" v-if="data=='Delete'|| data=='delete'"
                                    v-model="submodule.Delete.isChecked"
                                    class="ml-2"
                                    :label="data"  
                                    :id="submodule.short_code+'-'+submodule.id+'-'+data"                                 
                                    
                                  />{{data}}
                                  
                                  </li>
                                

                              </ul>
                          
                           
                          </div>
                          <div class="demo-space-x" v-if="submodule.short_code==tag.short_code ">
                              <ul>
                                  <li   >
                                   
                                   
                                 
                                   {{handleSecondlevel(submodule)}}
                                  </li>
                                

                              </ul>
                          
                           
                          </div>
                  </td>
                </tr>
              </tbody>
            </VTable>
             </VCard>
            

         <!-- ?? Submit and Cancel -->
    <VCardText>
                <VBtn
                  type="submit"
                  class="me-3"
                >
                  Update
                </VBtn>
                <VBtn
                 
                 :to="{ name: 'usermanagement-ability-management' }"
                 color="secondary"
                
               >
               Back
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
.textcolor{
  color:#2f2774;
  font-weight: bold;
}
.ml-5 {
    position: absolute !important;
    margin-left: 300px!important;
    top: 8px !important;
}
.ml-2 {
    margin-left: 15px!important;
}
</style>
<route lang="yaml">
  meta:
    action: create
    subject: UM_ABILITIES
  </route>
