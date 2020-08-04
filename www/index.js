//navigate user back to login page if they are not logged in
if (window.location.pathname !== "/login" && window.location.pathname !== "/signup" && window.sessionStorage.getItem("userID") === null) {
    window.location.replace(window.location.origin + '/login');
} else if ((window.location.pathname === "/login" || window.location.pathname === "/signup") && window.sessionStorage.getItem("userID") !== null) {
    window.location.replace(window.location.origin + '/');
}

var host = "http://localhost:5000";
var app = angular.module("myApp", []);

app.controller("LogInController",
    function ($scope, $http) {
        $scope.email = "";
        $scope.password = "";
        $scope.login = function () {
            var query = `email=${$scope.email}&password=${$scope.password}`
            $http.get(host + "/administration/logIn?" + query).then(
                function success(response) {
                    if (response.status == 200) {
                        userID = response.data.userID
                        if (userID !== 'null') {
                            window.sessionStorage.setItem("userID", response.data.userID);
                            window.location.replace(window.location.origin + '/');
                        } else {
                            alert("Incorrect Username or Password");
                        }

                    } else {
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
                    if (response.status == 200) {
                        alert("You have successful signed up");
                        window.location.replace(window.location.origin + '/login');
                    } else {
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
    function ($scope, $http) {
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
            $http.get(host + "/administration/updateSettings?" + query).then(function success(response) {
                if (response.status === 200 && response.data.result === 'done') {
                    alert('Profile Updated Successfully')

                } else {
                    alert(response.data.error);
                }
                getUser();
                $scope.changeMode();
            }, function error(response) {
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
                function success(response) {
                    if (response.status == 200) {
                        var name_array = response.data.userDetail[4].split(" ")
                        $scope.firstname = name_array[0];
                        $scope.lastname = name_array[1];
                        $scope.password = response.data.userDetail[3];
                        $scope.email = response.data.userDetail[2];
                        $scope.phonenumber = response.data.userDetail[5];
                    } else {
                        alert(response.data.error);
                    }
                },
                function error(response) {
                    alert(response);
                }
            );
        }

        $scope.deleteUser = function () {
            var ans = confirm("Are you sure you want to delete this user?");
            if (ans) {
                var query = `userID=${window.sessionStorage.getItem('userID')}`;
                $http.get(host + "/administration/removeItemFromDB?" + query).then(
                    function success(response) {
                        if (response.status == 200) {
                            signout();
                        } else {
                            alert(response.data.error);
                        }
                    },
                    function error(response) {
                        alert(response);
                    }
                )
            }
        }

        getUser();
    }
);

app.controller("SearchController",
    function ($scope, $http) {
        $scope.search = "";
        $scope.result = [];

        $scope.saveItem = function (item, index) {
            var query = `userID=${window.sessionStorage.getItem('userID')}&name=${item.name}&url=${item.url}&company_name=${item.retailer}&price=${item.salePrice}&image_url=${item.largeImage}`;
            $http.get(host + "/savedItems/addNewItem?" + query).then(
                function success(response) {
                    if (response.status == 200) {
                        $scope.result[index].saved = true;
                    } else {
                        alert(response.data.error);
                    }
                }, function error(response) {
                    alert(response);
                }
            );
        }

        function getResults(value) {
            var query = `search=${value.split("=")[1]}`;
            $http.get(host + "/bestbuyproducts/products?" + query).then(
                function success(response) {
                    if (response.status == 200) {
                        $scope.result = response.data.result;
                        for (var i = 0; i <$scope.result.length; i++) {
                            $scope.result[i].saved = false;
                        }

                    } else {
                        alert(response.data.error);
                    }
                }, function error(response) {
                    alert(response);
                }
            );
        }

        if (window.location.pathname === '/search'){
            var search = window.location.search;
            if(search){
                getResults(search.slice(1));
            }else{
                alert("No Search Query");
            }
        }
    }
);

app.controller("SavedItemController", 
    function ($scope, $http){
        $scope.saved_items = [];

        function getSavedItems(){
            var query = `userID=${window.sessionStorage.getItem('userID')}`
            $http.get(host + "/savedItems/displayData?" + query).then(
                function success(response){
                    if (response.status == 200){
                        $scope.saved_items = response.data.result;
                    }
                }, 
                function error(response){
                    alert(response);
            });
        }

        $scope.unsaveItem = function (code) {
            var query = `itemID=${code}`;
            $http.get(host + "/savedItems/removeItem?" + query).then(
                function success(response) {
                    if (response.status == 200) {
                        $scope.saved_items = $scope.saved_items.filter(function(item){
                            return item.itemID !== code
                        })
                    } else {
                        alert(response.data.error);
                    }
                }, function error(response) {
                    alert(response);
                }
            );
        }
        getSavedItems();
    }
);

function signout() {
    window.sessionStorage.removeItem("userID");
    window.location.replace(window.location.origin + '/login');
}