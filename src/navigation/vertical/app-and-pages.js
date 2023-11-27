export default [
    { heading: 'Modules' },
    {
        title: 'User Management',
        icon: { icon: 'ph-users' },
       
        children: [
            { title: 'Users',
            action:'read',
            subject:'UM_USERS',
            to: 'usermanagement-user-management' },
            { title: 'Roles', 
            action:'read',
            subject:'UM_ROLES',
            to: 'usermanagement-role-management' },
            { title: 'Abilities',
            action:'read',
            subject:'UM_ABILITIES',
             to: 'usermanagement-ability-management' },

        ],
        
    },
    {
        title: 'RFID for People',
        icon: { icon: 'ph-users' },
        children: [
            { title: 'Staff Profile',
            action:'read',
            subject:'PEOPLE_EMPLOYEE',
             to: 'rfidpeople-employee-setup' 
            },
            // { title: 'Access Management', to: 'apps-user-view-id' },
            // { title: 'Card Personalization', to: '' },
            { title: 'Controller Setup', 
            action:'read',
            subject:'PEOPLE_CONTROLLER',
            to: 'rfidpeople-controller-setup' 
            },
            { title: 'Reader Setup',
            action:'read',
            subject:'PEOPLE_READER',
             to: 'rfidpeople-reader-setup'
             },
            // { title: 'Timezone Setup',
            // action:'read',
            // subject:'PEOPLE_TIMEZONE',
            //  to: 'rfidpeople-timezone-setup' 
            // },
            { title: 'Shift Setup',
            action:'read',
            subject:'PEOPLE_SHIFT',
             to: 'rfidpeople-shift-setup' 
            },

        ],
    },
    {
        title: 'RFID for Rolling Stocks',
        icon: { icon: 'cil-locomotive' },
        children: [
            { title: 'Rolling Stocks Reader List',
            action:'read',
            subject:'RS_READER',
             to: 'rfidforrollingstocks-rolling-stocks-reader'
             },
          //  { title: 'Tags Personalization',
          //  action:'read',
          //  subject:'RS_TAGS',
          //   to: 'rfidforrollingstocks-tags-personalization' 
          //  },
            { title: 'Trips Management',
            action:'read',
            subject:'RS_TRIPS',
             to: 'rfidforrollingstocks-trips'
             },
             { title: 'Rolling Stock Inventory', 
             action:'read',
             subject:'CCTV_RS_INVENTORY',
             to: 'rfidforrollingstocks-rsinventory-list'  },
             { title: 'Tag Inventory', 
             action:'read',
             subject:'CCTV_TAG_INVENTORY',
             to: 'rfidforrollingstocks-taginventory-list'  },
        ],
    },
    {
        title: 'CCTV',
        icon: { icon: 'bx-cctv' },
        children: [
            { title: 'NVR setup',
            action:'read',
            subject:'CCTV_NVR',
             to: 'cctv-nvrsetup-list'
             },
            { title: 'CCTV Setup',
            action:'read',
            subject:'CCTV_CCTV',
             to: 'cctv-cctvsetup-list' 
            },
            // { title: 'Playback ',
            // action:'read',
            // subject:'CCTV_PLAYBACK',
            //  to: 'cctv-playback'
            //  },
            // { title: 'Live Stream ',
            // action:'read',
            // subject:'CCTV_LIVESTREAM',
            //  to: 'cctv-cctvlive'
            //  },
        ],
    },
    {
        title: 'Perimeter Intrusion',
        icon: { icon: 'tabler-heart-rate-monitor' },
        children: [
            { title: 'Controller Setup',
            action:'read',
            subject:'PID_DEVICE',
             to: 'perimeter-device-setup'
             },
            { title: 'Segment Setup',
            action:'read',
            subject:'PID_SEGMENT',
             to: 'perimeter-segment-setup' 
            },
        ],
    },
    // {
    //     title: 'Video Wall Management',
    //     icon: { icon: 'tabler-wall' },
    //     children: [
    //         { title: 'Template Layout Wizard',
    //         action:'read',
    //         subject:'TEMPLATE_LAYOUT_WIZARD',
    //          to: 'wallpanel-template-layout-wizard'
    //          },
          
    //     ],
    // },
    {
        title: 'VMS',
        icon: { icon: 'ph-users' },
        children: [
            { title: 'Registration Process',
            action:'read',
            subject:'VISITOR',
             to: 'vms-registration-process'
             },
           
        ],
    },
    

    {
        title: 'Reports',
        icon: { icon: 'tabler-file' },
        children: [
            
           
            {

                title: 'RFID for People',
                action:'read',
                subject:'RFID_FOR_PEOPLE_REPORT',
                children: [
                    { 
                        title: 'Daily Login Report',
                        action:'read',
                        subject:'RFID_PEOPLE_LOGIN_LOGOUT_REPORT',
                        to: 'reports-rfid-people-daily-login-report' 
                    },
                    { title: 'Currently Present Report',
                    action:'read',
                    subject:'RFID_PEOPLE_PRESENT_REPORT',
                     to: 'reports-rfid-people-currently-present-report'
                     },
                    { title: 'Audit Log In/Out', 
                    action:'read',
                    subject:'RFID_PEOPLE_AUDIT_REPORT',
                    to: 'reports-rfid-people-audit-login-report'
                 },
                    { title: 'Attendance Report',
                    action:'read',
                    subject:'RFID_PEOPLE_ATTENDANCE_REPORT',
                     to: 'reports-rfid-people-attendance-report' 
                    },
                    { title: 'Summary Report',
                    action:'read',
                    subject:'RFID_PEOPLE_SUMMERY_REPORT',
                     to: 'reports-rfid-people-summary-report'
                     },
                     { title: 'Exception Report',
                    action:'read',
                    subject:'RFID_PEOPLE_EXCEPTION_REPORT',
                     to: 'reports-rfid-people-exception-report'
                     },
                    //  { title: 'Card Holder Report',
                    //  action:'read',
                    //  subject:'RFID_PEOPLE_CARDHOLDER_REPORT',
                    //   to: 'reports-rfid-people-cardholder-report'
                    //   },
                      { title: 'Device Status Report',
                     action:'read',
                     subject:'RFID_PEOPLE_DEVICE_STATUS_REPORT',
                      to: 'reports-rfid-people-device-status-report'
                      },
                      { title: 'Access Report',
                     action:'read',
                     subject:'RFID_PEOPLE_DEVICE_STATUS_REPORT',
                      to: 'reports-rfid-people-pidar-report'
                      },
                    //   { title: 'Alert Report',
                    //  action:'read',
                    //  subject:'RFID_PEOPLE_ALERT_REPORT',
                    //   to: 'reports-rfid-people-alert-report'
                    //   },
                    
                ],
            },
            {
                title: 'RFID for Rolling Stocks',
                action:'read',
                subject:'REPORTS_RS',
                children: [
                    { title: 'Daily Entry / Exit Report',
                    action:'read',
                    subject:'RFID_RS_ENTRY_EXIT_REPORT',
                     to: 'reports-rfid-rolling-stocks-entry-exit-report' 
                    },
                    { title: 'Currently Present Location', 
                    action:'read',
                    subject:'RFID_RS_PRESENT_REPORT',
                    to: 'reports-rfid-rolling-stocks-currently-present-location'
                   },
                    { title: 'Workshop Report',
                    action:'read',
                    subject:'RFID_RS_WORKSHOP_REPORT',
                     to: 'reports-rfid-rolling-stocks-workshop-report'
                     },
                    { title: 'Trip Report', 
                    action:'read',
                    subject:'RFID_RS_TRIP_REPORT',
                    to: 'reports-rfid-rolling-stocks-trip-report'
                    },
                    // { title: 'Alert Report', 
                    // action:'read',
                    // subject:'RFID_RS_ALERT_REPORT',
                    // to: 'reports-rfid-rolling-stocks-alert-report'
                    // },
                    { title: 'Device Status Report', 
                    action:'read',
                    subject:'RFID_RS_DEVICE_STATUS_REPORT',
                    to: 'reports-rfid-rolling-stocks-device-status-report'
                    },
                   
                   

                ],
            },
            {
                title: 'CCTV Reports',
                action:'read',
                subject:'CCTV_REPORTS',
                children: [
                    { title: 'Status Report',
                    action:'read',
                    subject:'CCTV_STATUS_REPORT', 
                    to: 'reports-cctv-reports-status-report'
                },
                { title: 'Alert Report',
                action:'read',
                subject:'CCTV_ALERT_REPORT', 
                to: 'reports-cctv-reports-alert-report'
                },
                ],
            },
            {
                title: 'PID Reports',
                action:'read',
                subject:'PID_REPORTS',
                children: [
                    { title: 'Alert Report',
                    action:'read',
                    subject:'PID_ALERT_REPORT', 
                    to: 'reports-pid-reports-alert-report'
                },
                { title: 'Status Report',
                action:'read',
                subject:'PID_STATUS_REPORT', 
                to: 'reports-pid-reports-status-report'
            },
                ],
            },

            // {
            //     title: 'Other Reports',
            //     action:'read',
            //     subject:'REPORTS_OTHER',
            //     children: [

            //         { title: 'Activity Report',
            //         action:'read',
            //         subject:'OR_ACTIVITY_REPORT',
            //          to: '' 
            //         },
            //         { title: 'Audit Report',
            //         action:'read',
            //         subject:'OR_AUDIT_REPORT',
            //          to: 'reports-otherreports-audit-report' 
            //         },
                   
            //     ],

            // },

        ],
    },


    {
        title: 'Settings',
        icon: { icon: 'tabler-settings' },
        children: [

            { title: 'Location Setup',
            action:'read',
            subject:'SETTINGS_LOCATION',
             to: 'settings-location-setup'
             },
            { title: 'Department Setup',
            action:'read',
            subject:'SETTINGS_DEPARTMENT',
             to: 'settings-department-setup'
             },
            { title: 'LeaveType Setup',
            action:'read',
            subject:'SETTINGS_LEAVETYPE', 
            to: 'settings-leave-setup'
             },
            { title: 'Module Setup',
            action:'read',
            subject:'SETTINGS_MODULES',
            to: 'settings-module-setup' },
            { title: 'SubModule Setup', 
            action:'read',
            subject:'SETTINGS_SUBMODULES',
            to: 'settings-submodule-setup' },
            { title: 'Blood Group Setup', 
            action:'read',
            subject:'SETTINGS_BLOODGROUP',
            to: 'settings-bloodgroup-setup'
            },
            { title: 'Nationality Setup',
            action:'read',
            subject:'SETTINGS_NATIONALITY',
             to: 'settings-nationality-setup'
             },
            { title: 'Shift Type Setup',
            action:'read',
            subject:'SETTINGS_SHIFTTYPE',
             to: 'settings-shift-type-setup'
             },

        ],
    },

]