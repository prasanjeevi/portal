(function(){
  'use strict';
  const host = 'http://localhost:3000'
  let app = angular.module('PortalApp', [ 'ngMaterial','ngCookies' ]);
  const httpConfig = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };

  app.controller('PortalController', function ($scope, $http, $cookies, $window) {
    $scope.init = init;

    $scope.login = login;
    $scope.logout = logout;

    $scope.createApp = createApp;
    $scope.getApps = getApps;

    $scope.stages = ["Dev","Released","Testing", "Published"];
    $scope.category = ["All","Essential","Finance"];
    $scope.roles = ["Developer","Tester","User","Admin"];
    $scope.designation = ["Associate","Senior Associate","Lead","Manager"];
    

    $scope.mode = 'Create';

    function login(){
      let uri = host + '/authenticate';
      let httpConfig = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Email': $scope.user.email,
          'Password': $scope.user.password
        }
      };
      $http.post(uri, {}, httpConfig).then(loginSuccess, errorCallback);
    }

    function logout(){
      $cookies.remove('token');
    }

    function loginSuccess(res) {
      let jwt = parseJwt(res.data.token);
      $cookies.put('token', res.data.token, {expires: new Date(jwt.exp * 1000)});
      alert('logged in');
    }

    function createApp(){
      let uri = host + '/api/app';
      let httpConfig = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'AuthToken': $scope.token,
        }
      };
      let data = JSON.stringify($scope.app);
      $http.post(uri, data, httpConfig).then(successCallback, errorCallback);
    }

    function getApps(){
      let uri = host + '/api/app';
      let httpConfig = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'AuthToken': $scope.token,
        }
      };
      $http.get(uri, httpConfig).then(successCallback, errorCallback);
    }

    function successCallback(res) {
      alert('Success');
      console.log(res.data);
    }

    function errorCallback(res) {
      if (res.data.Message != undefined)
        alert(res.data.Message);
      else if (res.statusText != undefined)
        alert(res.statusText);
      else
        alert('Error occured');
    }

    function init(){
      let token = $cookies.get('token');
      if(token){
        let jwt = parseJwt(token);
        console.log(jwt._doc.email, token, jwt, new Date(jwt.exp * 1000));
        $scope.token = token;
      }
    }

    function parseJwt(token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse($window.atob(base64));
    }

  });

})();
