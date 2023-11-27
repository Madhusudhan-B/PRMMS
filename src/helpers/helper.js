    import axios from "@axios";
    import { URL, token } from "@/helpers/token";
    import avatar1 from "@images/avatars/avatar-1.png";
    const setToken = "Bearer " + JSON.parse(localStorage.getItem("accessToken"));

   // console.log(setToken);

    export const users = (gettoken, username) => {
        let userAbilities = [];
        axios
        .get(URL() + `/user`, { headers: { Authorization: token() } })
        .then((response) => {
            const data = response.data;

            const usersdata = data;

            //(usersdata);

            let user = [];
            //console.log("user list");
            //console.log(usersdata);
            usersdata.forEach(function(keyValue, i) {
               // console.log(keyValue.username);
                //console.log(username);

                if (keyValue.username === username) {
                    user = {
                        id: keyValue.id,
                        fullName: keyValue.first_name,
                        username: keyValue.username,
                        password: keyValue.password,
                        avatar: avatar1,
                        email: keyValue.email,
                        role: "admin",
                    };
                }
            });

           // console.log(user);

            localStorage.setItem("userData", JSON.stringify(user));
            // // Redirect to `to` query if exist or redirect to index route
        });

        return true;
    };

    export const userdata = (id) => {
        let user = ref([]);
        axios.get(URL() + `/user` + id, { headers: { Authorization: token() } }).then((response) => {
            const data = response.data.data;

            user.value.push(data);

            //console.log(user);
        });

        return user;
    };

    export const getList = (apiname) => {
        let data = [];

        axios.get(URL() + `/` + apiname, { headers: { Authorization: token() } }).then((response) => {
            data = response.data.data;
            //  data.push(list);
        });

        return data;
    };

    export const rolelist = () => {
        let role = ref([]);


        axios
            .post(
                URL() + "/role", {
                    requestType: "view",
                }, { headers: { Authorization: token() } }
            )
            .then((response) => {
                const data = response.data.data;

                data.forEach(function(keyValue, i) {
                    role.value.push({ title: keyValue.role_name, value: keyValue.id });
                });
                //  data.push(list);
            });

        return role;
    };

    export const userstypelist = () => {
        let users = ref([]);


        axios
            .post(
                URL() + "/access_type", {
                    access_type: "user"
                }, { headers: { Authorization: token() } }
            )
            .then((response) => {
                const data = response.data.data;

                data.forEach(function(keyValue, i) {
                    users.value.push({ title: keyValue.user_name, value: keyValue.id });
                });
                //  data.push(list);
            });

        return users;
    }

    export const roletypelist = () => {
        let users = ref([]);


        axios
            .post(
                URL() + "/access_type", {
                    access_type: "role",
                   
                }, { headers: { Authorization: token() } }
            )
            .then((response) => {
                const data = response.data.data;

                data.forEach(function(keyValue, i) {
                    users.value.push({ title: keyValue.role_name, value: keyValue.id });
                });
                //  data.push(list);
            });

        return users;
    }

    export const modules = () => {
        let data = [];

        axios
        .post(
            URL() + "/mudule", {
                requestType: "view",
            }, { headers: { Authorization: token() } }
        )
        .then((response) => {
            //  data= response.data.data;
            data["data"] = response.data.data;
            //  data.push(list);
        });

        return data;
    };

    export const submodules = () => {
        let data = [];

        axios
        .post(
            URL() + "/sub_module", {
                requestType: "view",
            }, { headers: { Authorization: token() } }
        )
        .then((response) => {
            data["data"] = response.data.data;
            //  data.push(list);
        });

        return data;
    };

    export const nationalities = () => {
        let department = ref([]);

        axios
        .post(
            URL() + "/nationality", {
                requestType: "view",
            }, { headers: { Authorization: token() } }
        )
        .then((response) => {
            const data = response.data.data;

            data.forEach(function(keyValue, i) {
                department.value.push({ title: keyValue.nationality_name, value: keyValue.id });
            });

            //console.log(department);
        });

        return department;
    }

    // export const nationalitydata = (id) => {
    //     let nationalitee = ref([]);
    //     axios.get(URL() + `/nationality` + id, { headers: { Authorization: token() } }).then((response) => {
    //         const data = response.data.data;

    //         nationalitee.value.push(data);

    //         console.log(nationalitee);
    //     });

    //     return nationalitee;
    // };

    export const shifttypes = () => {
        let department = ref([]);
        // console.log("shift");
        // console.log(setToken);
        axios
        .post(
            URL() + "/shift_type", {
                requestType: "view",
            }, { headers: { Authorization: token() } }
        )
        .then((response) => {
            const data = response.data.data;

            data.forEach(function(keyValue, i) {
                department.value.push({ title: keyValue.shift_type_description, value: keyValue.id });
            });

            //console.log(department);
        });

        return department;
    }

    export const shifts = () => {
        let department = ref([]);

        axios
        .post(
            URL() + "/shift", {
                requestType: "view",
            }, { headers: { Authorization: token() } }
        )
        .then((response) => {
            const data = response.data.data;

            data.forEach(function(keyValue, i) {
                department.value.push({ title: keyValue.shift_name, value: keyValue.id });
            });

            //console.log(department);
        });

        return department;
    }

    export const bloodgroups = () => {
        let group = ref([]);

        axios
        .post(
            URL() + "/blood_group", {
                requestType: "view",
            }, { headers: { Authorization: token() } }
        )
        .then((response) => {
            const data = response.data.data;

            data.forEach(function(keyValue, i) {
                group.value.push({ title: keyValue.blood_group_name, value: keyValue.id });
            });

            //console.log(department);
        });

        return group;
    }

    export const moduleslist = () => {
        let department = ref([]);
        // console.log("shift");
        // console.log(setToken);
        axios
        .post(
            URL() + "/module", {
                requestType: "view",
            }, { headers: { Authorization: token() } }
        )
        .then((response) => {
            const data = response.data.data;

            data.forEach(function(keyValue, i) {
                department.value.push({ title: keyValue.module_name, value: keyValue.id });
            });

            //console.log(department);
        });

        return department;
    }

    export const submoduleslist = () => {
        let department = ref([]);
        // console.log("shift");
        // console.log(setToken);
        axios
        .post(
            URL() + "/sub_module", {
                requestType: "view",
            }, { headers: { Authorization: token() } }
        )
        .then((response) => {
            const data = response.data.data;

            department.push(data);
            //console.log(department);
        });

        return department;
    }

    export const databyid = (apiname, id) => {
        let data = ref([]);

        axios.get(URL() + `/` + apiname + `/` + id, { headers: { Authorization: token() } }).then((response) => {
            data = response.data.data;

           // console.log(data);
        });

        return data;
    };

    export const departmentlist = () => {
        let department = ref([]);

        axios
            .post(
                URL() + "/department", {
                    requestType: "list",
                }, { headers: { Authorization: token() } }
            )
            .then((response) => {
                const data = response.data.data;

                data.forEach(function(keyValue, i) {
                    if(keyValue.department_description){
                        department.value.push({ title: keyValue.department_description, value: keyValue.id });
                    }
                   
                });

                //console.log(department);
            });

        return department;
    }


    export const tripstatus = () => {
        let department = ref([]);
        // console.log("shift");
        // console.log(setToken);
        axios
        .post(
            URL() + "/trip_status", {
                requestType: "view",
            }, { headers: { Authorization: token() } }
        )
        .then((response) => {
            const data = response.data.data;

            data.forEach(function(keyValue, i) {
                department.value.push({ title: keyValue.status_name, value: keyValue.id });
            });

            //console.log(department);
        });

        return department;
    }


    export const readerlocationlist = () => {
        let readerlocation = ref([]);
        axios
        .post(
            URL() + "/controller_reader", {
                requestType: "view",
            }, { headers: { Authorization: token() } }
        )
        .then((response) => {
            const data = response.data.data;

            data.forEach(function(keyValue, i) {
                readerlocation.value.push({ title: keyValue.reader_name, value: keyValue.id });
            });

            //console.log(department);
        });

        return readerlocation;
    }

    export const loginstatus = () => {
        return [{
                title: "IN",
                value: "IN",
            },
            {
                title: "OUT",
                value: "OUT",
            },
        ];
    };

    export const devicelocation = () => {
        return [{
            title: "The Glitz",
            value: 1,
        }, ];
    };

    export const location = () => {
        let location = ref([]);

        axios
        .post(
            URL() + "/location", {
                requestType: "view",
            }, { headers: { Authorization: token() } }
        )
        .then((response) => {
            const data = response.data.data;

            data.forEach(function(keyValue, i) {
                location.value.push({ title: keyValue.location_short_code, value: keyValue.id });
            });

            //console.log(department);
        });

        return location.value;
    };

    export const getnvrList = () => {
        let nvr = ref([]);
        axios
        .post(
            URL() + "/nvr", {
                requestType: "view",
            }, { headers: { Authorization: token() } }
        )
        .then((response) => {
            const data = response.data.data;

            data.forEach(function(keyValue, i) {
                nvr.value.push({ title: keyValue.device_name, value: keyValue.id });
            });

            //console.log(department);
        });

        return nvr;
    };

    export const getsegmentList = () => {
        let segment = ref([]);
        axios
        .post(
            URL() + "/pids_segment", {
                requestType: "view",
            }, { headers: { Authorization: token() } }
        )
       .then((response) => {
            const data = response.data.data;

            data.forEach(function(keyValue, i) {
                segment.value.push({ title: keyValue.segment_name, value: keyValue.id });
            });

            //console.log(department);
        });

        return segment;
    };

    export const getdeviceList = () => {
        let nvr = ref([]);
        axios
        .post(
            URL() + "/pids_device", {
                requestType: "view",
            }, { headers: { Authorization: token() } }
        )
        .then((response) => {
            const data = response.data.data;

            data.forEach(function(keyValue, i) {
                nvr.value.push({ title: keyValue.device_name, value: keyValue.id });
            });

            //console.log(department);
        });

        return nvr;
    };

    export const cctvzoneList = () => {
        let nvr = ref([]);
        axios
        .post(
            URL() + "/cctv_zone", {
                requestType: "view",
            }, { headers: { Authorization: token() } }
        )
        .then((response) => {
            const data = response.data.data;

            data.forEach(function(keyValue, i) {
                nvr.value.push({ title: keyValue.name, value: keyValue.id });
            });

            //console.log(department);
        });

        return nvr;
    };

    export const widgetypeList = () => {
        // return [{
        //     title: "Dashboard",
        //     value: 1,
        // },
        // {
        //     title: "CCTV",
        //     value: 2,
        // },
        // ];

        let widget_type = ref([]);
        axios
        .post(
            URL() + "/widget_type", {
                requestType: "view",
            }, { headers: { Authorization: token() } }
        )
        .then((response) => {
            const data = response.data.data;

            data.forEach(function(keyValue, i) {
                if(keyValue.status===true){
                    widget_type.value.push({ title: keyValue.name, value: keyValue.id+'-'+keyValue.name });
                }
              
            });

            //console.log(department);
        });

        return widget_type;
    
    };

    
export const widgetList = () => {
    let widget = ref([]);
    axios
    .post(
        URL() + "/widget", {
            requestType: "view",
        }, { headers: { Authorization: token() } }
    )
    .then((response) => {
        const data = response.data.data;

        data.forEach(function(keyValue, i) {
            if(keyValue.status===true){
                widget.value.push({ title: keyValue.name, value: keyValue.id+'-'+keyValue.name });
            }
        });

        //console.log(department);
    })

    return widget;
   
};



export const openFullscreen=(elem,id,openid,closeid)=>{
      var elem = document.getElementById(id);
      document.getElementById(openid).style.display='none'
      document.getElementById(closeid).style.display='block'
      if (elem.requestFullscreen) {
        elem.style.background='#edeeee'
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
      }
    }
    
    export  const closeFullscreen=(elem,id,openid,closeid)=>{
        var elem = document.getElementById(id);
        elem.style.background='none'
        document.getElementById(openid).style.display='block'
        document.getElementById(closeid).style.display='none'
      if (document.exitFullscreen) {
        if (document.fullscreenElement === null) {
           // this._fullscreen.openFullscreen();
           elem.style.background='none'
          } else {
            document.exitFullscreen();
          }
       
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
    }

    


   