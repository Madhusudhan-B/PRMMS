import axios from '@axios'


export const token = () =>{   

  //console.log('***Token****');
  
  if (localStorage.getItem('accessToken')){
  //console.log(JSON.parse(localStorage.getItem('accessToken')))
  const accesstoken = JSON.parse(localStorage.getItem('accessToken'))
 
  return 'Bearer '+accesstoken;

  }
  return ''
  
 

} 


export const URL = () =>{   

 //console.log(import.meta.env.VITE_API_URL)
  return import.meta.env.VITE_API_URL;


}

export const hostURL = () =>{   

  return import.meta.env.VITE_HOST_API_URL;
  


} 


export const serverURL = () =>{   

  return import.meta.env.VITE_SERVER_URL;
 

}

