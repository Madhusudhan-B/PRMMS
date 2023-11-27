export default [{
    title: 'Dashboards',
    icon: { icon: 'tabler-smart-home' },
    children: [{
            title: 'RFID for People',
            action: 'read',
            subject: 'DB_PEOPLE',
            to: 'dashboards-rfid-for-people',
            icon: { icon: 'ph-users' },
        },
        {
            title: 'RFID for Rolling Stocks',
            action: 'read',
            subject: 'DB_ROLLINGSSTOCKS',
            to: 'dashboards-rfid-for-rolling-stocks',
            icon: { icon: 'cil-locomotive' },
        },
        {
            title: 'CCTV',
            action: 'read',
            subject: 'DB_CCTV',
            to: 'dashboards-cctv',
            icon: { icon: 'bx-cctv' },
        },
        {
            title: 'Perimeter Intrusion',
            action: 'read',
            subject: 'DB_PERIMETER',
            to: 'dashboards-perimeter',
            icon: { icon: 'tabler-heart-rate-monitor' },
        },
        {
            title: 'Video Wall ',
            action: 'read',
            subject: 'PANEL_WIDGET',
            to: 'dashboards-wallpanel',
            icon: { icon: 'tabler-wall' },
        },
        // {
        //     title: 'Azure ',
        //     action: 'read',
        //     subject: 'PANEL_WIDGET',
        //     to: 'dashboards-azure',
        //     icon: { icon: 'tabler-wall' },
        // },


    ],

}, ]