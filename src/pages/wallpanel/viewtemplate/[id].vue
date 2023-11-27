<script setup>
import axios from "axios"
    import { URL, token } from "@/helpers/token"
    import { widgetypeList,widgetList } from "@/helpers/helper"
    import { 
      emailValidator, 
      requiredValidator,
      lengthValidator,
      alphaValidator,
      regexValidator,
      betweenValidator
     } from "@validators"
// const template_name=ref('')
// const template_description=ref('')
//const isDialogVisible = ref(false)
const widgetype_list = widgetypeList()
    const widget_list = widgetList()



var elem = document.documentElement;
    const openFullscreen=(id)=>{
      var elem = document.getElementById(id);
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
      }
    }
    
    const closeFullscreen=()=>{
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
    }

  const popup =(data)=>{
    console.log(data)
    alert('test')
  }


  




</script>

<template>

<VCard class="container-fluid">
   
   <VCardText>
   <h3 class="title-header">Template - View</h3>
   </VCardText>
   <VSpacer />
   <VCardText>
       <!-- ?? Form -->
       <VForm ref="refForm" v-model="isFormValid">
         <VRow>
           <!-- ?? Email -->
           <VCol cols="4">
            Template Name: {{template_name}}
               </VCol>
             
              <VCol cols="4"  >
               Template Description: {{template_description}}
               </VCol>  
               <VCol cols="4"  > 
                <VBtn @click="openFullscreen('left_grid');">
                Open Fullscreen</VBtn>   
               </VCol>  
           <VCol cols="3">
            <div id="trash" style="padding: 15px; margin-bottom: 15px;" class="bg-primary d-none">
            
            <div class="trash text-center text-white">
              <!--span>Drop here to remove widget!</span-->
            </div>
           
              </div>
              <div class="sidebar bg-primary" style="display:none">
                <div class="text-center card  grid-stack-item ">
                    <div class="card-body grid-stack-item-content drag" >
                    <span class="grid-stack-item-content">Drag me into the dashboard!</span>            
                        
                    
                    </div>
                </div>
              </div>        

          

             
              <textarea id="saved" style="width:100%; height:200px; display:none"></textarea>
            </VCol>
  
          </VRow>
        <VRow>
         
            <VCol cols="12">
             <!--VBtn @click="toggleFloat(this, 0)" class="btn btn-primary" href="#">float: false</VBtn>
       <VBtn @click="compact(0)" class="btn btn-primary" href="#">Compact</VBtn -->
        <div class="board">
            <div class="grid-stack" id="left_grid"></div>
               
            <VBtn
            class="me-3 mr-2 mt-4" 
                  :to="{ name: 'wallpanel-template-layout-wizard' }"
                  color="secondary"
                 
                >
                Back
                </VBtn>
           
              <a class="btn btn-primary d-none" @click="save()" href="#">Save layout</a>
              
             
            
          
          </div>
     
     
             </VCol>



         </VRow>
        
       </VForm>
   </VCardText>


 </VCard>

</template>

<script>

// import "@/panel/dist/gridstack.css"

 import "@/panel/dist/gridstack-extra.css"
// import "@/panel/dist/gridstack-all.js"
import { GridStack } from 'gridstack'
import 'gridstack/dist/gridstack.css'
import "@/panel/vue-events.js"
import { widgetypeList,widgetList } from "@/helpers/helper"

const route = useRoute()
const router = useRouter()

export default {
  data(){
    return{
      isDialogVisible:false,
      widget_type:'',
      widget_name:'',
      itemID:0,
      item_title:'',
      wallpanel_template_data:[],
      wallpanel_components:[],
      template_name:'',
      template_description:'',
      isDisabledsubmit: true,
    }
  },  
  mounted() {
  
   
    

 
          
    // Initialize GridStack library here
    let options = {
      column: 6,
      minRow: 1, // don't collapse when empty
      cellHeight: 70,
      disableOneColumnMode: true,
      float: true,
      removable: '#trash', // true or drag-out delete class
      // itemClass: 'with-lines', // test a custom additional class #2110
      acceptWidgets: function(el) { return true } // function example, but can also be: true | false | '.someClass' value
    };
    let grids = GridStack.initAll(options);
    grids[0].float(false);

    // new 4.x static method instead of setting up options on every grid (never been per grid really)
    GridStack.setupDragIn('.sidebar .grid-stack-item', { appendTo: 'body', helper: myClone });
    // GridStack.setupDragIn(); // second call will now work (cache last values)

    let items =
    [
    // {x: 0, y: 0, w: 2, h: 2},
    //   {x: 0, y: 0, w: 2, h: 2},
    //   {x: 3, y: 1, h: 2},
    //   {x: 4, y: 1},
    //   {x: 2, y: 3, w: 3, maxW: 3, id: 'special', content: '<div id="no1" style="background-color:red">has maxW=3    <button onclick="openFullscreen(\'no1\');">Open Fullscreen</button><button onclick="closeFullscreen();">Close Fullscreen</button></div>'},
    //   {x: 2, y: 5}
    {x: 0, y: 0, w: 2, h: 2},
  
    ];

    grids.forEach(function (grid, i) {
      addEvents(grid, i);
      grid.load(items);
      document.querySelector('#saved').value = JSON.stringify(items);
    });

    this.getdata(this.$route.params.id)
    

    // decide what the dropped item will be - for now just a clone but can be anything
     function myClone (event){
      const el = event.target.cloneNode(true);
      el.setAttribute('gs-id', 'foo'); // TEST why clone element is not used directly on drop #2231
      return el;
    }

  

    function addEvents (grid, id){
   
  let g = (id !== undefined ? 'grid' + id + ' ' : '');

  grid.on('added removed change', function(event, items) {
    let str = '';
    items.forEach(function(item) { str += ' (' + item.x + ',' + item.y + ' ' + item.w + 'x' + item.h + ')'; });
    console.log(g + event.type + ' ' + items.length + ' items (x,y w h):' + str );
  })
  .on('enable', function(event) {
    let grid = event.target;
    console.log(g + 'enable');
  })
  .on('disable', function(event) {
    let grid = event.target;
    console.log(g + 'disable');
  })
  .on('dragstart', function(event, el) {
    let node = el.gridstackNode;
    let x = el.getAttribute('gs-x'); // verify node (easiest) and attr are the same
    let y = el.getAttribute('gs-y');
    console.log(g + 'dragstart ' + el.textContent + ' pos: (' + node.x + ',' + node.y + ') = (' + x + ',' + y + ')');
  })
  .on('drag', function(event, el) {
    let node = el.gridstackNode;
    let x = el.getAttribute('gs-x'); // verify node (easiest) and attr are the same
    let y = el.getAttribute('gs-y');
     console.log(g + 'drag ' + el.textContent + ' pos: (' + node.x + ',' + node.y + ') = (' + x + ',' + y + ')');
  })
  .on('dragstop', function(event, el) {
    let node = el.gridstackNode;
    let x = el.getAttribute('gs-x'); // verify node (easiest) and attr are the same
    let y = el.getAttribute('gs-y');
    console.log(g + 'dragstop ' + el.textContent + ' pos: (' + node.x + ',' + node.y + ') = (' + x + ',' + y + ')');
  })
  .on('dropped', function(event, previousNode, newNode) {
    if (previousNode) {
      console.log(g + 'dropped - Removed widget from grid:', previousNode);
    }
    if (newNode) {
      console.log(g + 'dropped - Added widget in grid:', newNode);
    }
  })
  .on('resizestart', function(event, el) {
    let n = el.gridstackNode;
    let rec = el.getBoundingClientRect();
    console.log(`${g} resizestart ${el.textContent} size: (${n.w}x${n.h}) = (${Math.round(rec.width)}x${Math.round(rec.height)})px`);

  })
  .on('resize', function(event, el) {
    let n = el.gridstackNode;
    let rec = el.getBoundingClientRect();
    console.log(`${g} resize ${el.textContent} size: (${n.w}x${n.h}) = (${Math.round(rec.width)}x${Math.round(rec.height)})px`);
  })
 
  .on('resizestop', function(event, el) {
    let n = el.gridstackNode;
    let rec = el.getBoundingClientRect();
    console.log(`${g} resizestop ${el.textContent} size: (${n.w}x${n.h}) = (${Math.round(rec.width)}x${Math.round(rec.height)})px`);
  });

  const gridElement = grid.el;
  gridElement.addEventListener('click', function (event) {
    let newgrids = GridStack.addGrid(document.querySelector('#left_grid'), this.options);
    var options1 = newgrids?.save(true, true);
    const target = event.target.closest('.grid-stack-item');
   
    if (target) {
      const itemId = parseInt(target.getAttribute('gs-id'));
      //alert(itemId)
      console.log(options1.children)
      const item = options1.children.find((item) => item.id === itemId);
      //console.log(item)
      
      if (item && (item.noResize || item.noMove || item.locked)) {        
        const boundAddEvents = dialoghandler.bind(this,itemId);
         boundAddEvents();
        
      }
    }
  });
}

const dialoghandler =(item_id)=>{
  this.item_title='Component '+item_id
   this.itemID=item_id
    this.isDialogVisible = true;
  }



    this.options=options
    this.list=grids
    this.GridStack=GridStack
    this.items=items
  },
  methods:{
    
    getdata(id){
      axios.post(URL()+`/wallpanel_template`,{
              
              'requestType':'view',
              'id': id
              
            
            }, { 'headers': { Authorization: token() } }) 

          .then((response) => {

            console.log(response.data)
            var data=response.data.data
            
            var arr=[];
            this.template_name=data.template_name
            this.template_description=data.template_description
              var j=1
            data.components.forEach(function (record, i) {          
              arr.push({
                  id:j,
                  x:record.component_x ,
                  y: record.component_y,
                  w: record.width,
                  h: record.height,
                  noMove:true,
                  noResize:true,
                  locked:true,
                  content:' '+j+' '+'<p>'+record.widget.widget_type.name+'</p><p>'+record.widget.name+'</p>',
                  widget:record.widget.id 
                  
                })
                j=j+1
            });
           console.log(arr)
            this.list.forEach(function (grid, i) {  
              grid.load([]);    
            grid.load(arr);
            document.querySelector('#saved').value = JSON.stringify(arr);
            });    
         
          })
          .catch((error) => {
            console.log(error)
          })
    },
     save (content = true, full = true){
      let grid = this.GridStack.addGrid(document.querySelector('#left_grid'), this.options);
      var options1 = grid?.save(content, full);
      console.log(options1);
      document.querySelector('#saved').value = JSON.stringify(options1);
      //document.querySelector('#saved').value = JSON.stringify(options);
    }, 
    toggleFloat (button, i){
      this.list[i].float(! this.list[i].getFloat());
      button.innerHTML = 'float: ' + grids[i].getFloat();
    },
 
     compact(i){
      this.list[i].compact();
    },
    confirmForm(){
      if(this.widget_type=='' || this.widget_name =='' ){
        alert('Widget Type  or Widget should be select')
        return false
      }
    let newgrids = GridStack.addGrid(document.querySelector('#left_grid'), this.options);
    var options1 = newgrids?.save(true, true);
    //alert('hellow')
    console.log(this.itemID+'--'+this.widget_type+'--'+this.widget_name)
    const list1=this.widget_type.split('-')
   // list1.value=widgetypeList()
   console.log(list1)
    
    
      var widgetype= list1[1] ? list1[1] : '';
     const list2=this.widget_name.split('-')
    console.log(list2)
    
      var widget= list2[1] ? list2[1] : '';
      console.log(widget)
      var items=[]
      options1.children.forEach( item => {
       console.log(item)
      if(item.id ===  this.itemID){
        item.content=' '+this.itemID+' '+'<p>'+widgetype+'</p><p>'+widget+'</p>'
      }
       
       items.push(item) 
       this.wallpanel_components.push({
        component_seq_number:this.itemID,
        width:item.w,
        height:item.h,
        component_x:item.x,
        component_y:item.y,
        widget:widget
      })
        
      
      });

      this.isDisabledsubmit=false
      console.log(this.wallpanel_components)
      document.querySelector('#left_grid').html=''
      this.list.forEach(function (grid, i) {  
        grid.load([]);    
      grid.load(items);
      document.querySelector('#saved').value = JSON.stringify(items);
       });    

       this.isDialogVisible = false

       console.log( this.isDialogVisible)

    },
    confirmlayout(content = true,full = true){
      let newgrids = this.GridStack.addGrid(document.querySelector('#left_grid'), this.options);
    var options1 = newgrids?.save(content, full);
    console.log(options1);
    var items=[]
    var i=1
    options1.children.forEach( item => {
       console.log(item)
       item.id=i
       item.noMove=true;
       item.noResize=true;
       item.locked=true;
       item.content=' '+i+' '
       items.push(item)    
       i=i+1 
      });
      console.log(items)
      document.querySelector('#left_grid').html=''
      this.list.forEach(function (grid, i) {  
        grid.load([]);    
      grid.load(items);
      document.querySelector('#saved').value = JSON.stringify(items);
       });

  },
  onSubmit(){

    if(this.template_name==''){
      alert('Template Name Required')
      return false
    }
    if(this.template_description==''){
      alert('Template Description Required')
      return false
    }
    axios
                    .post(
                        URL() + "/wallpanel_template",
                        {
                         requestType:"update",
                         wallpanel_template_data:{
                          template_name:this.template_name,
                          template_description:this.template_description,
                          no_of_rows:0,
                          no_of_columns:0,
                          component_count:this.wallpanel_components.length,
                          status:true},
                          wallpanel_components:this.wallpanel_components
                           
                            
                        },
                        { headers: { Authorization: token() } }
                    )
                    .then((request, response) => {
                        console.log(request.body);
                        // Inside your component or method
                        this.$router.push({
                        name: 'wallpanel-template-layout-wizard',
                        query: { message_type:'success',message: 'Video wall item Added Successfully' }
                        })

                    })
                    .catch((error) => {
                        console.log(error);

                        // Inside your component or method
                        this.$router.push({
                          name: 'wallpanel-template-layout-wizard',
                        query: { message_type:'failed',message: 'Add Video Wall failed' }
                        })
                    })
    

  }
  },
 
   
};
</script>

 <style>
/* Your component's CSS code here */

.with-lines { border: 1px dotted #777}

/* Optional styles for demos */

.board{
  border: 1px solid #8E8E8E;
  padding: 5px;
}

.grid-stack {
  background: #edeeee;
  opacity:1;
}

.grid-stack-item-content {
  text-align: center;
  background-color: white;
}

.grid-stack-item-removing {
  opacity: 0.5;
}
.trash {
  height: 100px;
     background:  center center url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjY0cHgiIGhlaWdodD0iNjRweCIgdmlld0JveD0iMCAwIDQzOC41MjkgNDM4LjUyOSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDM4LjUyOSA0MzguNTI5OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTQxNy42ODksNzUuNjU0Yy0xLjcxMS0xLjcwOS0zLjkwMS0yLjU2OC02LjU2My0yLjU2OGgtODguMjI0TDMwMi45MTcsMjUuNDFjLTIuODU0LTcuMDQ0LTcuOTk0LTEzLjA0LTE1LjQxMy0xNy45ODkgICAgQzI4MC4wNzgsMi40NzMsMjcyLjU1NiwwLDI2NC45NDUsMGgtOTEuMzYzYy03LjYxMSwwLTE1LjEzMSwyLjQ3My0yMi41NTQsNy40MjFjLTcuNDI0LDQuOTQ5LTEyLjU2MywxMC45NDQtMTUuNDE5LDE3Ljk4OSAgICBsLTE5Ljk4NSw0Ny42NzZoLTg4LjIyYy0yLjY2NywwLTQuODUzLDAuODU5LTYuNTY3LDIuNTY4Yy0xLjcwOSwxLjcxMy0yLjU2OCwzLjkwMy0yLjU2OCw2LjU2N3YxOC4yNzQgICAgYzAsMi42NjQsMC44NTUsNC44NTQsMi41NjgsNi41NjRjMS43MTQsMS43MTIsMy45MDQsMi41NjgsNi41NjcsMi41NjhoMjcuNDA2djI3MS44YzAsMTUuODAzLDQuNDczLDI5LjI2NiwxMy40MTgsNDAuMzk4ICAgIGM4Ljk0NywxMS4xMzksMTkuNzAxLDE2LjcwMywzMi4yNjQsMTYuNzAzaDIzNy41NDJjMTIuNTY2LDAsMjMuMzE5LTUuNzU2LDMyLjI2NS0xNy4yNjhjOC45NDUtMTEuNTIsMTMuNDE1LTI1LjE3NCwxMy40MTUtNDAuOTcxICAgIFYxMDkuNjI3aDI3LjQxMWMyLjY2MiwwLDQuODUzLTAuODU2LDYuNTYzLTIuNTY4YzEuNzA4LTEuNzA5LDIuNTctMy45LDIuNTctNi41NjRWODIuMjIxICAgIEM0MjAuMjYsNzkuNTU3LDQxOS4zOTcsNzcuMzY3LDQxNy42ODksNzUuNjU0eiBNMTY5LjMwMSwzOS42NzhjMS4zMzEtMS43MTIsMi45NS0yLjc2Miw0Ljg1My0zLjE0aDkwLjUwNCAgICBjMS45MDMsMC4zODEsMy41MjUsMS40Myw0Ljg1NCwzLjE0bDEzLjcwOSwzMy40MDRIMTU1LjMxMUwxNjkuMzAxLDM5LjY3OHogTTM0Ny4xNzMsMzgwLjI5MWMwLDQuMTg2LTAuNjY0LDguMDQyLTEuOTk5LDExLjU2MSAgICBjLTEuMzM0LDMuNTE4LTIuNzE3LDYuMDg4LTQuMTQxLDcuNzA2Yy0xLjQzMSwxLjYyMi0yLjQyMywyLjQyNy0yLjk5OCwyLjQyN0gxMDAuNDkzYy0wLjU3MSwwLTEuNTY1LTAuODA1LTIuOTk2LTIuNDI3ICAgIGMtMS40MjktMS42MTgtMi44MS00LjE4OC00LjE0My03LjcwNmMtMS4zMzEtMy41MTktMS45OTctNy4zNzktMS45OTctMTEuNTYxVjEwOS42MjdoMjU1LjgxNVYzODAuMjkxeiIgZmlsbD0iI2ZmOWNhZSIvPgoJCTxwYXRoIGQ9Ik0xMzcuMDQsMzQ3LjE3MmgxOC4yNzFjMi42NjcsMCw0Ljg1OC0wLjg1NSw2LjU2Ny0yLjU2N2MxLjcwOS0xLjcxOCwyLjU2OC0zLjkwMSwyLjU2OC02LjU3VjE3My41ODEgICAgYzAtMi42NjMtMC44NTktNC44NTMtMi41NjgtNi41NjdjLTEuNzE0LTEuNzA5LTMuODk5LTIuNTY1LTYuNTY3LTIuNTY1SDEzNy4wNGMtMi42NjcsMC00Ljg1NCwwLjg1NS02LjU2NywyLjU2NSAgICBjLTEuNzExLDEuNzE0LTIuNTY4LDMuOTA0LTIuNTY4LDYuNTY3djE2NC40NTRjMCwyLjY2OSwwLjg1NCw0Ljg1MywyLjU2OCw2LjU3QzEzMi4xODYsMzQ2LjMxNiwxMzQuMzczLDM0Ny4xNzIsMTM3LjA0LDM0Ny4xNzJ6IiBmaWxsPSIjZmY5Y2FlIi8+CgkJPHBhdGggZD0iTTIxMC4xMjksMzQ3LjE3MmgxOC4yNzFjMi42NjYsMCw0Ljg1Ni0wLjg1NSw2LjU2NC0yLjU2N2MxLjcxOC0xLjcxOCwyLjU2OS0zLjkwMSwyLjU2OS02LjU3VjE3My41ODEgICAgYzAtMi42NjMtMC44NTItNC44NTMtMi41NjktNi41NjdjLTEuNzA4LTEuNzA5LTMuODk4LTIuNTY1LTYuNTY0LTIuNTY1aC0xOC4yNzFjLTIuNjY0LDAtNC44NTQsMC44NTUtNi41NjcsMi41NjUgICAgYy0xLjcxNCwxLjcxNC0yLjU2OCwzLjkwNC0yLjU2OCw2LjU2N3YxNjQuNDU0YzAsMi42NjksMC44NTQsNC44NTMsMi41NjgsNi41N0MyMDUuMjc0LDM0Ni4zMTYsMjA3LjQ2NSwzNDcuMTcyLDIxMC4xMjksMzQ3LjE3MnogICAgIiBmaWxsPSIjZmY5Y2FlIi8+CgkJPHBhdGggZD0iTTI4My4yMiwzNDcuMTcyaDE4LjI2OGMyLjY2OSwwLDQuODU5LTAuODU1LDYuNTctMi41NjdjMS43MTEtMS43MTgsMi41NjItMy45MDEsMi41NjItNi41N1YxNzMuNTgxICAgIGMwLTIuNjYzLTAuODUyLTQuODUzLTIuNTYyLTYuNTY3Yy0xLjcxMS0xLjcwOS0zLjkwMS0yLjU2NS02LjU3LTIuNTY1SDI4My4yMmMtMi42NywwLTQuODUzLDAuODU1LTYuNTcxLDIuNTY1ICAgIGMtMS43MTEsMS43MTQtMi41NjYsMy45MDQtMi41NjYsNi41Njd2MTY0LjQ1NGMwLDIuNjY5LDAuODU1LDQuODUzLDIuNTY2LDYuNTdDMjc4LjM2NywzNDYuMzE2LDI4MC41NSwzNDcuMTcyLDI4My4yMiwzNDcuMTcyeiIgZmlsbD0iI2ZmOWNhZSIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=) no-repeat;
}
  /* background-color: rgba(204,104,87); */

.sidebar {
  /* background-color: #6cad84; */
  /* padding: 5px 0; */
  
  text-align: center;
}
.sidebar .grid-stack-item {
   width: 280px;
  height: 120px; 
  /* border: 2px dashed green; */
  text-align: center;
  line-height: 35px;
  /* background: #6cad84; */
  cursor: default;
  display: inline-block;
  background-color: #7367F0;
}
.sidebar .grid-stack-item .grid-stack-item-content {
  background: #7367F0;
  width: 260px;
  height: 100px; 
}

/* make nested grid have slightly darker bg take almost all space (need some to tell them apart) so items inside can have similar to external size+margin */
.grid-stack > .grid-stack-item.grid-stack-sub-grid > .grid-stack-item-content {
  background: rgba(0,0,0,0.1);
  inset: 0 2px;
}
.grid-stack.grid-stack-nested {
  background: none;
  /*
   take entire space  background-color: red;*/
  position: absolute;
  inset: 0; /* TODO change top: if you have content in nested grid */
}


</style>

<route lang="yaml">
  meta:
    action: read
    subject: TEMPLATE_LAYOUT_WIZARD
  </route>

