export default [
    { heading: 'Modules' },
    {
        title: 'User Management',
        icon: { icon: 'ph-users' },
        children: [
            { title: 'Users', to: 'usermanagement-user-management' },
            { title: 'Roles', to: 'usermanagement-role-management' },
            { title: 'Abilities', to: 'usermanagement-ability-management' },

        ],
        
    },
    {
        title: 'RFID for People',
        icon: { icon: 'ph-users' },
        children: [
            { title: 'Employee Setup', to: 'rfidpeople-employee-setup' },
            { title: 'Access Management', to: 'apps-user-view-id' },
            // { title: 'Card Personalization', to: '' },
            { title: 'Controller Setup', to: 'rfidpeople-controller-setup' },
            { title: 'Reader Setup', to: 'rfidpeople-reader-setup' },
            { title: 'Timezone Setup', to: 'rfidpeople-timezone-setup' },
            { title: 'Shift Setup', to: 'rfidpeople-shift-setup' },

        ],
    },
    {
        title: 'RFID for Rolling Stocks',
        icon: { icon: 'cil-locomotive' },
        children: [
            { title: 'Rolling Stocks Reader List', to: 'rfidforrollingstocks-rolling-stocks-reader' },
            { title: 'Tags Personalization', to: 'rfidforrollingstocks-tags-personalization' },
        ],
    },
    {
        title: 'CCTV',
        icon: { icon: 'bx-cctv' },
        children: [
            { title: 'NVR setup', to: 'cctv-nvrsetup-list' },
            { title: 'CCTV Setup', to: 'cctv-cctvsetup-list' },
            { title: 'Live Stream Test', to: 'cctv-livestream-list' },
        ],
    },
    {
        title: 'Perimeter Intrusion',
        icon: { icon: 'tabler-heart-rate-monitor' },
        children: [
            { title: 'Device Setup', to: 'perimeter-device-setup' },
            { title: 'Segment Setup', to: 'perimeter-segment-setup' },
        ],
    },

    {
        title: 'Reports',
        icon: { icon: 'tabler-file' },
        children: [{

                title: 'RFID for People',
                children: [
                    { title: 'Daily Login / Logout Report', to: 'reports-rfid-people-daily-login-report' },
                    { title: 'Currently Present Report', to: 'reports-rfid-people-currently-present-report' },
                    { title: 'Audit Log In/Out', to: 'reports-rfid-people-audit-login-report' },
                    { title: 'Attendance Report', to: 'reports-rfid-people-attendance-report' },
                    { title: 'Summary Report', to: 'reports-rfid-people-summery-report' },
                ],
            },
            {
                title: 'RFID for Rolling Stocks',
                children: [
                    { title: 'Daily Entry / Exit Report', to: 'reports-rfid-rolling-stocks-daily-login-report' },
                    { title: 'Currently Present Location', to: '', target: '_blank' },
                    { title: ' Workshop Report', to: '', target: '_blank' },
                    { title: 'Trip Report', to: '', target: '_blank' },
                ],
            },
            {
                title: 'CCTV',
                children: [
                    { title: 'Setup 1', to: '', target: '_blank' },
                    { title: 'Setup 2', to: '', target: '_blank' },
                ],
            },
            {
                title: 'Perimeter Intrusion',
                children: [
                    { title: 'Setup 1', to: '', target: '_blank' },
                    { title: 'Setup 2', to: '', target: '_blank' },
                ],
            },

            {
                title: 'Other Reports',
                children: [

                    { title: 'Activity Report', to: '' },
                    { title: 'Audit Report', to: '' },
                    { title: 'Exception Report', to: 'reports-otherreports-exception-report' },
                    { title: 'Usage Report', to: '' },
                    { title: 'Scheduling Reports', to: '' },
                    { title: 'Card Holder Report', to: '' },
                    { title: 'Alert Reports', to: 'reports-otherreports-alert-report' },
                    { title: 'Event Reports', to: 'reports-otherreports-event-report' },
                    { title: 'Device Inactive Reports', to: '' },
                ],

            },

        ],
    },


    {
        title: 'Settings',
        icon: { icon: 'tabler-settings' },
        children: [

            { title: 'Location Setup', to: 'settings-location-setup' },
            { title: 'Department Setup', to: 'settings-department-setup' },
            { title: 'LeaveType Setup', to: 'settings-leave-setup' },
            { title: 'Module Setup', to: 'settings-module-setup' },
            { title: 'SubModule Setup', to: 'settings-submodule-setup' },
            { title: 'Blood Group Setup', to: 'settings-bloodgroup-setup' },
            { title: 'Nationality Setup', to: 'settings-nationality-setup' },
            { title: 'Shift Type Setup', to: 'settings-shift-type-setup' },

        ],
    },

]