// ------------------------------- Variables -----------------------------------
let req_list = [];
let lectures = [];
// Take elements with id starting with weekday and push on to the array.
lectures.push(document.querySelectorAll(`[id^="monday"]`));
lectures.push(document.querySelectorAll(`[id^="tuesday"]`));
lectures.push(document.querySelectorAll(`[id^="wednesday"]`));
lectures.push(document.querySelectorAll(`[id^="thursday"]`));
lectures.push(document.querySelectorAll(`[id^="friday"]`));
lectures.push(document.querySelectorAll(`[id^="saturday"]`));

// If 'timetable' present in storage, disable the create button
if ((localStorage.getItem('timetable') != null) && (document.getElementById("create-btn") != null)) {
    document.getElementById("create-btn").disabled = true;
}

// structure of JSON object.
let time_table = {
    "class": "class_id",
    "schedule": {
        "monday": {
            "slots": [  //{"time": "slot_time",
                        // "course": "course_id",
                        // "teacher": "teacher_id"},
            ]
        },
        "tuesday": {
            "slots": []
        },
        "wednesday": {
            "slots": []
        },
        "thursday": {
            "slots": []
        },
        "friday": {
            "slots": []
        },
        "saturday": {
            "slots": []
        }
    }
};

// ------------------------------ Functions ------------------------------------

// ----------------------- Save Data to json object ----------------------------
// dictionary 'dict' is used to store lecture data until pushed to 'slots' array
// in time_table object. Store in browser storage as timetable and disable button.
const createTimeTable = () => {
    let time_slot = ["8:00-9:00", "9:00-10:00", "10:00-11:00", 
                    "11:15-13:15", "14:00-15:00", "15:00-16:00",
                    "16:00-17:00", "11:15-13:15", "11:15-13:15"];
    let tt = "";
    let i = 0;
    Object.keys(time_table.schedule).forEach(function(key) {
        for (let j = 0; j < 9; j++) {
            let dict = {
                time: time_slot[j],
                course: lectures[i][j].childNodes[1].value,
                teacher: "XYZ"
            };
            time_table.schedule[key].slots.push(dict);
        }
        i += 1;
    });
    tt = JSON.stringify(time_table);
    console.log(tt);
    localStorage.setItem('timetable', tt);
    localStorage.setItem('flushtimetable', tt);
    document.getElementById("create-btn").disabled = true;
    window.location.reload();
};

// ----------------------- Load Data from json object --------------------------
// Parse 'timetable' object if available. Change HTML of table to output 
// appropriate lectures & teachers.Displays on CreateTimeTable page once
// time table is created.
const loadData = () => {
    if (localStorage.getItem('timetable') == null) {
        console.log("nothing to show");
        return;
    }
    time_table = JSON.parse(localStorage.getItem('timetable'));
    // console.log(time_table)
    let i = 0;
    Object.keys(time_table.schedule).forEach(function(key) {
        for (let j = 0; j < 9; j++) {
            lectures[i][j].innerHTML = time_table.schedule[key].slots[j].course;
            lectures[i][j].previousElementSibling.innerHTML = time_table.schedule[key].slots[j].teacher;
        }
        i += 1;
    });
};


// -------------- Render buttons for release/request click event ---------------
// Render buttons on editTT page. The buttons get rendered according to the dropdown
// value. It is meant for subject teachers. 
const editTimeTable = ()=> {
    let sub_teacher = document.getElementById('subject').childNodes[1];
    if (localStorage.getItem('flushtimetable') == null) {
        console.log("nothing to show");
        // TODO: Add redirect to createTT page
        return;
    }
    sub_teacher.addEventListener('change',() => {
        sessionStorage.setItem('selectedItem', sub_teacher.options.selectedIndex);
        window.location.reload();
    })
    if(sessionStorage.getItem('selectedItem') != null) {
        sub_teacher.options[sessionStorage.getItem('selectedItem')].selected = true;
    }
    time_table = JSON.parse(localStorage.getItem('flushtimetable'));
    let i = 0;
    Object.keys(time_table.schedule).forEach(function(key) {
        for (let j = 0; j < 9; j++) {
            lectures[i][j].innerHTML = time_table.schedule[key].slots[j].course;
            lectures[i][j].classList.add("d-flex","flex-column","align-items-center");            
            lectures[i][j].previousElementSibling.innerHTML = "Teacher";
            let request = "";
            if(sub_teacher.value == time_table.schedule[key].slots[j].course){
                request = '<button type="submit" onclick="storeTempData(\'rel\','+ i +','+ j +',\''+ time_table.schedule[key].slots[j].course +'\'); this.disabled=true;" class="btn btn-warning btn-icon-split">\
                                <span class="icon text-white-50">\
                                    <i class="fa fa-times"></i>\
                                </span>\
                                <span class="text">Release</span>\
                            </button>';
            }
            else{
                request = '<button type="submit" onclick="storeTempData(\'req\','+ i +','+ j +',\''+ time_table.schedule[key].slots[j].course +'\'); this.disabled=true;" class="btn btn-info btn-icon-split">\
                                <span class="icon text-white-50">\
                                    <i class="fas fa-plus"></i>\
                                </span>\
                                <span class="text">Request</span>\
                            </button>';
            }
            lectures[i][j].innerHTML += request;
        }
        i += 1;
    });
};

// ---------------------- Store Requests in a list -----------------------------
const storeTempData = (_state,_date,_time,_course) => {
    console.log(_state,parseInt(_date),parseInt(_time),_course);
    let dict = [_state,_date,_time,_course];
    req_list.push(dict);
};

// --------------------- Store list in local storage ---------------------------
const storeData = () => {
    req_list = req_list.sort(function(a, b) {return (a[1] - b[1]) || (a[2] - b[2])});
    localStorage.setItem('reqList', JSON.stringify(req_list));
    // req_list = [];
    window.location.reload();
};
// -------------------- Load Data in Update slot page ---------------------------
// Load the flushable timetable into the table. Also create a counter for
const loadTempData = () => {
    time_table = JSON.parse(localStorage.getItem('flushtimetable'));
    req_list = JSON.parse(localStorage.getItem('reqList'));
    let i = 0;
    Object.keys(time_table.schedule).forEach(function(key) {
        for (let j = 0; j < 9; j++) {
            // TODO: create a counter with absolute positioning.
            lectures[i][j].innerHTML = time_table.schedule[key].slots[j].course;
            lectures[i][j].previousElementSibling.innerHTML = time_table.schedule[key].slots[j].teacher;
        }
        i += 1;
    });
};
// -------------------- Render requests in form of cards ---------------------------
//  In requests.html render all the requests sent for approval. Once approved
//  or disapproved, update the flushable time table.
const loadRequests = () => {
    let cards = document.getElementById("cards");
    let temp_time_table = JSON.parse(localStorage.getItem('flushtimetable'));
    req_list = JSON.parse(localStorage.getItem('reqList'));
    let time_slot = ["8:00-9:00", "9:00-10:00", "10:00-11:00", 
                "11:15-13:15", "14:00-15:00", "15:00-16:00",
                "16:00-17:00", "11:15-13:15", "11:15-13:15"];
    let day = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    while (req_list.length != 0) {
        req = req_list.shift();
        console.log(req);
        let state = 'Release';
        let clr_state = 'warning';
        if(req[0] == 'req'){
            state = 'Request';
            clr_state = 'primary';
        }
        cards.innerHTML += '<div class="col-12 col-lg-6 mb-4">\
                                <div class="card border-left-'+ clr_state +' shadow h-100 py-2">\
                                    <div class="card-body">\
                                        <div class="row no-gutters align-items-center">\
                                            <div class="col mr-2">\
                                                <div class="mb-xl-3 font-weight-bold text-gray-800 day">'+ state +'</div>\
                                                <div class="text-xs font-weight-bold text-primary text-uppercase mb-1 lect">'+ req[3] +'</div>\
                                                <div class="h5 mb-0 font-weight-bold text-gray-800 day">'+ day[req[1]] +'</div>\
                                                <div class="h5 mb-0 text-gray-800 time">'+ time_slot[req[2]] +'</div>\
                                            </div>\
                                            <div class="d-flex flex-column flex-xl-row col-auto">\
                                                <button form="userForm" type="submit" class="btn btn-success btn-icon-split mb-3 my-xl-1 mr-xl-3" onclick="Update(\''+ req[0] +'\','+ req[1] +','+ req[2] +',\''+ req[3] +'\');this.parentNode.parentNode.parentNode.parentNode.parentNode.remove()">\
                                                    <span class="icon text-white-50">\
                                                        <i class="fas fa-pen-to-square"></i>\
                                                    </span>\
                                                    <span class="text">Accept</span>\
                                                </button>\
                                                <button form="userForm" type="submit" class="btn btn-danger btn-icon-split my-xl-1" onclick="Update(\''+ req[0] +'\','+ req[1] +','+ req[2] +',\''+ req[3] +'\');this.parentNode.parentNode.parentNode.parentNode.parentNode.remove()">\
                                                    <span class="icon text-white-50">\
                                                        <i class="fas fa-pen-to-square"></i>\
                                                    </span>\
                                                    <span class="text">Cancel</span>\
                                                </button>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>'
    };
};

// --------------------  ---------------------------
//  
//  
const Update = (_stat,_date,_time,_course) => {
    time_table = JSON.parse(localStorage.getItem('flushtimetable'));
    let i = 0;
    Object.keys(time_table.schedule).forEach(function(key) {
        for (let j = 0; j < 9; j++) {
            if(i == _date && j == _time){
                if(_stat == 'req'){
                    time_table.schedule[key].slots[j].course = _course;
                    time_table.schedule[key].slots[j].teacher ="yesh";
                }
                else{
                    time_table.schedule[key].slots[j].course = "FREE";
                    time_table.schedule[key].slots[j].teacher ="";

                }
            }
        }
        i += 1;
    });
    localStorage.setItem('flushtimetable',JSON.stringify(time_table));
};

const temp = () => {
    const newDate = new Date("July 10, 2022 00:00:00").getTime();
    const now = new Date().getTime();
    let gap = newDate - now;
    console.log(parseInt(gap / 1000));
};