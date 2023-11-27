export default [
  // {
  //   path: '/dashboard/analytics',
  //   name: 'dashboard-analytics',
  //   component: () => import('@/views/dashboard/analytics/Analytics.vue'),
  // },
  // {
  //   path: '/dashboard/ecommerce',
  //   name: 'dashboard-ecommerce',
  //   component: () => import('@/views/dashboard/ecommerce/Ecommerce.vue'),
  // },
  {
    path: 'dashboards/rfid-for-people',
    name: 'dashboards-rfid-for-people',
    component: () => import('@/dashboards/rfid-for-people.vue'),
  },
  // {
  //   path: 'dashboards/rfid-for-rolling-stocks',
  //   name: 'pages-dashboards-rfid-for-rolling-stocks',
  //   component: () => import('@/pages/dashboards/rfid-for-rolling-stocks.vue'),
  // },

]
