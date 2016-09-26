(function(){
  'use strict';
  const host = 'http://localhost:3000'
  let app = angular.module('PortalApp', [ 'ngMaterial','ngCookies','ngRoute' ]);
  const httpConfig = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };

  app.config(function($routeProvider) {
    $routeProvider
      .when('/', {
          templateUrl: 'list.html',
          controller: 'PortalController',
          page: 'app'
      })
      .when('/app', {
          templateUrl: 'app.html',
          controller: 'PortalController',
          page: 'app',
          mode: 'Create'
      })
      .when('/app/edit', {
          templateUrl: 'app.html',
          controller: 'PortalController',
          page: 'app',
          mode: 'Edit'
      })
      .when('/user', {
          templateUrl: 'list.html',
          controller: 'PortalController',
          page: 'user'
      })
      .when('/user/user', {
          templateUrl: 'user.html',
          controller: 'PortalController',
          page: 'user',
          mode: 'Create'
      })
      .when('/user/edit', {
          templateUrl: 'user.html',
          controller: 'PortalController',
          page: 'user',
          mode: 'Edit'
      })
      .when('/login', {
          templateUrl : 'login.html',
          controller  : 'PortalController'
      });
  });

  app.controller('PortalController', function ($scope, $http, $cookies, $window, $mdSidenav, $mdToast, $location, $rootScope, $route) {
    $scope.init = init;

    $scope.login = login;
    $scope.logout = logout;

    $scope.create = create;
    $scope.save = save;
    $scope.get = get;
    $scope.remove = remove;

    $scope.addApp = addApp;
    $scope.getUserDetail = getUserDetail;

    $scope.stages = ["Dev","Released","Testing", "Published"];
    $scope.category = ["All","Essential","Finance"];
    $scope.roles = ["Developer","Tester","User","Admin"];
    $scope.designation = ["Associate","Senior Associate","Lead","Manager"];

    $scope.menu = [
      {name:"Apps",icon:"apps",path:'/'},
      {name:"Create App",icon:"extension",path:'/app'},
      {name:"Users",icon:"account_circle",path:'/user',role:3},
      {name:"Create User",icon:"perm_identity",path:'/user/user',role:3},
    ];

    $scope.toggleList = toggleList;
    $scope.navigate = navigate;

    if($route.current && $route.current.$$route){
      if($route.current.$$route.mode){ 
        $scope.mode = $route.current.$$route.mode;
      }
      if($route.current.$$route.page){ 
        $scope.page = $route.current.$$route.page;
        console.log($location.path(),$scope.page);
      }
    }

    if($rootScope.item){ 
      $scope.item = $rootScope.item;
    }
    if($scope.mode == 'Create'){
      $scope.item = {};
    }

    $scope.filterRole = function(menuItem) {
        return (menuItem.role == undefined || menuItem.role == $scope.user.role);
    };

    init();

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
      $location.path('/login');
    }

    function loginSuccess(res) {
      let jwt = parseJwt(res.data.token);
      $cookies.put('token', res.data.token, {expires: new Date(jwt.exp * 1000)});
      toast('Welcome '+ jwt._doc.name || '');
      $location.path('/');
    }

    function create(){
      let uri = host + '/api/' + $scope.page;
      let httpConfig = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'AuthToken': $scope.token,
        }
      };
      let data = JSON.stringify($scope.item);
      $http.post(uri, data, httpConfig).then(successCallback, errorCallback);
    }

    function save(){
      let uri = host + '/api/' + $scope.page + '/' + $scope.item._id;
      let httpConfig = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'AuthToken': $scope.token,
        }
      };
      let data = JSON.stringify($scope.item);
      $http.put(uri, data, httpConfig).then(successCallback, errorCallback);
    }

    function addApp(appId){
      let uri = host + '/api/user/' + $scope.userId;
      let httpConfig = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'AuthToken': $scope.token,
        }
      };
      let apps = $scope.user.apps || [];
      apps.push(appId);
      let data = JSON.stringify({apps:apps});
      $http.put(uri, data, httpConfig).then(successCallback, errorCallback);
    }

    function remove(item){
      let uri = host + '/api/' + $scope.page + '/' + item._id;
      let httpConfig = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'AuthToken': $scope.token,
        }
      };
      $http.delete(uri, httpConfig).then(successCallback, errorCallback);
      $scope.items.splice($scope.items.indexOf(item), 1);
    }

    function get(){
      let uri = host + '/api/' + $scope.page;
      let httpConfig = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'AuthToken': $scope.token,
        }
      };
      $http.get(uri, httpConfig).then(getAppsCallback, errorCallback);
    }

    function getAppsCallback(res){
        $scope.items = res.data;
    }

    function getUserDetail(){
      let uri = host + '/api/user/' + $scope.userId;
      let httpConfig = {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'AuthToken': $scope.token,
        }
      };
      $http.get(uri, httpConfig).then(res => $scope.user=res.data, errorCallback);
    }

    function successCallback(res) {
      toast('Done!');
      //if($scope.mode == 'Create' || $scope.mode == 'Edit'){ 
      //}
      if($scope.page == 'app'){
        $location.path('/');
      }
      else{
        $location.path('/user');
      }
    }

    function errorCallback(res) {
        toast('Error occured');
        console.log(res);
    }

    function init(){
      let token = $cookies.get('token');
      if(token){
        let jwt = parseJwt(token);
        $scope.userId = jwt._doc._id;
        $scope.user = jwt._doc;
        $scope.token = token;
      }
      else{
        $location.path('/login');
      }
    }

    function parseJwt(token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse($window.atob(base64));
    }

    function toggleList() {
      if($mdSidenav('left')!=undefined)
      $mdSidenav('left').toggle();
    }

    function navigate(path, item){
      if(item && !$scope.mode){
        $rootScope.item = item;
      }

      $location.path(path); 
    }

    function toast(message){
      $mdToast.show(
        $mdToast.simple()
          .textContent(message)
          .hideDelay(3000)
      );
    }

  });

})();
