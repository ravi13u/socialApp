
                var app = angular.module('mittens',['ngRoute','ngCookies']); 

                app.config(function ($routeProvider) {
                  $routeProvider
                       .when('/',{
                         templateUrl: 'login.html',
                         controller: 'HomeController',
                       })
                       .when('/signup',{
                         templateUrl: 'signup.html',
                         controller: 'SignupController',
                       })
                       .when('/forgot',{
                       	templateUrl: 'forgot.html',
                       	controller: 'ForgotController'
                       });
                 });

         app.run(function($rootScope, $cookieStore){
          if($cookieStore.get('token') && $cookieStore.get('currentUser')){
               $rootScope.token = $cookieStore.get('token');
               $rootScope.currentUser = $cookieStore.get('currentUser');

          }
         });
       
        app.controller('HomeController',function($rootScope,$scope,$http,$cookieStore){
            
            $scope.submitNewMyvar=function(){
                 $http.post('/myvar',
                  {newmyvar: $scope.newmyvar},
                  {headers:  {
                    'authorization': $rootScope.token 
                    }}).then(function(){
                     getmyvar();
                       $scope.newmyvar = '';
             });
          };




         $scope.removemyvar = function (myvar) {
            $http.put('/myvar/remove',
                {myvar: myvar},
                {headers:  {
                    'authorization': $rootScope.token 
                    }}).then(function(){
                  getmyvar();
            });
          };
    
         $scope.signin = function(){
          $http.put('/user/signin',{username: $scope.username,password: $scope.password}).then(function(res){
             $cookieStore.put('token',res.data.token);
             $cookieStore.put('currentUser',$scope.username);
             $rootScope.token = res.data.token;
             $rootScope.currentUser = $scope.username;
          },function(err){
            alert('Sorry !! Try Again')
    
          });
         }
    

        $scope.logout = function(){
           $cookieStore.remove('token');
           $cookieStore.remove('currentUser');
           $rootScope.token = null;
           $rootScope.currentUser = null;
    
        };

         function getmyvar() {
             $http.get('/myvar').then(function(response){
               $scope.myvar = response.data;
               });
            }    
           getmyvar();
       });

  

      app.controller('SignupController',function($scope,$http){
          
         $scope.submitSignup = function(){
            var newUser = {
               username: $scope.username,
              password: $scope.password,
              email: $scope.email
            };
              $http.post('/user',newUser).then(function(){
                  alert('success');
            });
         }

         });

      app.controller('ForgotController',function($scope,$http){
      	$scope.submit = function(){
      		var oldUser = {
      			username: $scope.username
      		 };
      		 $http.post('/user',oldUser).then(function(){
      		 	alert('varification code has been sent to your email');
      		 });
      	}

      });
