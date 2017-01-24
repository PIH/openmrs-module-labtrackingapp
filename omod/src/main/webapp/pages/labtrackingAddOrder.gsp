
<%
    ui.decorateWith("appui", "standardEmrPage")
    ui.includeFragment("labtrackingapp", "libs")
    ui.includeJavascript("labtrackingapp", "components/LabTrackingAddOrderController.js")
    ui.includeJavascript("labtrackingapp", "app_add_order.js")
%>

<script type="text/javascript" xmlns="http://www.w3.org/1999/html">
    var breadcrumbs = [
        {icon: "icon-home", link: '/' + OPENMRS_CONTEXT_PATH + '/index.htm'},
        {
            label: "${ ui.message("labtrackingapp.title") }", link: "${ ui.pageLink("labtrackingapp", "labtrackingViewQueue?appId=labtrackingapp.app.viewQueue") }"
        }

    ];
</script>

${ ui.includeFragment("coreapps", "patientHeader", [ patient: patient ]) }

<div class="container" ng-app="labTrackingApp" ng-controller="addOrderController">
	<div class="panel panel-primary" id="order_box">
		<div class="panel-heading">${ui.message("labtrackingapp.addorderpagetitle")}</div>
		<div class="panel-body">
			<form name="addOrderForm">
				<div class="form-group row">
					<label class="col-sm-2 col-form-label">${ui.message("labtrackingapp.prelabdiagnosislabel")}</label>
					<div class="col-sm-10">
                    <input type="text" ng-model="order.preLabDiagnosis"  class="form-control"
                        uib-typeahead="item as item.label for item in diagnoses | filter:{label:${'$viewValue'}} | limitTo:8" typeahead-editable="false" />

					</div>
				</div>
				<div class="form-group row">
					<label for="procedure" class="col-sm-2 col-form-label">${ui.message("labtrackingapp.proceduresitelabel")}</label>
					<div class="col-sm-10">
						<select id="procedure" class="form-control" multiple   ng-required="true"
                  ng-options="item as item.label disable when item.value=='?????' for item in procedures | orderBy:'label' track by item.value "
                  ng-model="order.procedures" ></select>
					</div>
				</div>
				<div class="form-group row">
					<label for="procedurenoncoded" class="col-sm-2 col-form-label">${ui.message("labtrackingapp.procedureNonCoded")}</label>
					<div class="col-sm-10">
						<input type="text" class="form-control" id="procedurenoncoded" placeholder="" ng-model="order.procedureNonCoded.value"></input>
					</div>
				</div>
				<div class="form-group row">
					<label for="caresetting" class="col-sm-2 col-form-label">${ui.message("labtrackingapp.caresettinglabel")}</label>
					<div class="col-sm-10">
						<select class="form-control" id="caresetting"  ng-required="true"
                    ng-options="item as item.label for item in careSettings | orderBy:'label' track by item.value "
                    ng-model="order.careSetting"></select>
					</div>
				</div>
				<div class="form-group row">
					<label for="instructions" class="col-sm-2 col-form-label">${ui.message("labtrackingapp.instructionslabel")}</label>
					<div class="col-sm-10">
						<textarea class="form-control" id="instructions" placeholder="" ng-model="order.instructions.value"></textarea>
					</div>
				</div>
				<div class="form-group row">
					<label for="history" class="col-sm-2 col-form-label">${ui.message("labtrackingapp.clinicalhistorylabel")}</label>
					<div class="col-sm-10">
						<textarea type="text" class="form-control" id="history" placeholder="" ng-model="order.clinicalHistory.value"></textarea>
					</div>
				</div>
				<div class="pull-right">
					<button id="cancelB" type="button" class="btn btn-default cancel" ng-click="handleCancelOrder()">${ui.message("uicommons.cancel")}</button>
					<button class="btn btn-success" ng-click="handleSaveOrder()" ng-disabled="addOrderForm.${'$'}invalid" >${ui.message("uicommons.save")}</button>
				</div>
			</form>
			<div class="row">
				<div class="col-sm-12">
					<br/>
					<div class="alert alert-danger" ng-if="error">
						<strong>Save failed!</strong> - {{error}}
					</div>
				</div>
			</div>
		</div>
	</div>

    <script type="text/ng-template" id="myModalContent.html">
        <div class="modal-header">
            <h3 class="modal-title" id="modal-title">${ui.message("labtrackingapp.savingtitle")}</h3>
        </div>
        <div class="modal-body" id="modal-body">
            <img class="center-block"  src="${ ui.resourceLink("uicommons", "images/spinner.gif") }" />
        </div>
    </script>
	<h1 ng-if="error">Debug info</h1>
	<pre ng-if="error">debugInfo={{debugInfo | json }}</pre>
	<pre ng-if="error">{{order | json }}</pre>
</div>

<script type="text/javascript">
    angular.module('labTrackingApp')
			.value('patientUuid', '${ patient.uuid }')
			.value('locationUuid', '${ location.uuid }');

    jq(function () {
        // make sure we reload the page if the location is changes; this custom event is emitted by by the location selector in the header
        jq(document).on('sessionLocationChanged', function () {
            window.location.reload();
        });
    });
</script>
