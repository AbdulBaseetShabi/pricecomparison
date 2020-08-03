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

        function loginValidation(){}
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

function signout(){
    window.sessionStorage.removeItem("userID");
    window.location.replace(window.location.origin+'/login');
}