import { defineStore } from 'pinia'

import axios from '@axios'

export const useUserListStore = defineStore('UserListStore', {
  actions: {
    // 👉 Fetch users data
    fetchUsers(lparams) {

      const params=lparams;
      axios.get(`https://omp-api.mudunuru.com/api/v1/people_movement`, { 'headers': { 'Authorization': 'Bearer oFotCQex1c8nWG5LucmzjcEFG4bVzG'}})
     
      
     
    
    },

    // 👉 Add User
    addUser(userData) {
      return new Promise((resolve, reject) => {
        axios.post('/apps/users/user', {
          user: userData,
        }).then(response => resolve(response))
          .catch(error => reject(error))
      })
    },

    // 👉 fetch single user
    fetchUser(id) {
      return new Promise((resolve, reject) => {
        axios.get(`/apps/users/${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    },
  },
})
