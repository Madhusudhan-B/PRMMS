import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
import avatar5 from '@images/avatars/avatar-5.png'
import avatar6 from '@images/avatars/avatar-6.png'
import avatar7 from '@images/avatars/avatar-7.png'
import avatar8 from '@images/avatars/avatar-8.png'
import mock from '@/@fake-db/mock'

const users = [
  {
    id: 1,
    fullName: 'Galen Slixby',
    company: 'Yotz PVT LTD',
    role: 'editor',
    country: 'El Salvador',
    contact: '(479) 232-9151',
    email: 'gslixby0@abc.net.au',
    currentPlan: 'enterprise',
    status: 'inactive',
    billing: 'Auto Debit',
    avatar: '',    
    date: "21-02-2023",
    department: "IT",
    staffId: "12345",    
    category: "Employee",
    time: "8:32:20",
    inOut: "in",
    gateid: "gate1"
  },
  {
    id: 2,
    fullName: 'Halsey Redmore',
    company: 'Skinder PVT LTD',
    role: 'author',
    country: 'Albania',
    contact: '(472) 607-9137',
    email: 'hredmore1@imgur.com',
    currentPlan: 'team',
    status: 'pending',
    avatar: avatar1,
    billing: 'Manual - Paypal',
    date: "22-02-2023",
    department: "Engineering",
    staffId: "12346",    
    category: "Employee",
    time: "9:32:20",
    inOut: "in",
    gateid: "gate1"
  },
  {
    id: 3,
    fullName: 'Marjory Sicely',
    company: 'Oozz PVT LTD',
    role: 'maintainer',
    country: 'Russia',
    contact: '(321) 264-4599',
    email: 'msicely2@who.int',
    currentPlan: 'enterprise',
    status: 'active',
    avatar: avatar1,
    billing: 'Manual - Cash',
    date: "23-02-2023",
    department: "Accounts",
    staffId: "12347",    
    category: "Employee",
    time: "8:32:20",
    inOut: "in",
    gateid: "gate1"
  },
  {
    id: 4,
    fullName: 'Cyrill Risby',
    company: 'Oozz PVT LTD',
    role: 'maintainer',
    country: 'China',
    contact: '(923) 690-6806',
    email: 'crisby3@wordpress.com',
    currentPlan: 'team',
    status: 'inactive',
    avatar: avatar3,
    billing: 'Manual - Credit Card',
    date: "21-02-2023",
    department: "IT",
    staffId: "12345",    
    category: "Employee",
    time: "8:32:20",
    inOut: "in",
    gateid: "gate1"
  },
  {
    id: 5,
    fullName: 'Maggy Hurran',
    company: 'Aimbo PVT LTD',
    role: 'subscriber',
    country: 'Pakistan',
    contact: '(669) 914-1078',
    email: 'mhurran4@yahoo.co.jp',
    currentPlan: 'enterprise',
    status: 'pending',
    avatar: avatar1,
    billing: 'Auto Debit',
    date: "21-02-2023",
    department: "Engineering",
    staffId: "12345",    
    category: "Employee",
    time: "8:32:20",
    inOut: "in",
    gateid: "gate1"
  },
  {
    id: 6,
    fullName: 'Silvain Halstead',
    company: 'Jaxbean PVT LTD',
    role: 'author',
    country: 'China',
    contact: '(958) 973-3093',
    email: 'shalstead5@shinystat.com',
    currentPlan: 'company',
    status: 'active',
    avatar: '',
    billing: 'Manual - Cash',
    date: "21-02-2023",
    department: "Accounts",
    staffId: "12345",    
    category: "Employee",
    time: "8:32:20",
    inOut: "in",
    gateid: "gate1"
  },
  {
    id: 7,
    fullName: 'Breena Gallemore',
    company: 'Jazzy PVT LTD',
    role: 'subscriber',
    country: 'Canada',
    contact: '(825) 977-8152',
    email: 'bgallemore6@boston.com',
    currentPlan: 'company',
    status: 'pending',
    avatar: '',
    billing: 'Manual - Cash',
    date: "21-02-2023",
    department: "IT",
    staffId: "12345",    
    category: "Trainee",
    time: "8:32:20",
    inOut: "in",
    gateid: "gate1"
  },
  {
    id: 8,
    fullName: 'Kathryne Liger',
    company: 'Pixoboo PVT LTD',
    role: 'author',
    country: 'France',
    contact: '(187) 440-0934',
    email: 'kliger7@vinaora.com',
    currentPlan: 'enterprise',
    status: 'pending',
    avatar: avatar4,
    billing: 'Manual - Cash',
    date: "21-02-2023",
    department: "Engineering",
    staffId: "12345",    
    category: "Employee",
    time: "8:32:20",
    inOut: "in",
    gateid: "gate2"
  },
  {
    id: 9,
    fullName: 'Franz Scotfurth',
    company: 'Tekfly PVT LTD',
    role: 'subscriber',
    country: 'China',
    contact: '(978) 146-5443',
    email: 'fscotfurth8@dailymotion.com',
    currentPlan: 'team',
    status: 'pending',
    avatar: avatar2,
    billing: 'Manual - Cash',
    date: "21-02-2023",
    department: "Accounts",
    staffId: "12345",    
    category: "Employee",
    time: "8:32:20",
    inOut: "in",
    gateid: "gate3"
  },
  {
    id: 10,
    fullName: 'Jillene Bellany',
    company: 'Gigashots PVT LTD',
    role: 'maintainer',
    country: 'Jamaica',
    contact: '(589) 284-6732',
    email: 'jbellany9@kickstarter.com',
    currentPlan: 'company',
    status: 'inactive',
    avatar: avatar5,
    billing: 'Manual - Cash',
    date: "21-02-2023",
    department: "IT",
    staffId: "12345",    
    category: "Employee",
    time: "8:32:20",
    inOut: "in",
    gateid: "gate1"
  },
  {
    id: 11,
    fullName: 'Jonah Wharlton',
    company: 'Eare PVT LTD',
    role: 'subscriber',
    country: 'United States',
    contact: '(176) 532-6824',
    email: 'jwharltona@oakley.com',
    currentPlan: 'team',
    status: 'inactive',
    avatar: avatar4,
    billing: 'Manual - Cash',
    date: "21-02-2023",
    department: "Accounts",
    staffId: "12345",    
    category: "Employee",
    time: "8:32:20",
    inOut: "in",
    gateid: "gate1"
  },
 
 
]


// 👉  return users
mock.onGet('/apps/users/list').reply(config => {
  const { q = '', d='', role = null, plan = null, status = null, perPage = 10, currentPage = 1 } = config.params ?? {}
  const queryLower = q.toLowerCase()
  let filteredUsers = users.filter(user => ((user.fullName.toLowerCase().includes(queryLower) || user.date.toLowerCase().includes(queryLower)) && user.category === (role || user.category) && user.department === (plan || user.department) && user.status === (status || user.status))).reverse()
  const totalPage = Math.ceil(filteredUsers.length / perPage) ? Math.ceil(filteredUsers.length / perPage) : 1
  const totalUsers = filteredUsers.length
  if (perPage) {
    const firstIndex = (currentPage - 1) * perPage
    const lastIndex = perPage * currentPage

    filteredUsers = filteredUsers.slice(firstIndex, lastIndex)
  }
  
  return [200, { users: filteredUsers, totalPage, totalUsers }]
})

// 👉 Add user
mock.onPost('/apps/users/user').reply(config => {
  const { user } = JSON.parse(config.data)
  const { length } = users
  let lastIndex = 0
  if (length)
    lastIndex = users[length - 1].id
  user.id = lastIndex + 1
  users.push(user)
  
  return [201, { user }]
})
mock.onGet(/\/apps\/users\/\d+/).reply(config => {
  // Get event id from URL
  const userId = config.url?.substring(config.url.lastIndexOf('/') + 1)

  // Convert Id to number
  const Id = Number(userId)
  const userIndex = users.findIndex(e => e.id === Id)
  const user = users[userIndex]

  Object.assign(user, {
    taskDone: 1230,
    projectDone: 568,
    taxId: 'Tax-8894',
    language: 'English',
  })
  if (user)
    return [200, user]
  
  return [404]
})
