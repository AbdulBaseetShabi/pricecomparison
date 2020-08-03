//navigate user back to login page if they are not logged in
if (window.location.pathname !== "/login" && window.location.pathname !== "/signup" && window.sessionStorage.getItem("userID") === null){
    window.location.replace(window.location.origin+'/login');
}else if((window.location.pathname === "/login" || window.location.pathname === "/signup") && window.sessionStorage.getItem("userID") !==null){
    window.location.replace(window.location.origin+'/');
}

var host = "http://localhost:5000";
var app = angular.module("myApp", []);

app.controller("LogInController",
    function ($scope, $http) {
        $scope.email = "";
        $scope.password = "";
        $scope.login = function() {
            var query = `email=${$scope.email}&password=${$scope.password}`
            $http.get(host + "/administration/logIn?" + query).then(
                function success(response) {
                    if (response.status == 200){
                        userID = response.data.userID
                        if (userID !== 'null'){
                            window.sessionStorage.setItem("userID",response.data.userID);
                            window.location.replace(window.location.origin+'/');
                        }else{
                            alert("Incorrect Username or Password");
                        }

                    }else{
                        alert(response.data.error);
                    }
                },
                function error(response) {
                    alert(response)
                }
            );
        }
    }
);

app.controller("SignUpController",
    function ($scope, $http) {
        $scope.firstname = "";
        $scope.lastname = "";
        $scope.email = "";
        $scope.password = "";
        $scope.phonenumber = "";

        $scope.signup = function () {
            var query = `name=${$scope.firstname} ${$scope.lastname}&email=${$scope.email}&password=${$scope.password}&phonenumber=${$scope.phonenumber}`;
            $http.get(host + "/administration/addItemToDB?" + query).then(
                function success(response) {
                    if (response.status == 200){
                        alert("You have successful signed up");
                        window.location.replace(window.location.origin+'/login');
                    }else{
                        alert(response.data.error);
                    }
                },
                function error(response) {
                    alert(response);
                }
            );
        }
    }
);

app.controller("ProfileController", 
    function($scope, $http){
        $scope.firstname;
        $scope.lastname;
        $scope.email;
        $scope.phonenumber;
        $scope.password;
        $scope.edit_mode = false;

        $scope.changeMode = function () {
            $scope.edit_mode = !$scope.edit_mode;
        }

        $scope.saveProfile = function () {
            var query = `name=${$scope.firstname} ${$scope.lastname}&email=${$scope.email}&password=${$scope.password}&phonenumber=${$scope.phonenumber}&userID=${window.sessionStorage.getItem('userID')}`
            $http.get(host + "/administration/updateSettings?" + query).then(function success(response){
                if (response.status === 200 && response.data.result === 'done') { 
                    alert('Profile Updated Successfully')

                }else{
                    alert(response.data.error);
                }
                getUser();
                $scope.changeMode();
            }, function error(response){
                alert(response)
                getUser();
                $scope.changeMode();    
            });
        }

        $scope.refreshProfile = function () {
            getUser();
            $scope.changeMode();
        }

        function getUser() {
            var query = `userID=${window.sessionStorage.getItem("userID")}`
            $http.get(host + "/administration/getUserDetail?" + query).then(
                function success(response){
                    if (response.status == 200){
                        var name_array = response.data.userDetail[4].split(" ")
                        $scope.firstname = name_array[0];
                        $scope.lastname = name_array[1];
                        $scope.password = response.data.userDetail[3];
                        $scope.email = response.data.userDetail[2];
                        $scope.phonenumber = response.data.userDetail[5];
                    }else{
                        alert(response.data.error);
                    }
                }, 
                function error(response){
                    alert(response);
                }
            );
        }

        $scope.deleteUser = function () {
            var ans = confirm("Are you sure you want to delete this user?");
            if (ans) {
                var query = `userID=${window.sessionStorage.getItem('userID')}`;
                $http.get(host + "/administration/removeItemFromDB?" + query).then(
                    function success(response){
                        if (response.status == 200){
                            signout();
                        }else{
                            alert(response.data.error);
                        }
                    },
                    function error(response){
                        alert(response);
                    }
                )  
            }
        }
        
        getUser();
    }
);

function signout(){
    window.sessionStorage.removeItem("userID");
    window.location.replace(window.location.origin+'/login');
}