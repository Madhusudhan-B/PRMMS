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

const selected = ref([])
const moduleselected=ref([])
const radioGroup = ref('role')
// const userListStore = useUserListStore()
const show=ref(true)
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
          var access_id=''
         
          if(radioGroup.value==''){
            alert('Choose Access Type')
            return false
          }
          console.log(radioGroup.value)

          if(radioGroup.value=='role' && selectedrole.value ==''){
            alert('Select Role is empty')
            return false
          }
          
          if(radioGroup.value=='role' && selectedrole.value!=''){
            access_id=selectedrole.value
          }
          


          if(radioGroup.value=='user' && selecteduser.value ==''){
            alert('Select User is empty')
            return false
          }

          if(radioGroup.value=='user' && selecteduser.value!=''){
            access_id=selecteduser.value
          }

          if(access_id=='')
          {
            alert('Please assign abilities to '+radioGroup.value)
            return false
          }
          
         
          console.log('access type'+radioGroup.value)
          console.log('selectedrole'+selectedrole)
         

          selectedModules.forEach(element => {
            const mainarr={
              access_type: radioGroup.value,
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
           // secondlevelarr.push(filterdata.id)  
           filterdata.forEach(item => {
            if(item.module ==element.module){
            secondlevelarr.push(item.id) 
            } 
            })
            
          })

          var secondlevel_unique_items = secondlevelarr.filter(onlyUnique);
          if(secondlevel_unique_items.length>0){
          secondlevel_unique_items.forEach(element => {
            const mainarr={
              access_type: radioGroup.value,
            access_id: access_id,
           // access_role: selectedrole.value,
            sub_module: element.id,
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

       
        //  console.log(newabilities)
        // return false
            axios
                .post(
                    URL() + "/abilities",
                    {
                        requestType: "create",
                        abilitiesData:newabilities.value,
                    },
                    { headers: { Authorization: token() } }
                )
                .then((request, response) => {
                    console.log(request.body);
                    // Inside your component or method
                    router.push({
                    name: 'usermanagement-ability-management',
                    query: { message_type:'success',message: 'Abilities Created Successfully' }
                    });

                })
                .catch((error) => {
                    console.log(error);

                    // Inside your component or method
                    router.push({
                    name: 'usermanagement-ability-management',
                    query: { message_type:'failed',message: 'Create Abilities failed' }
                    });
                });
        }
    });
}

// ?? Fetching Controller list
const fetchTags = () => {
  
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

        console.log(subtags.value)
     })
     .catch((error) => {
         console.log(error)
     })
     
     
    
}

watchEffect(fetchSubmodule)


const filteredSubmodules= (module_id) =>{
 // console.log(module_id)
  
  return subtags.value.filter(submodule => submodule.module === module_id);

}

const showMessage = ()=>{
    // Display your desired message based on the selectedRadio value
    switch (radioGroup.value) {
      case 'role':
      show.value=true
      show2.value=false
       document.getElementById('roleid').style.display='block'
       document.getElementById('userid').style.display='none'
        break;
      case 'user':
      show.value=false
      show2.value=true
      document.getElementById('userid').style.display='block'
      document.getElementById('roleid').style.display='none'
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
            
           
              <h3 class="title-header">{{$t('Abilities - Create')}}</h3>
           


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
            <VCardText style="color:#5c5c3d">Access Type</VCardText>
             
             <VCardText>  

               <VRadioGroup
                     v-model="radioGroup"
                     inline
                     @change="showMessage"
                   >
                     <VRadio
                       label="Role"
                       value="role"
                       density="compact"
                      
                     />
                     <VRadio
                       label="User"
                       value="user"
                       density="compact"
                     />
                   </VRadioGroup>


             

             </VCardText>

             <VCardText id="roleid" v-show="show"  style="width: 30%" >
           

                <VSelect
                cols="3"
                class="sm-3"
                  v-model="selectedrole"
                  label="Role"
                 
                  :items="roles"
                />
             </VCardText>
             
              <VCardText id="userid" v-show="show2"  style="width: 30%">
           

                <VSelect
                cols="3"
                class="sm-3"
                  v-model="selecteduser"
                  label="User"
                 
                  :items="users"
                />
             </VCardText>

             <VCard   v-for="(tag,index) in tags"
                    :key="tag.id">
                    <VDivider />
              <VCardText  >
                <div> 
                 <label class="textcolor" >{{ tag.module_name }}  </label> 
              <VCheckbox
                        v-model="tag.isChecked"
                        class="ml-5 "
                        label="All"                                   
                        :id="tag.short_code"
                        :value="tag.id"
                        @change="toggleSubmodules(tag)" 
                       
                      /> 
                </div>
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
                  Create
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
