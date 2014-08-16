var Ctrls = angular.module('EmployeeControllers', []);

Ctrls.controller('listCtrl',[
    '$scope',
    '$location',
    'EmployeeService',
    function ($scope, $location, EmployeeService){

    	$scope.limit = 3;
        $scope.offset = 0;
        $scope.total = 0;
        $scope.currentPage = 0;
        $scope.totalEmployee = EmployeeService.query();

        $scope.delete = function(index) {
        	if (typeof index != "undefined") {
				EmployeeService.delete({id: $scope.employees[index].id})
				$scope.employees.splice(index, 1);
		    }
		};

		$scope.update = function(index){
			$location.path('/edit/'+$scope.employees[index].id);
		};

		function paginate(){
			$scope.offset = $scope.currentPage <= 0 ? 0 : $scope.currentPage - 1;
    		$scope.employees = EmployeeService.query({offset: $scope.offset, limit: $scope.limit});
		}

		$scope.paginate = function(page){
			if (page < 0 || page > $scope.pages.length){ return; }
			$scope.currentPage = page;
			return paginate(page);
		}

		$scope.$watch('totalEmployee.length', function(new_value, old_value){
			
			if(new_value > old_value ){
				var pageCount = Math.ceil(new_value / $scope.limit);
				$scope.pages = [];
				for (var i=0; i<pageCount; i++){
                    $scope.pages.push(i+1);
                }
                if(old_value < 1){
                	paginate();	
                }
			}
		});		
    }
]);

Ctrls.controller('createCtrl',[
    '$scope',
    '$location',
    'EmployeeService',
    function ($scope, $location, EmployeeService){
        $scope.action = 'Add';
        $scope.gender = ['male', 'female'];
		$scope.save = function() {
			EmployeeService.save($scope.employee, function() {
				$location.path('/');
			});
		};
    }
]);

Ctrls.controller('editCtrl',[
	'$scope', 
	'$location', 
	'$stateParams', 
	'EmployeeService',
	function ($scope, $location, $stateParams, EmployeeService){
		$scope.action = "Update";
        $scope.gender = ['male', 'female'];
		var id = $stateParams.id
		EmployeeService.get({id: id}, function(resp) {
			$scope.employee = resp.content;
		});
		$scope.save = function() {
			EmployeeService.update({id: id}, $scope.employee, function() {
				$location.path('/');
			});
		}
	}
]);