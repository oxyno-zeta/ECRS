/*
 * Author: Alexandre Havrileck (Oxyno-zeta)
 * Date: 04/08/16
 * Licence: See Readme
 */
(function () {
	'use strict';

	angular
		.module('crash-reporter.views.project.statistics')
		.controller('ProjectStatisticsController', ProjectStatisticsController);

	/** @ngInject */
	function ProjectStatisticsController($mdSidenav, $mdDialog, projectsService, project) {
		var vm = this;
		// Variables
		var numberByVersionOptions = {
			"chart": {
				"type": "pieChart",
				"height": 400,
				"showLabels": true,
				"duration": 500,
				"labelThreshold": 0.01,
				"labelSunbeamLayout": true,
				"legend": {
					"margin": {
						"top": 5,
						"right": 35,
						"bottom": 5,
						"left": 0
					}
				},
				x: function (d) {
					return d.x;
				},
				y: function (d) {
					return d.y;
				}
			}
		};
		var numberByDateOptions = {
			chart: {
				type: 'historicalBarChart',
				height: 450,
				margin: {
					top: 20,
					right: 20,
					bottom: 65,
					left: 50
				},
				x: function (d) {
					return d.x;
				},
				y: function (d) {
					return d.y;
				},
				showValues: true,
				duration: 100,
				xAxis: {
					axisLabel: 'Date',
					tickFormat: function (d) {
						return moment(d).format('DD/MM/YYYY');
					},
					rotateLabels: 30,
					showMaxMin: false
				},
				yAxis: {
					axisLabel: 'Crash',
					axisLabelDistance: -10
				},
				tooltip: {
					keyFormatter: function (d) {
						return moment(d).format('DD/MM/YYYY');
					}
				},
				zoom: {
					enabled: true,
					scaleExtent: [1, 10],
					useFixedDomain: false,
					useNiceScale: false,
					horizontalOff: false,
					verticalOff: true,
					unzoomEventType: 'dblclick.zoom'
				}
			}
		};
		var numberByVersionByDateOptions = {
			chart: {
				type: 'lineWithFocusChart',
				height: 400,
				margin: {
					top: 20,
					right: 20,
					bottom: 60,
					left: 40
				},
				duration: 50,
				useInteractiveGuideline: true,
				color: d3.scale.category10().range(),
				xAxis: {
					axisLabel: 'Date',
					tickFormat: function (d) {
						return moment(d).format('DD/MM/YYYY');
					}
				},
				x2Axis: {
					axisLabel: 'Date',
					tickFormat: function (d) {
						return moment(d).format('DD/MM/YYYY');
					}
				},
				yAxis: {
					axisLabel: 'Crash',
					rotateYLabel: false
				},
				y2Axis: {
					axisLabel: 'Crash',
					rotateYLabel: false
				}
			}
		};

		vm.data = [];
		vm.options = {};
		vm.choice = '1';
		vm.startDate = null;
		vm.isStartDateWanted = false;
		vm.versions = [];
		vm.selectedVersions = [];
		vm.searchText = '';

		// Functions
		vm.openSidenav = openSidenav;
		vm.applyStatistics = applyStatistics;
		vm.choiceChange = choiceChange;
		vm.querySearch = querySearch;
		vm.openSeeAllVersionsModal = openSeeAllVersionsModal;
		vm.isApplyDisabled = isApplyDisabled;

		// Activate

		activate();

		////////////////


		/* ************************************* */
		/* ********  PRIVATE FUNCTIONS  ******** */
		/* ************************************* */

		/**
		 * Choose number by versions.
		 */
		function chooseNumberByVersions() {
			// Reinit variables
			vm.data = [];
			vm.options = numberByVersionOptions;

			projectsService.statisticsNumberByVersion(project.id).then(function (data) {
				vm.data = data;
			});
		}

		/**
		 * Choose number by date.
		 */
		function chooseNumberByDate() {
			// Reinit variables
			vm.data = [];
			vm.options = numberByDateOptions;

			projectsService.statisticsNumberByDate(project.id, vm.startDate).then(function (data) {
				vm.data = data;
			});
		}

		/**
		 * Choose number by version and by date.
		 */
		function chooseNumberByVersionByDate() {
			// Reinit variables
			vm.data = [];
			vm.options = numberByVersionByDateOptions;
			var date;
			// Put date if wanted
			if (vm.isStartDateWanted) {
				date = vm.startDate;
			}

			projectsService.statisticsNumberByVersionByDate(project.id, vm.selectedVersions, date).then(function (data) {
				vm.data = data;
			});
		}

		/* ************************************* */
		/* ********   PUBLIC FUNCTIONS  ******** */
		/* ************************************* */

		/**
		 * Activate.
		 */
		function activate() {
			// Version by number
			chooseNumberByVersions();
		}

		/**
		 * Check if 'Apply' is disabled.
		 * @returns {boolean}
		 */
		function isApplyDisabled() {
			if (vm.choice === '3') {
				return vm.selectedVersions.length === 0;
			}

			return false;
		}

		/**
		 * Choice change.
		 */
		function choiceChange() {
			if (vm.choice === '3') {
				projectsService.getAllVersions(project.id).then(function (versions) {
					vm.versions = versions;
				});
			}
		}

		/**
		 * Query search.
		 * @param query
		 * @returns {*}
		 */
		function querySearch(query) {
			return query ? vm.versions.filter(function (version) {
				return (version.indexOf(query) === 0);
			}) : [];
		}

		/**
		 * Apply statistics.
		 */
		function applyStatistics() {
			switch (vm.choice) {
				case '1':
					chooseNumberByVersions();
					break;
				case '2':
					chooseNumberByDate();
					break;
				case '3':
					chooseNumberByVersionByDate();
					break;
			}
		}

		/**
		 * Open see all versions modal.
		 */
		function openSeeAllVersionsModal() {
			$mdDialog.show({
				controller: 'VersionsStatisticsModalController',
				controllerAs: 'versionsStatisticsModalCtrl',
				templateUrl: 'crash-reporter/views/project/statistics/modal/versions.html',
				clickOutsideToClose: true,
				escapeToClose: true,
				bindToController: true,
				locals: {
					versions: vm.versions
				}
			});
		}

		/**
		 * Open Sidenav.
		 */
		function openSidenav() {
			vm.startDate = new Date();
			$mdSidenav('left')
				.toggle();
		}
	}

})();

