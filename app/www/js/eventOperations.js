 


 var showPopup = function(scope,ionicPopup) {
      scope.data = {}
    
      // Custom popup
     var confirmPopup = $ionicPopup.confirm({
         title: 'Title',
         template: 'Are you sure?'
      });

      confirmPopup.then(function(res) {
         if(res) {
            console.log('Sure!');
         } else {
            console.log('Not sure!');
         }
      });

      myPopup.then(function(res) {
         console.log('Tapped!', res);
      });    
   };