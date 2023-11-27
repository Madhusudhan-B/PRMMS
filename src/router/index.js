import { setupLayouts } from "virtual:generated-layouts"
import { createRouter, createWebHistory } from "vue-router"
import { isUserLoggedIn } from "./utils"
import routes from "~pages"

import { canNavigate } from "@layouts/plugins/casl"
import * as msal from "msal"

import msalConfig from "../config"
import { serverURL } from "@/helpers/token"

const gohome = () => {
    window.location = serverURL() + "/error/logout"
}

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),

    routes: [
        // ℹ️ We are redirecting to different pages based on role.
        // NOTE: Role is just for UI purposes. ACL is based on abilities.

        /*
        {
          path: '/',
          redirect: to => {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}')
            const userRole = userData && userData.role ? userData.role : null
            if (userRole === 'admin')
              return { name: 'dashboards-rfid-for-people' }
            if (userRole === 'client')
              return { name: 'access-control' }
            
            return { name: 'login', query: to.query }
          },
        },
        */
        {
            path: "/",
            redirect: (to) => {
                const userData = JSON.parse(localStorage.getItem("userData") || "{}");
                // alert("User Data   : " + userData);
                const userRole = userData && userData.role ? userData.role : null;

                // alert("userRole   : " + userRole);

                if (userRole === "admin") return { name: "dashboards-rfid-for-people" };
                if (userRole === "client") return { name: "access-control" };

                return { name: "login", query: to.query };
            },

            /* name: 'home',
             component: () => import('@/pages/dashboards/rfid-for-people.vue') */
        },
        {
            path: "/dashboards/rfid-for-people",
            redirect: (to) => {
                return { name: "dashboards-rfid-for-people" };
            },
        },
        {
            path: "/dashboards/rfid-for-rolling-stocks",
            redirect: (to) => {
                return { name: "dashboards-rfid-for-rolling-stocks" };
            },
        },
        {
            path: "/dashboards/cctv",
            redirect: (to) => {
                return { name: "dashboards-cctv" };
            },
        },
        {
            path: "/dashboards/perimeter",
            redirect: (to) => {
                return { name: "dashboards-perimeter" };
            },
        },

        {
            path: "/rfidforpeople/addnewemployee",
            redirect: (to) => {
                return { name: "rfidpeople-addemployee-addnewemployee" };
            },
            // path: '/rfidforpeople/addnewemployee',
            // name: 'rfidpeople-addemployee-addnewemployee',
            // component: () => import('@/pages/rfidpeople/addemployee/addnewemployee.vue')
          },
        /* {		
      path: '/dashboards-rfid-for-rollingstocks',
      name: 'ds-rfid-for-rollingstock',
      component: () => import('@/pages/dashboards/rfid-for-rolling-stocks.vue')
    },
    {		
      path: '/dashboards-cctv',
      name: 'ds-cctv',
      component: () => import('@/pages/dashboards/cctv.vue')
    },
    {		
      path: '/dashboards-perimeter',
      name: 'ds-perimeter',
      component: () => import('@/pages/dashboards/perimeter.vue')
    },
*/
        ...setupLayouts(routes),
    ],
});

// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
router.beforeEach((to) => {
    const isLoggedIn = isUserLoggedIn();

    // ℹ️ Commented code is legacy code

    if (!canNavigate(to)) {
        // Redirect to login if not logged in
        // ℹ️ Only add `to` query param if `to` route is not index route
        if (!isLoggedIn) {
            return { name: "login", query: { to: to.name !== "index" ? to.fullPath : undefined } };
        }

        // If logged in => not authorized
        return { name: "not-authorized" };
    } else {
        // const msalInstance = new msal.UserAgentApplication(msalConfig)
        // const account = msalInstance.getAccount();
        // console.log(account)
        // if (!account) {
        //   // If the user is not authenticated and the page requires authentication, redirect to the login page
        //   return { name: '/' };
        // }
    }

    if (isLoggedIn) {
        var evTypep = window.performance.getEntriesByType("navigation")[0].type;
        console.log(evTypep);
        if (evTypep == "reload") {
            gohome();
        }

        // Reset the timeout timer
        clearTimeout(window.logoutTimer);

        // Start a new timeout timer
        window.logoutTimer = setTimeout(() => {
            // Call the logout method if the timer expires
            console.log("timer check");
            gohome();
        }, 30 * 60 * 1000); // 30 minutes in milliseconds

       // const msalInstance = new msal.UserAgentApplication(msalConfig);
       // const account = msalInstance.getAllAccounts()[0];

        // const request = {
        //     scopes: ["user.read", "mail.read"], // Change this to the desired scopes
        // };

        // try {
        //     const response = msalInstance.acquireTokenSilent(request);
        //     var accessToken = response.accessToken;
        //     //console.error(accessToken)
        //     return accessToken;
        // } catch (error) {
        //     if (error instanceof msal.InteractionRequiredAuthError) {
        //         msalInstance.acquireTokenRedirect(request);
        //     } else {
        //         console.error(error);
        //     }
        // }
        // var data = msalInstance.getGraphToken()
        // console.log('MSAL Instance token checking')
        // console.log(data)
    }

    // Redirect if logged in
    if (to.meta.redirectIfLoggedIn && isLoggedIn) return { name: "/" };

    // if (canNavigate(to)) {

    //   if (to.meta.redirectIfLoggedIn && isLoggedIn)
    //     return '/'
    // }
    // else {
    //   if (isLoggedIn)
    //     return { name: 'not-authorized' }
    //   else
    //     return { name: 'login', query: { to: to.name !== 'index' ? to.fullPath : undefined } }
    // }
});

export default router;