angular.module('app.controllers', [])
  
.controller('pageCtrl', ['$scope', '$state', '$ionicPlatform', '$ionicModal', 'DataFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName

function($scope, $state, $ionicPlatform,$ionicModal, DataFactory) {
    // Initialize the database.
    $ionicPlatform.ready(function() {
        DataFactory.initDB();

        // Get all birthday records from the database.
        DataFactory.getAllBirthdays().then(function(birthdays) {
            $scope.birthdays = birthdays;
        });
    });      
    
          // Initialize the modal view.
   $scope.modal = $ionicModal.fromTemplate('<ion-modal-view> <ion-header-bar><h1 class="title">{{ action }} Birthday</h1><div class="buttons"> <button ng-hide="isAdd" ng-click="deleteBirthday()" class="button button-icon icon ion-trash-a"></button></div> </ion-header-bar> <ion-content><div class="list list-inset"> <label class="item item-input"> <input type="text" placeholder="Name" ng-model="birthday.Name"> </label> <label class="item item-input"> <input type="date" placeholder="Birthday" ng-model="birthday.Date"> </label></div><label class="import-file"><button class="button button-block button-calm" ng-click="triggerInputFile()">Choose File</button><input type="file" class="inputFile" style="display:none;" accept="image/*"       onchange="angular.element(this).scope().inputFileChanged(this)"><div>Preview...</div></label><center>              <canvas id="myCanvas" width="100" height="100"></canvas></center><div class="padding"> <button ng-click="saveBirthday()" class="button button-block button-positive activated">Save</button></div> </ion-content> </ion-modal-view>'
                                           , {
      scope: $scope,
      animation: 'slide-in-up'
   })

      
      
      
    $scope.showAddBirthdayModal = function() {
        $scope.birthday = {};
        $scope.action = 'Add';
        $scope.isAdd = true;
        $scope.modal.show();           
    };

    $scope.showEditBirthdayModal = function(birthday) {
        $scope.birthday = birthday;
        $scope.action = 'Edit';
        $scope.isAdd = false;          
        $scope.modal.show();
    };

    $scope.saveBirthday = function() {
        if ($scope.isAdd) {
                                    var canvas = document.getElementById('myCanvas');
              var context = canvas.getContext('2d');
  var dataURL = canvas.toDataURL();
          $scope.birthday.photo=dataURL;
            DataFactory.addBirthday($scope.birthday);              
        } else {
            DataFactory.updateBirthday($scope.birthday);               
        }                       
        $scope.modal.hide();
    };

    $scope.deleteBirthday = function() {
        DataFactory.deleteBirthday($scope.birthday);           
        $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
        $scope.modal.remove(); 
    });

      
      
         /*Fetching File Names Begin*/
          $scope.resetInputFile = function() {
            $scope.singlefile = {
              name: '',
              content: ''
            }
              var canvas = document.getElementById('myCanvas');
              var context = canvas.getContext('2d');
              context.clearRect(0, 0, canvas.width, canvas.height);            
          }
          $scope.triggerInputFile = function() {
            document.getElementsByClassName('inputFile')[0].click()
          }
          $scope.inputFileChanged = function(ele) {
            var file = ele.files[0];
            $scope.singlefile = {}
            var fileReader = new FileReader();
            fileReader.onload = function(fileLoadedEvent) {
              var canvas = document.getElementById('myCanvas');
              var context = canvas.getContext('2d');
              context.clearRect(0, 0, canvas.width, canvas.height);
              var testImage = new Image;
              testImage.onload = function() {
                var canvasw = 100;
                var canvash = 100;
                var imagew = testImage.width;
                var imageh = testImage.height;
                var startx = 0;
                var starty = 0;
                var endx = imagew;
                var endy = imageh
                console.log(imagew);
                console.log(imageh);
                if (imagew < imageh) {
                  ratio = imagew / canvasw;
                  starty = imageh / 2 - canvash / 2;
                  endy = starty + canvash;
                } else {
                  ratio = imageh / canvash;
                  startx = imagew / 2 - canvasw / 2;
                  endx = startx + canvasw;
                }
                console.log(ratio);
                console.log(startx,
                  starty,
                  endx,
                  endy);
                var targetw = imagew / ratio;
                var targeth = imageh / ratio;
                //draw cropped image
                
                context.drawImage(
                  testImage,
                  startx, starty,
                  endx, endy,
                  0, 0,
                  canvasw, canvash);
                  
               
                $scope.$apply();
              };
              testImage.src = fileLoadedEvent.target.result;
              $scope.singlefile.name = file.name;
              $scope.singlefile.content = fileLoadedEvent.target.result;
              $scope.$apply();
              console.log($scope.singlefile)
            };
            fileReader.readAsDataURL(file);
          }      
      

}])
 