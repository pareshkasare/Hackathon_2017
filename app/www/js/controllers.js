angular.module('starter.controllers', ['ui.calendar'])
.config(function($ionicConfigProvider) {
  $ionicConfigProvider.tabs.position("bottom");
})

.controller('DoctorCtrl', ['$scope','$http','uiCalendarConfig','$ionicModal',function($scope,$http,uiCalendarConfig,$ionicModal) {
console.log("sending req to mongodb for collecting JSON object of appointments for today where nurse has been assigned to doctor");
         $scope.$on('$ionicView.enter', function(e) {
        var req = $http.post('http://127.0.0.1:8081/getappointments');
        req.success(function (data, status, headers, config) {
            console.log("found data");
            console.log(data);
            console.log(JSON.stringify(data));
            $scope.appointments=[];
            if (data) {
                var info="[{";
                $scope.appointment={};
                for(i=0;i<data.length;++i){
                        $scope.appointment["_id"]=data[i]._id;
                        $scope.appointment["pname"]= data[i].patient.name;
                        $scope.appointment["dname"]= data[i].doctor.name;
                        $scope.appointment["room"]= data[i].roomnum;
                        $scope.appointments.push($scope.appointment);
                    
                        $scope.appointment={};
                }
                
                console.log($scope.appointments);
                console.log($scope.recep);
                $scope.recep = {};
                $scope.nurse = {};
                $scope.doc = {};
                for(i=0;i<data.length;++i){
                    
                   if(data[i].recep===true){
                        
                        $scope.recep[i]={'font-size': '30px', 'color' : '#0f0'};
                    }else{
                        
                        $scope.recep[i]={'font-size': '20px'};
                    }
                    if(data[i].nurse===true){
                        
                        $scope.nurse[i]={'font-size': '30px', 'color' : '#0f0'};
                    }else{
                        
                        $scope.nurse[i]={'font-size': '20px'};
                    }
                    if(data[i].doc===true){
                        
                        $scope.doc[i]={'font-size': '30px', 'color' : '#0f0'};
                    }else{
                        
                        $scope.doc[i]={'font-size': '20px'};
                    }
                }
                
				
            }
            else {
                alert("Error Connecting database");
            }
        });
        req.error(function (data, status, headers, config) {
            alert("failure message: " + JSON.stringify({data: data}));
        });
    
    });   
	$scope.deleteAppt = function(appointmentId){
		console.log(appointmentId);
		var myPopup = $ionicPopup.show({
     title: 'Delete Appointment?',
     template: 'Are you sure to cancel this appointment?',
     buttons: [
       { text: 'Cancel', onTap: function(e){ return true;}},
       {
         text: '<b>Yes</b>',
         type: 'button-positive',
         onTap: function(e) {
           
		   console.log("call mongodb to delete")
            var req = $http.post('http://127.0.0.1:8081/removeappt', {"id":appointmentId});
            req.success(function (data, status, headers, config) {

                console.log(data);
                if(data === "Success"){
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $state.go('tab.dash', {}, {location: "replace", reload: true});
                }else if(data === "DBUPDATE failure"){
                    alert("registration Failed, DB error!!!");
                    $state.go('tab.dash', {}, {location: "replace", reload: true});
                }
                else{
                    alert("registration Failed, User already exists!!!");
                    $state.go('tab.dash');
                }

                //$window.location.href = "showusers.html";

            });
            req.error(function (data, status, headers, config) {
                alert("failure message: " + JSON.stringify({data: data}));
            });
         }
       },
     ]
   });
		console.log("delete appointment");
	}	
$scope.patientList=[{
name:"Sam Batson",
date:"2017-03-21"
},
{
name:"Shalin Patel",
date:"2017-04-17"
}]
$scope.contact="9510862262";
$scope.name="Shalin Patel",
$scope.email="shalin@123.com";
$scope.docEvents=getEvents();
  /* config object */
    $scope.uiConfig = {
      docCalendar:{
        height: 450,
        defaultView: 'month',
        editable: true,
        header:{
        left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay,listDay'
        },
        longPressDelay:300,
       eventOverlap:false,
			events:$scope.docEvents,
        eventClick: function(calEvent, jsEvent, view) {    
             localStorage.setItem("eventTitle",calEvent.title) 
             localStorage.setItem("eventStartDate","0"+calEvent.start.month()+"/"+calEvent.start.date()+"/"+calEvent.start.year()) 
             localStorage.setItem("eventStartTime","0"+calEvent.start.hour()+":"+calEvent.start.minute()+":00") 
             localStorage.setItem("eventEndDate","0"+calEvent.end.month()+"/"+calEvent.end.date()+"/"+calEvent.end.year()) 
             localStorage.setItem("eventEndTime","0"+calEvent.end.hour()+":"+calEvent.end.minute()+":00") 
             localStorage.setItem("eventId",calEvent.id) 
             $state.go('tab-receptionist.home-appointment-info');
    },
      eventDrop: function(event, delta, revertFunc) {
                
                var confirmPopup = $ionicPopup.confirm({
                title: event.title,
                template: 'Rescheduling Appintment'
                });

            confirmPopup.then(function(res) {
              if(res) {
                  console.log('Sure!');
              } else {
                 revertFunc();
              }
            });	
        }
  }    
}
    /* event sources array*/
    $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];

}])
.controller('ReceptionistCtrl', function($scope,$state,$ionicPopup,$http,autoSearchFactory) {
 
 $scope.toggleAutoSearch = false;
  $scope.st ={};
 $scope.patient={};

 $scope.searchData = null;

 $scope.initiateAutoSearch = function() {
     if($scope.st.searchText){
  $scope.toggleAutoSearch = true;  
  autoSearchFactory.getCountries($scope.st.searchText).then(function(data) {
      console.log("search done:"+ JSON.stringify(data));
   $scope.st.searchData = data;
  });
     }else{$scope.toggleAutoSearch = false;}
 }

 $scope.selectedSearchResult = function(input) {
  $scope.st.searchText = input.firstname;
  $scope.patient.firstname = input.firstname;
  $scope.patient.lastname = input.lastname;
  $scope.patient.email = input.email;
  $scope.patient.number = input.number;
  $scope.toggleAutoSearch = false;
 }


 console.log("sending req to mongodb for collecting JSON object of appointments for today where nurse has been assigned to doctor");
         $scope.$on('$ionicView.enter', function(e) {
          //$scope.patient="";
          //$scope.doctor=localStorage.setItem("doctor","");
        
          $scope.eventTitle=localStorage.getItem("eventTitle");
          $scope.eventStartDate=localStorage.getItem("eventStartDate");
          $scope.eventStartTime=localStorage.getItem("eventStartTime");
          $scope.eventEndDate=localStorage.getItem("eventEndDate");
          $scope.eventEndTime=localStorage.getItem("eventEndTime");
          $scope.eventId=localStorage.getItem("eventId"); 
          //$scope.newEvent= localStorage.getItem("newEvent"); 
          //$scope.docEvents.push(JSON.stringify($scope.newEvent));
          //$scope.patient=localStorage.getItem("patient");
          $scope.doctor=localStorage.getItem("doctor");
        $scope.doctorList=GetDoctor();
        var req = $http.post('http://127.0.0.1:8081/getappointments');
        req.success(function (data, status, headers, config) {
            console.log("found data");
            console.log(data);
            console.log(JSON.stringify(data));
            $scope.appointments=[];
            if (data) {
                var info="[{";
                $scope.appointment={};
                for(i=0;i<data.length;++i){
                        $scope.appointment["_id"]=data[i]._id;
                        $scope.appointment["pname"]= data[i].patient.name;
                        $scope.appointment["dname"]= data[i].doctor.name;
                        $scope.appointment["room"]= data[i].roomnum;
                        $scope.appointments.push($scope.appointment);
                    
                        $scope.appointment={};
                }
                
                console.log($scope.appointments);
                console.log($scope.recep);
                $scope.recep = {};
                $scope.nurse = {};
                $scope.doc = {};
                for(i=0;i<data.length;++i){
                    
                   if(data[i].recep===true){
                        
                        $scope.recep[i]={'font-size': '30px', 'color' : '#0f0'};
                    }else{
                        
                        $scope.recep[i]={'font-size': '20px'};
                    }
                    if(data[i].nurse===true){
                        
                        $scope.nurse[i]={'font-size': '30px', 'color' : '#0f0'};
                    }else{
                        
                        $scope.nurse[i]={'font-size': '20px'};
                    }
                    if(data[i].doc===true){
                        
                        $scope.doc[i]={'font-size': '30px', 'color' : '#0f0'};
                    }else{
                        
                        $scope.doc[i]={'font-size': '20px'};
                    }
                }
                
				
            }
            else {
                //alert("Error Connecting database");
            }
        });
        req.error(function (data, status, headers, config) {
            //alert("failure message: " + JSON.stringify({data: data}));
        });
    
    });   
	$scope.deleteAppt = function(appointmentId){
		console.log(appointmentId);
		var myPopup = $ionicPopup.show({
     title: 'Delete Appointment?',
     template: 'Are you sure to cancel this appointment?',
     buttons: [
       { text: 'Cancel', onTap: function(e){ return true;}},
       {
         text: '<b>Yes</b>',
         type: 'button-positive',
         onTap: function(e) {
           
		   console.log("call mongodb to delete")
            var req = $http.post('http://127.0.0.1:8081/removeappt', {"id":appointmentId});
            req.success(function (data, status, headers, config) {

                console.log(data);
                if(data === "Success"){
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    //$state.go('tab.dash', {}, {location: "replace", reload: true});
                }else if(data === "DBUPDATE failure"){
                   // alert("registration Failed, DB error!!!");
                    $state.go('tab.dash', {}, {location: "replace", reload: true});
                }
                else{
                   // alert("registration Failed, User already exists!!!");
                    $state.go('tab.dash');
                }

                //$window.location.href = "showusers.html";

            });
            req.error(function (data, status, headers, config) {
                //alert("failure message: " + JSON.stringify({data: data}));
            });
         }
       },
     ]
   });
		console.log("delete appointment");
	}	
 
 
$scope.onNewPatientClick=function(patient){
    localStorage.setItem("patient",patient);
    $state.go('tab-receptionist.suggest-doc');
};
  


$scope.docEvents=getEvents();


  /* config object */
    $scope.uiConfig = {
      docCalendar:{
        height: 450,
        defaultView: 'month',
        editable: true,
        header:{
        left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay,listDay'
        },
        longPressDelay:300,
       eventOverlap:false,
			events:$scope.docEvents,
        eventClick: function(calEvent, jsEvent, view) {    
             localStorage.setItem("eventTitle",calEvent.title) 
             localStorage.setItem("eventStartDate","0"+calEvent.start.month()+"/"+calEvent.start.date()+"/"+calEvent.start.year()) 
             localStorage.setItem("eventStartTime","0"+calEvent.start.hour()+":"+calEvent.start.minute()+":00") 
             localStorage.setItem("eventEndDate","0"+calEvent.end.month()+"/"+calEvent.end.date()+"/"+calEvent.end.year()) 
             localStorage.setItem("eventEndTime","0"+calEvent.end.hour()+":"+calEvent.end.minute()+":00") 
             localStorage.setItem("eventId",calEvent.id) 
             $state.go('tab-receptionist.home-appointment-info');
    },
      eventDrop: function(event, delta, revertFunc) {
                
                var confirmPopup = $ionicPopup.confirm({
                title: event.title,
                template: 'Rescheduling Appintment'
                });

            confirmPopup.then(function(res) {
              if(res) {
                  console.log('Sure!');
              } else {
                 revertFunc();
              }
            });	
        }
  }    
}
    /* event sources array*/
    $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];

    $scope.setDoctor=function(doctorName){
       
    //    var req = $http.post('http://127.0.0.1:8081/getdocappointments', {"id":"2"});
    //         req.success(function (data, status, headers, config) {
    //             $scope.doc_events={};
    //             console.log(data);
    //             for(i=0;i<data.length;++i){
                            
    //                         $scope.doc_events.push(data[i].event);
    //                         console.log("Current:"+JSON.stringify($scope.doc_events));
    //                 }
    //                 localStorage.setItem("doc_event",$scope.doc_events);
    //                 $state.go('tab-receptionist.home-appointment');
                
    //         });
    //         req.error(function (data, status, headers, config) {
    //             alert("failure message: " + JSON.stringify({data: data}));
    //         });
  $state.go('tab-receptionist.home-appointment');
    }

    $scope.DeleteEvent=function(){
       var confirmPopup = $ionicPopup.confirm({
                title: event.title,
                template: 'Are you sure want to delete?'
                });

            confirmPopup.then(function(res) {
              if(res) {
                 
              } else {
                 revertFunc();
              }
            });	
    }

   
    $scope.CreateEvent=function(event)
    {
      
      
      AddEvent(event);
      var confirmPopup = $ionicPopup.confirm({
                title: "Event",
                template: 'Are you sure want to Create?'
                });

            confirmPopup.then(function(res) {
              if(res) {
                 CreateEvents($http);
                 $state.go('tab-receptionist.check_in');
              } else {
                 revertFunc();
              }
            });	
      
    }
})

.controller('PatientCtrl', function($scope,$ionicPopup,$state){

  $scope.$on('$ionicView.enter', function(e) {
$scope.patientReports=[{
date:"2017/04/15",
Report:"X-Ray"
},
{
date:"2017/03/11",
Report:"MRI"
},
{
date:"2017/03/11",
Report:"Blood Report"
}
]

$scope.patient={
    firstname:"Shalin",
    lastname:"Patel",
    number:"9510862262",
    email:"shalin@123.com",
    allergy:"Drug allergy,Food allergy"
}
  });

  /* config object */
    $scope.uiConfig = {
      docCalendar:{
        height: 450,
        defaultView: 'month',
        editable: true,
        header:{
        left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay,listDay'
        },
        longPressDelay:300,
       eventOverlap:false,
			events: {
                        "id": 6,
                        "title": "Meet Dr Adam",
                        "start": "2017-04-17T12:40:00",
                        "end": "2017-04-17T01:05:00"
                        },
        eventClick: function(calEvent, jsEvent, view) {    
             localStorage.setItem("eventTitle",calEvent.title) 
             localStorage.setItem("eventStartDate","0"+calEvent.start.month()+"/"+calEvent.start.date()+"/"+calEvent.start.year()) 
             localStorage.setItem("eventStartTime","0"+calEvent.start.hour()+":"+calEvent.start.minute()+":00") 
             localStorage.setItem("eventEndDate","0"+calEvent.end.month()+"/"+calEvent.end.date()+"/"+calEvent.end.year()) 
             localStorage.setItem("eventEndTime","0"+calEvent.end.hour()+":"+calEvent.end.minute()+":00") 
             localStorage.setItem("eventId",calEvent.id) 
             $state.go('tab-receptionist.home-appointment-info');
    },
      eventDrop: function(event, delta, revertFunc) {
                
                var confirmPopup = $ionicPopup.confirm({
                title: event.title,
                template: 'Rescheduling Appintment'
                });

            confirmPopup.then(function(res) {
              if(res) {
                  console.log('Sure!');
              } else {
                 revertFunc();
              }
            });	
        }
  }    
}
    /* event sources array*/
    $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];

$scope.SaveClicked=function(){
    
 var confirmPopup = $ionicPopup.confirm({
                title: "Account Information",
                template: 'Are you sure to change information?'
                });

            confirmPopup.then(function(res) {
              if(res) {
                 $state.go('tab-patient.appointment');
              } else {
              }
            });       
    
  }
  $scope.CancleClicked=function(){
        $state.go('tab-patient.appointment');
  }
})

.controller('NurseCtrl', function($scope,$http,$ionicPopup,$state) {
  
    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 450,
        defaultView: 'month',
        editable: true,
        header:{
        left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay,listDay'
        },
        longPressDelay:300,
      eventOverlap:false,
			events: $scope.doc_events,  
      eventClick: function(calEvent, jsEvent, view) {          
          $scope.eventTitle=calEvent.title;
          $scope.eventStartDate=calEvent.start.month()+"/"+calEvent.start.date()+"/"+calEvent.start.year();
          $scope.eventStartTime=calEvent.start.hour()+":"+calEvent.start.minute()+":00";
          $scope.eventEndDate=calEvent.end.month()+"/"+calEvent.end.date()+"/"+calEvent.end.year();
          $scope.eventEndTime=calEvent.end.hour()+":"+calEvent.end.minute()+":00";
          $scope.eventId=calEvent.id;


            $state.go('tab-nurse.eventInfo');
            
    },
      eventDrop: function(event, delta, revertFunc) {
                
                var confirmPopup = $ionicPopup.confirm({
                title: event.title,
                template: 'Rescheduling Appintment'
                });

            confirmPopup.then(function(res) {
              if(res) {
                  console.log('Sure!');
              } else {
                 revertFunc();
              }
            });	
        }
  }    
}; 
    /* event sources array*/
    $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];

console.log("sending req to mongodb for collecting JSON object of appointments for today where nurse has been assigned to doctor");
         $scope.$on('$ionicView.enter', function(e) {
        var req = $http.post('http://127.0.0.1:8081/getappointments');
        req.success(function (data, status, headers, config) {
            console.log("found data");
            console.log(data);
            console.log(JSON.stringify(data));
            $scope.appointments=[];
            if (data) {
                var info="[{";
                $scope.appointment={};
                for(i=0;i<data.length;++i){
                        $scope.appointment["_id"]=data[i]._id;
                        $scope.appointment["pname"]= data[i].patient.name;
                        $scope.appointment["dname"]= data[i].doctor.name;
                        $scope.appointments.push($scope.appointment);
                    
                        $scope.appointment={};
                }
                
                console.log($scope.appointments);
                console.log($scope.recep);
                $scope.recep = {};
                $scope.nurse = {};
                $scope.doc = {};
                for(i=0;i<data.length;++i){
                    
                   if(data[i].recep===true){
                        
                        $scope.recep[i]={'font-size': '30px', 'color' : '#0f0'};
                    }else{
                        
                        $scope.recep[i]={'font-size': '20px'};
                    }
                    if(data[i].nurse===true){
                        
                        $scope.nurse[i]={'font-size': '30px', 'color' : '#0f0'};
                    }else{
                        
                        $scope.nurse[i]={'font-size': '20px'};
                    }
                    if(data[i].doc===true){
                        
                        $scope.doc[i]={'font-size': '30px', 'color' : '#0f0'};
                    }else{
                        
                        $scope.doc[i]={'font-size': '20px'};
                    }
                }
                
				
            }
            else {
                alert("Error Connecting database");
            }
        });
        req.error(function (data, status, headers, config) {
            alert("failure message: " + JSON.stringify({data: data}));
        });
    
    });   
$scope.deleteAppt = function(appointmentId){
		console.log(appointmentId);
		var myPopup = $ionicPopup.show({
     title: 'Delete Appointment?',
     template: 'Are you sure to cancel this appointment?',
     buttons: [
       { text: 'Cancel', onTap: function(e){ return true;}},
       {
         text: '<b>Yes</b>',
         type: 'button-positive',
         onTap: function(e) {
           
		   console.log("call mongodb to delete")
            var req = $http.post('http://127.0.0.1:8081/removeappt', {"id":appointmentId});
            req.success(function (data, status, headers, config) {

                console.log(data);
                if(data === "Success"){
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $state.go('tab.dash', {}, {location: "replace", reload: true});
                }else if(data === "DBUPDATE failure"){
                    alert("registration Failed, DB error!!!");
                    $state.go('tab.dash', {}, {location: "replace", reload: true});
                }
                else{
                    alert("registration Failed, User already exists!!!");
                    $state.go('tab.dash');
                }

                //$window.location.href = "showusers.html";

            });
            req.error(function (data, status, headers, config) {
                alert("failure message: " + JSON.stringify({data: data}));
            });
         }
       },
     ]
   });
		console.log("delete appointment");
	}

})


.controller('SignInCtrl',function($scope,$state){
var users=[{
              firstname:"Patient",
              lastname:"",
              usertype:"P",
              number:"9510862262",
              email:"patient@123.com",
               passowrd:"1234",
               username:"Patient",
            },{
              firstname:"Doctor",
              lastname:"",
              usertype:"D",
              number:"9510862262",
              email:"Doctor@123.com",
               passowrd:"1234",
               username:"Doctor",
          },
          {
              firstname:"Receptionist",
              lastname:"",
              usertype:"R",
              number:"9510862262",
              email:"Receptionist@123.com",
              passowrd:"1234",
              username:"Receptionist"
          },
          {
              firstname:"Nurse",
              lastname:"",
              usertype:"N",
              number:"9510862262",
              email:"Nurse@123.com",
               passowrd:"1234",
               username:"Nurse"
          }]

$scope.signIn=function(user){
var arrayLenght=users.length;
for(var i=0;i<arrayLenght;i++){
        if(users[i].username== user.username && users[i].passowrd==user.password){
            if(users[i].usertype=="P"){
              $state.go('tab-patient.appointment');
            }
          else if(users[i].usertype=="D"){
              $state.go('tab-doctor.dash');
            }
            else if(users[i].usertype=="R"){
              $state.go('tab-receptionist.check_in');
            }
            else if(users[i].usertype=="N"){
              $state.go('tab-nurse.reports');
            }
        }
    }
  }
}).controller('nurseattendDetailCtrl', function($scope, $stateParams,$http,$state,$ionicHistory,autoSearchFactory) {
	console.log("appointment: " + $stateParams.appointmentId);
    $scope.patient={};
    console.log($scope.patient);
    $scope.checkIn = function(){

    console.log("inside checkIn");
        console.log($scope.patient.weight);
        console.log($scope.patient.oxylevel);
        console.log($scope.patient.sbp);
        console.log($scope.patient.dbp);
        console.log($scope.patient.roomnum);
    var dataParams = {
        'id':$stateParams.appointmentId,
        'sysbp': $scope.patient.sbp,
        'disbp': $scope.patient.dbp,
        'oxygen': $scope.patient.oxylevel,
        'weight': $scope.patient.weight,
        'roomnum': $scope.patient.roomnum,
        'reason':$scope.patient.reason
    };
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        var req = $http.post('http://127.0.0.1:8081/nursecheckin', dataParams);
        req.success(function (data, status, headers, config) {

            console.log(data);
            if(data === "Success"){
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('tab-nurse.reports');
            }else if(data === "DBUPDATE failure"){
                alert("registration Failed, DB error!!!");
                $state.go('tab-nurse.reports', {}, {location: "replace", reload: true});
            }
            else{
                alert("registration Failed, User already exists!!!");
                $state.go('tab-nurse.reports');
            }

            //$window.location.href = "showusers.html";

        });
        req.error(function (data, status, headers, config) {
            alert("failure message: " + JSON.stringify({data: data}));
        });
	}
  //$scope.appointment = appointments.get($stateParams.appointmentId);

  $scope.toggleAutoSearch = false;
  $scope.st ={};
 

 $scope.searchData = null;

 $scope.initiateAutoSearch = function() {
     if($scope.st.searchText){
  $scope.toggleAutoSearch = true;  
  autoSearchFactory.getCountries($scope.st.searchText).then(function(data) {
      console.log("search done:"+ JSON.stringify(data));
   $scope.st.searchData = data;
  });
     }else{$scope.toggleAutoSearch = false;}
 }

 $scope.selectedSearchResult = function(input) {
  $scope.st.searchText = input;

  $scope.toggleAutoSearch = false;
 }
 
})
.controller('docAttendDetailCtrl', function($scope, $stateParams,$http,$state,$ionicHistory,autoSearchFactory2) {
	
        var req = $http.post('http://127.0.0.1:8081/getappointment',{"id":$stateParams.appointmentId});
        req.success(function (data, status, headers, config) {
            console.log(JSON.stringify(data));
            $scope.bp=data[0].vital.sysbp+"/"+data[0].vital.disbp;
            $scope.oxygen=data[0].vital.oxygen;
            $scope.weight=data[0].vital.weight;
            $scope.reason=data[0].reason;
        });
        req.error(function (data, status, headers, config) {
            alert("failure message: " + JSON.stringify({data: data}));
        });
    console.log("appointment: " + $stateParams.appointmentId);
    $scope.patient={};
  //$scope.appointment = appointments.get($stateParams.appointmentId);

  $scope.toggleAutoSearch = false;
  $scope.st ={};
 

 $scope.searchData = null;

 $scope.initiateAutoSearch = function() {
     if($scope.st.searchText){
  $scope.toggleAutoSearch = true;  
  autoSearchFactory2.getCountries($scope.st.searchText).then(function(data) {
      console.log("search done:"+ JSON.stringify(data));
   $scope.st.searchData = data;
  });
     }else{$scope.toggleAutoSearch = false;}
 }

 $scope.selectedSearchResult1 = function(input) {
  $scope.st.searchText = input;

  $scope.toggleAutoSearch = false;
 }
  $scope.initiateAutoSearch2 = function() {
     if($scope.st.searchText2){
  $scope.toggleAutoSearch2 = true;  
  autoSearchFactory2.getCountries($scope.st.searchText2).then(function(data) {
      console.log("search done:"+ JSON.stringify(data));
   $scope.st.searchData = data;
  });
     }else{$scope.toggleAutoSearch2 = false;}
 }

 $scope.selectedSearchResult2 = function(input) {
  $scope.st.searchText2 = input;

  $scope.toggleAutoSearch2 = false;
 }

 $scope.initiateAutoSearch3 = function() {
     if($scope.st.searchText3){
  $scope.toggleAutoSearch3 = true;  
  autoSearchFactory2.getCountries($scope.st.searchText3).then(function(data) {
      console.log("search done:"+ JSON.stringify(data));
   $scope.st.searchData = data;
  });
     }else{$scope.toggleAutoSearch3 = false;}
 }

 $scope.selectedSearchResult3 = function(input) {
  $scope.st.searchText3 = input;

  $scope.toggleAutoSearch3 = false;
 }
    console.log("appointment: " + $stateParams.appointmentId);
    $scope.patient={};
    console.log($scope.patient);
    $scope.checkIn = function(){

    console.log("inside checkIn");
        console.log($scope.patient.weight);
        console.log($scope.patient.oxylevel);
        console.log($scope.patient.sbp);
        console.log($scope.patient.dbp);
        console.log($scope.patient.roomnum);
    var dataParams = {
        'id':$stateParams.appointmentId,
        'roomnum': $scope.patient.roomnum
    };
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        var req = $http.post('http://127.0.0.1:8081/doctordone', dataParams);
        req.success(function (data, status, headers, config) {

            console.log(data);
            if(data === "Success"){
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('tab-doctor.dash');
            }else if(data === "DBUPDATE failure"){
                alert("registration Failed, DB error!!!");
                $state.go('tab-doctor.dash', {}, {location: "replace", reload: true});
            }
            else{
                alert("registration Failed, User already exists!!!");
                $state.go('tab-doctor.dash');
            }

            //$window.location.href = "showusers.html";

        });
        req.error(function (data, status, headers, config) {
            alert("failure message: " + JSON.stringify({data: data}));
        });
	}
  //$scope.appointment = appointments.get($stateParams.appointmentId);


 
})
.controller('attendDetailCtrl', function($scope, $stateParams,$http,$state,$ionicHistory,autoSearchFactory) {
	console.log("appointment: " + $stateParams.appointmentId);
    $scope.patient={};
    console.log($scope.patient);
    $scope.checkIn = function(){
    console.log("inside checkIn");
        console.log($scope.patient.weight);
        console.log($scope.patient.oxylevel);
        console.log($scope.patient.sbp);
        console.log($scope.patient.dbp);
        console.log($scope.patient.roomnum);
    var dataParams = {
        'id':$stateParams.appointmentId,
        'sysbp': $scope.patient.sbp,
        'disbp': $scope.patient.dbp,
        'oxygen': $scope.patient.oxylevel,
        'weight': $scope.patient.weight,
        'roomnum': $scope.patient.roomnum
    };
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        var req = $http.post('http://127.0.0.1:8081/receptionistcheckin', dataParams);
        req.success(function (data, status, headers, config) {

            console.log(data);
            if(data === "Success"){
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('tab-receptionist.check_in');
            }else if(data === "DBUPDATE failure"){
               // alert("registration Failed, DB error!!!");
                $state.go('tab-receptionist.check_in', {}, {location: "replace", reload: true});
            }
            else{
               // alert("registration Failed, User already exists!!!");
                $state.go('tab-receptionist.check_in');
            }

            //$window.location.href = "showusers.html";

        });
        req.error(function (data, status, headers, config) {
            //alert("failure message: " + JSON.stringify({data: data}));
        });
	}
  //$scope.appointment = appointments.get($stateParams.appointmentId);

  $scope.toggleAutoSearch = false;
  $scope.st ={};
 

 $scope.searchData = null;

 $scope.initiateAutoSearch = function() {
     if($scope.st.searchText){
  $scope.toggleAutoSearch = true;  
  autoSearchFactory.getCountries($scope.st.searchText).then(function(data) {
      console.log("search done:"+ JSON.stringify(data));
   $scope.st.searchData = data;
  });
     }else{$scope.toggleAutoSearch = false;}
 }

 $scope.selectedSearchResult = function(input) {
  $scope.st.searchText = input;
  $scope.toggleAutoSearch = false;
 }

})


function AddEvent(event){
localStorage.getItem("newEvents",event);
}

function idGen() {
   return Math.floor((Math.random() * 10) + 1);
   
}
function getEvents(){
   return [ {
                        "id": 1,
                        "title": "Meet Dr Adam",
                        "start": "2017-04-17T12:40:00",
                        "end": "2017-04-17T01:05:00"
                        },{"id": 2,
                            "title": "Not feeling well",
                            "start": "2017-04-17T10:30:00",
                            "end": "2017-04-17T10:55:00"
                        }
    ]
}
function GetDoctor(){
    return [{
        id:1,
        name:"Dr Adam John"
    },{
        id:2,
        name:"Dr Ray Cena"
    },{
        id:3,
name:"Dr Susan Friend"
    }]
}
function CreateEvents(http){
    var dataParams = {
       "appt_id": 2,
    "patient_id": 2,
    "patient": {
        "name": "Shalin Patel",
        "email": "shalin123@gmail.com",
        "contact_num": "8163277412"
    },
    "doc_id": 2,
    "doctor": {
        "name": "Dr. Adam John"
    },
    "event": {
        "id": 1,
        "title": "Meet Dr Adam",
        "start": "2017-04-17T12:40:00",
        "end": "2017-04-17T01:05:00"
    },
    "recep": false,
    "nurse": false,
    "doc": false,
    "vital": {
        "sysbp": null,
        "disbp": null,
        "oxygen": null,
        "weight": null
    },
    "roomnum": null,
    "reason": "XXX",
    "result": "XXX"
    };
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };
        var req = http.post('http://127.0.0.1:8081/createappointment', dataParams);
        req.success(function (data, status, headers, config) {

        });
        req.error(function (data, status, headers, config) {
            //alert("failure message: " + JSON.stringify({data: data}));
        });
}

