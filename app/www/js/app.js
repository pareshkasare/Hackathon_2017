// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
.factory('autoSearchFactory2', function($http, $q, $window) {
 return {
  getCountries : function(countryName) {
    console.log("cname:"+countryName);
   return $http.get('http://127.0.0.1:8081/medAPI?name='+countryName).then(function(response) {
      return response.data;
     }, function(errResponse) {
      console.error('Error while fetching users');
      return $q.reject(errResponse);
     });
  }
 }})
.factory('autoSearchFactory', function($http, $q, $window) {
 return {
  getCountries : function(countryName) {
    console.log("cname:"+countryName);
   return $http.post('http://127.0.0.1:8081/searchpatient',{"cnum":countryName}).then(function(response) {
      return response.data;
     }, function(errResponse) {
      console.error('Error while fetching users');
      return $q.reject(errResponse);
     });
  }
 }})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  .state('signin', {
      url: '/sign-in',
      templateUrl: 'templates/sign-in.html',
      controller: 'SignInCtrl'
    })
    .state('forgotpassword', {
      url: '/forgot-password',
      templateUrl: 'templates/forgot-password.html'
    })

.state('tab-doctor', {
    url: '/tab-doctor',
    abstract: true,
    templateUrl: 'templates/tab-doctor.html'
  })
  .state('tab-doctor.appointment', {
    url: '/appointment',
    views: {
      'tab-doctor-appointment': {
        templateUrl: 'templates/tab-doctor-appointment.html',
        controller: 'DoctorCtrl'
      }
    }
  })
.state('tab-doctor.dash', {
    url: '/dash',
    views: {
      'tab-doctor-dash': {
        templateUrl: 'templates/tab-doctor-dash.html',
        controller: 'DoctorCtrl'
      }
    }
  })
   .state('tab-doctor.doc-appt', {
      url: '/check_in-detail/:appointmentId',
      views: {
        'tab-doctor-dash': {
          templateUrl: 'templates/tab-doctor-check_in-detail.html',
          controller: 'docAttendDetailCtrl'
        }
      }
    })
 .state('tab-doctor.patient', {
    url: '/patient',
    views: {
      'tab-doctor-patient': {
        templateUrl: 'templates/tab-doctor-patient.html',
        controller: 'DoctorCtrl'
      }
    }
  })
  .state('tab-doctor.patient-info', {
    url: '/patient-info',
    views: {
      'tab-doctor-patient': {
        templateUrl: 'templates/tab-doctor-patient-info.html',
        controller: 'DoctorCtrl'
      }
    }
  })
  .state('tab-doctor.patient-reports', {
    url: '/patient-reports',
    views: {
      'tab-doctor-patient': {
        templateUrl: 'templates/tab-doctor-patient-reports.html',
        controller: 'DoctorCtrl'
      }
    }
  })
   // setup an abstract state for the receptionist directive
    .state('tab-receptionist', {
    url: '/tab-receptionist',
    abstract: true,
    templateUrl: 'templates/tab-receptionist.html'
  })
  // setup view for the receptionist appointment
    .state('tab-receptionist.home', {
    url: '/home',
   views: {
      'tab-receptionist-home': {
        templateUrl: 'templates/tab-receptionist-home.html',
        controller: 'ReceptionistCtrl'
      }
    }
  })
  // setup view for the receptionist appointment
    .state('tab-receptionist.home-appointment', {
    url: '/home-appointment',
   views: {
      'tab-receptionist-home': {
        templateUrl: 'templates/tab-receptionist-home-appointment.html',
        controller: 'ReceptionistCtrl'
      }
    }
  })
    // setup view for the receptionist appointment
    .state('tab-receptionist.suggest-doc', {
    url: '/home',
   views: {
      'tab-receptionist-home': {
        templateUrl: 'templates/tab-receptionist-suggest-doc.html',
        controller: 'ReceptionistCtrl'
      }
    }
  })


  // setup view for the receptionist check-in
    .state('tab-receptionist.check_in', {
    url: '/check_in',
    views: {
      'tab-receptionist-check_in': {
        templateUrl: 'templates/tab-receptionist-check_in.html',
        controller: 'ReceptionistCtrl'
      }
    }
  })
 // setup view for the receptionist check-in
    .state('tab-receptionist.check_in-detail', {
    url: '/check_in-detail/:appointmentId',
    views: {
      'tab-receptionist-check_in': {
        templateUrl: 'templates/tab-receptionist-check_in-detail.html',
        controller: 'attendDetailCtrl'
      }
    }
  })
  
// setup view for the receptionist check-in
    .state('tab-receptionist.home-appointment-create', {
    url: '/home-appointment-create',
    views: {
      'tab-receptionist-home': {
        templateUrl: 'templates/tab-receptionist-appointment-create.html',
        controller: 'ReceptionistCtrl'
      }
    }
  })
  
// setup view for the receptionist check-in
    .state('tab-receptionist.home-appointment-info', {
    url: '/home-appointment-info',
    views: {
      'tab-receptionist-home': {
        templateUrl: 'templates/eventInfo.html',
        controller: 'ReceptionistCtrl'
      }
    }
  })

// setup an abstract state for the nurse directive
    .state('tab-nurse', {
    url: '/tab-nurse',
    abstract: true,
    templateUrl: 'templates/tab-nurse.html'
  })
  // Each tab has its own nav history stack:
  .state('tab-nurse.reports', {
    url: '/reports',
    views: {
      'tab-nurse-reports': {
        templateUrl: 'templates/tab-nurse-reports.html',
        controller: 'NurseCtrl'
      }
    }
  })
  .state('tab-nurse.reports-appt', {
      url: '/check_in-detail/:appointmentId',
      views: {
        'tab-nurse-reports': {
          templateUrl: 'templates/tab-nurse-check_in-detail.html',
          controller: 'nurseattendDetailCtrl'
        }
      }
    })
.state('tab-nurse.eventInfo', {
    url: '/eventInfo',
    views: {
      'tab-nurse-eventInfo': {
        templateUrl: 'templates/eventInfo.html',
        controller: 'NurseCtrl'
      }
    }
  })
 // setup an abstract state for the patient directive
  .state('tab-patient', {
    url: '/tab-patient',
    abstract: true,
    templateUrl: 'templates/tab-patient.html'
  })
 // setup an tab appintment for the patient directive
    .state('tab-patient.account', {
    url: '/account',
     views: {
      'tab-patient-account': {
        templateUrl: 'templates/tab-patient-account.html',
        controller: 'PatientCtrl'
      }
    }
    
  })

  // setup an tab appintment for the patient directive
    .state('tab-patient.prescription', {
    url: '/prescription',
    views: {
      'tab-patient-prescription': {
        templateUrl: 'templates/tab-patient-prescription.html',
        controller: 'PatientCtrl'
      }
    }
   
  })
  // setup an tab appintment for the patient directive
    .state('tab-patient.appointment', {
    url: '/appointment',
    views: {
      'tab-patient-appointment': {
        templateUrl: 'templates/tab-patient-appointment.html',
        controller: 'PatientCtrl'
      }
    }
    
  })
 .state('tab-patient.showAppointment', {
    url: '/appointment/:id',
    views: {
      'tab-patient-appointment': {
        templateUrl: 'templates/tab-patient-show-appointment.html',
        controller: 'PatientCtrl'
      }
    }
  })
  .state('tab-patient.showHistory', {
    url: '/history/:id',
    views: {
      'tab-patient-history': {
        templateUrl: 'templates/tab-patient-show-history.html',
        controller: 'PatientCtrl'
      }
    }
  })
  // setup an tab appintment for the patient directive
    .state('tab-patient.history', {
    url: '/history',
     views: {
      'tab-patient-history': {
        templateUrl: 'templates/tab-patient-history.html',
        controller: 'PatientCtrl'
      }
    }
  })
  // setup an tab appintment for the patient directive
    .state('tab-patient.patient-report', {
    url: '/patient-report',
     views: {
      'tab-patient-reports': {
        templateUrl: 'templates/tab-patient-patient-report.html',
        controller: 'PatientCtrl'
      }
    }
    
  })
 
   // setup an tab appintment for the patient directive
    .state('tab-patient.reports', {
    url: '/reports',
     views: {
      'tab-patient-reports': {
        templateUrl: 'templates/tab-patient-reports.html',
        controller: 'PatientCtrl'
      }
    }
  })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/sign-in');

});
