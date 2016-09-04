/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 28/08/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.views.administration.users')
		.controller('AdministrationUsersController', AdministrationUsersController);

	/** @ngInject */
	function AdministrationUsersController($timeout, $state, $mdDialog, $mdToast, usersService, user, roles, CONFIG) {
		var vm = this;
		// Variables
		vm.query = {
			order: '-username', // '-' => desc / '' => asc
			limit: 5,
			page: 1,
			pages: [],
			rowsPerPage: [5, 10, 15],
			items: {
				min: null,
				max: null
			}
		};
		vm.data = {
			total: 0,
			items: []
		};
		// Functions
		vm.getElements = getElements;
		vm.nextPage = nextPage;
		vm.previousPage = previousPage;
		vm.changeRowPage = changeRowPage;
		vm.getAccountType = getAccountType;
		vm.getRoleName = getRoleName;
		vm.changePassword = changePassword;
		vm.deleteUser = deleteUser;
		vm.addUserModal = addUserModal;

		// Activate
		activate();

		////////////////


		/* ************************************* */
		/* ********  PRIVATE FUNCTIONS  ******** */
		/* ************************************* */

		/* ************************************* */
		/* ********   PUBLIC FUNCTIONS  ******** */
		/* ************************************* */

		/**
		 * Activate.
		 */
		function activate() {
			if (!_.isEqual(user.role, CONFIG.ROLES.admin)) {
				// Not authorized to be here
				$state.go('header.projects.list');
			}
			else {
				vm.getElements();
			}
		}

		/**
		 * Add user modal.
		 */
		function addUserModal() {
			$mdDialog.show({
				templateUrl: 'crash-reporter/views/administration/users/modal/addUser.html',
				controller: 'AdminAddNewUserController',
				controllerAs: 'adminAddNewUserCtrl',
				clickOutsideToClose: true,
				clickEscapeToClose: true,
				locals: {
					roles: roles
				},
				bindToController: true
			}).then(function () {
				$state.go($state.current, {}, {reload: true});
			});
		}

		/**
		 * Delete user.
		 * @param user {Object} user
		 */
		function deleteUser(user) {
			var confirm = $mdDialog.confirm()
				.title('Delete User')
				.textContent('Are you sure you want to remove this user ("' + user.username + '") ?')
				.ariaLabel('Delete User')
				.ok('Ok')
				.cancel('Cancel');
			$mdDialog.show(confirm).then(function () {
				usersService.remove(user.id).then(function () {
					var toast = $mdToast.simple()
						.textContent('Delete user succeed !')
						.position('top right')
						.hideDelay(1000);
					// Show toast
					$mdToast.show(toast).finally(function () {
						$state.go('header.administration.users', {}, {reload: true});
					});
				}, function () {
					// Error
					var toast = $mdToast.simple()
						.textContent('Delete user failed !')
						.position('top right')
						.hideDelay(3000);
					// Show toast
					$mdToast.show(toast);
				});
			});
		}

		/**
		 * Change password
		 * @param user {Object} user
		 */
		function changePassword(user) {
			$mdDialog.show({
				controller: 'AdminUserChangePasswordController',
				controllerAs: 'adminUserChangePasswordCtrl',
				templateUrl: 'crash-reporter/views/administration/users/modal/password.html',
				locals: {
					user: user
				},
				bindToController: true,
				clickOutsideToClose: true
			});
		}

		/**
		 * Get account type.
		 * @param user {Object} user
		 * @returns {*}
		 */
		function getAccountType(user) {
			if (user.github && user.github.id) {
				return 'Github';
			}
			else {
				return 'Local';
			}
		}

		/**
		 * Get Role Name.
		 * @param user {Object} user
		 * @returns {*}
		 */
		function getRoleName(user) {
			switch (user.role) {
				case 'admin':
					return 'Administrator';
				case 'normal':
					return 'Normal';
				default:
					return 'Unknown';
			}
		}

		/**
		 * Change Row page.
		 */
		function changeRowPage() {
			vm.query.page = 1;
			getElements();
		}

		/**
		 * Previous page.
		 */
		function previousPage() {
			vm.query.page--;
			getElements();
		}

		/**
		 * Next page.
		 */
		function nextPage() {
			vm.query.page++;
			getElements();
		}

		/**
		 * Get Elements.
		 */
		function getElements() {
			var sort = {};
			// Create sort object
			var text = vm.query.order;
			if (text[0] === '-') {
				sort[text.substr(1, text.length)] = 'desc';
			}
			else {
				sort[text] = 'asc';
			}

			// Send request
			usersService
				.getAll(vm.query.limit, vm.query.limit * (vm.query.page - 1), sort)
				.then(function (data) {
					// Put data in
					vm.data = data;
					// Update items
					vm.query.items.min = vm.query.limit * (vm.query.page - 1) + 1;
					var max = vm.query.limit * vm.query.page;
					vm.query.items.max = (max > data.total) ? data.total : max;
					// Update pages
					var maxPage = Math.ceil(data.total / vm.query.limit);
					var pages = [];
					for (var i = 1; i <= maxPage; i++) {
						pages.push(i);
					}
					vm.query.pages = pages;
				});
		}
	}

})();

