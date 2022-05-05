<%
   ui.decorateWith("appui", "standardEmrPage", [ includeBootstrap: false ])
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
<style>
   .button-wrapper {
   margin-bottom:5px;
   }
   #procedure option{
      white-space: pre-wrap;
   }
</style>
${ ui.includeFragment("coreapps", "patientHeader", [ patient: patient ]) }
<div class="container" ng-app="labTrackingApp" ng-controller="addOrderController">
   <div class="panel panel-primary" id="order_box">
      <div ng-if="!order.uuid" class="panel-heading">${ui.message("labtrackingapp.addorderpagetitle")}</div>
      <div ng-if="order.uuid" class="panel-heading">${ui.message("labtrackingapp.editOrderPageTitle")}</div>
      <div class="panel-body">
         <form name="addOrderForm">
            <div class="form-group row required">
               <label class="col-sm-2 col-form-label control-label">${ui.message("labtrackingapp.listpage.requestdate")}</label>
               <div class="col-sm-10">
                  <div class='input-group date' id='date_of_request'>
                     <input type="text" class="form-control" uib-datepicker-popup="{{requestDateBoxOptions.format}}"
                            ng-model="order.sampleDate.value" is-open="requestDateBoxOptions.opened"
                            datepicker-options="requestDateBoxOptions.options"
                            ng-required="false" close-text="Close" alt-input-formats="requestDateBoxOptions.altInputFormats" />
                     <span class="input-group-btn">
                        <button type="button" class="btn btn-default" ng-click="showRequestDateBox()">
                           <i class="glyphicon glyphicon-calendar"></i>
                        </button>
                     </span>
                  </div>
               </div>
            </div>
            <div class="form-group row">
               <label class="col-sm-2 col-form-label" for="location">${ui.message("labtrackingapp.orderdetails.locationlabel")}</label>
               <div class="col-sm-9">
                  <select class="form-control" id="location" type="text" ng-model="order.locationWhereSpecimenCollected"  ng-options="a as a.label for a in locations | orderBy:'label' track by a.value" class="form-control"></select>
               </div>
            </div>
            <div class="form-group row">
               <label class="col-sm-2 col-form-label" for="surgeon">${ui.message("labtrackingapp.orderdetails.attendingsurgeonlabel")}</label>
               <div class="col-sm-9">
                  <select class="form-control" id="surgeon" type="text" ng-model="order.surgeon"  ng-options="a as a.label for a in providers | orderBy:'label' track by a.value"></select>
               </div>
            </div>
            <div class="form-group row">
               <label class="col-sm-2 col-form-label" for="resident">${ui.message("labtrackingapp.orderdetails.residentlabel")}</label>
               <div class="col-sm-9">
                  <select class="form-control" id="resident" type="text" ng-model="order.resident"  ng-options="a as a.label for a in providers | orderBy:'label' track by a.value"></select>
               </div>
            </div>
            <div class="form-group row">
               <label class="col-sm-2 col-form-label" for="mdtonotify">${ui.message("labtrackingapp.orderdetails.mdtonotifylabel")}</label>
               <div class="col-sm-9">
                  <input type='text' class="form-control" id="mdtonotify" ng-model="order.mdToNotify.value"  />
               </div>
            </div>
            <div class="form-group row">
               <label class="col-sm-2 col-form-label" for="phoneNumberForClinician">${ui.message("labtrackingapp.orderdetails.phoneNumberForClinician")}</label>
               <div class="col-sm-9">
                  <input type='text' class="form-control" id="phoneNumberForClinician" ng-model="order.phoneNumberForClinician.value"  />
               </div>
            </div>
            <div class="form-group row required">
               <label class="col-sm-2 col-form-label control-label">${ui.message("labtrackingapp.prelabdiagnosislabel")}</label>
               <div class="col-sm-9">
                  <div ng-if="!order.uuid" class="col-sm-9">
                     <input  type="text"
                             ng-model="order.preLabDiagnosis"
                             class="form-control"
                             ng-required="false"
                             uib-typeahead="item as item.label for item in searchDx(${'$viewValue'}) | limitTo:8"
                             typeahead-min-length="2"
                             typeahead-wait-ms="200"
                             typeahead-loading="loadingDx"
                             typeahead-no-results="noDxResults"/>
                     <i ng-show="loadingDx" class="glyphicon glyphicon-refresh"></i>
                     <div ng-show="noDxResults">
                        <i class="glyphicon glyphicon-remove"></i>${ui.message("labtrackingapp.dx.notfound")}
                     </div>
                  </div>
                  <p ng-if="order.uuid" class="form-control-static" > {{ formatDiagnosis(order.preLabDiagnosis) }}</p>
               </div>
            </div>
            <div class="form-group row required">
               <label for="procedure" class="col-sm-2 col-form-label control-label">${ui.message("labtrackingapp.proceduresitelabel")}</label>
               <div class="col-sm-4">
                  <input  type="text"
                          ng-model="selectedProcedures"
                          class="form-control"
                          ng-required="false"
                          uib-typeahead="item as item.label for item in searchProcedures(${'$viewValue'}) | limitTo:8"
                          typeahead-min-length="2"
                          typeahead-wait-ms="200"
                          typeahead-loading="loadingProcedures"
                          typeahead-no-results="noResults"
                          typeahead-on-select="onSelectProcedure(${'$item'}, ${'model'}, ${'label'})"/>
                  <i ng-show="loadingProcedures" class="glyphicon glyphicon-refresh"></i>
                  <div ng-show="noResults">
                     <i class="glyphicon glyphicon-remove"></i>${ui.message("labtrackingapp.procedure.notfound")}
                  </div>
               </div>
               <div class="col-sm-1">
                  <p>&nbsp;</p>
                  <button class="btn button-wrapper" type="button" ng-disabled="order.proceduresForSpecimen.length == 0" ng-click="removeProcedure()"><span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span></button>
               </div>
               <div class="col-sm-4">
                  <div class="panel panel-default">
                     <div class="panel-heading">${ui.message("labtrackingapp.proceduresSelected")}</div>
                     <div class="panel-body">
                          <select id="procedure" class="form-control" multiple
                             ng-options="item as item.label for item in order.proceduresForSpecimen | orderBy:'label' track by item.value "
                             ng-model="tempProcedures" ></select>
                     </div>
                  </div>
               </div>
            </div>
            <div class="form-group row">
               <label for="procedurenoncoded" class="col-sm-2 col-form-label">${ui.message("labtrackingapp.procedureNonCoded")}</label>
               <div class="col-sm-10">
                  <input type="text" class="form-control" id="procedurenoncoded" placeholder="" ng-model="order.procedureNonCoded.value"></input>
               </div>
            </div>
            <div class="form-group row required">
               <label class="control-label col-sm-3 control-label">${ui.message("labtrackingapp.orderdetails.suspectedCancer")}</label>
               <div class="col-sm-9">
                  <div class="btn-group btn-toggle">
                     <button class="btn btn-lg btn-default" ng-class="{'btn-danger': order.suspectedCancer.value=='3cd6f600-26fe-102b-80cb-0017a47871b2'}" ng-click="order.suspectedCancer.value='3cd6f600-26fe-102b-80cb-0017a47871b2'">${ui.message("uicommons.yes")}</button>
                     <button class="btn btn-lg btn-default" ng-class="{'btn-primary': order.suspectedCancer.value=='3cd6f86c-26fe-102b-80cb-0017a47871b2'}" ng-click="order.suspectedCancer.value='3cd6f86c-26fe-102b-80cb-0017a47871b2'">${ui.message("uicommons.no")}</button>
                  </div>
               </div>
            </div>
            <div class="form-group row">
               <label class="control-label col-sm-3">${ui.message("labtrackingapp.orderdetails.urgentreviewlabel")}</label>
               <div class="col-sm-9">
                  <div class="btn-group btn-toggle">
                     <button class="btn btn-lg btn-default" ng-class="{'btn-danger': order.urgentReview.value=='3cd6f600-26fe-102b-80cb-0017a47871b2'}" ng-click="order.urgentReview.value='3cd6f600-26fe-102b-80cb-0017a47871b2'">${ui.message("uicommons.yes")}</button>
                     <button class="btn btn-lg btn-default" ng-class="{'btn-primary': order.urgentReview.value=='3cd6f86c-26fe-102b-80cb-0017a47871b2'}" ng-click="order.urgentReview.value='3cd6f86c-26fe-102b-80cb-0017a47871b2'">${ui.message("uicommons.no")}</button>
                  </div>
               </div>
            </div>
            <div class="form-group row">
               <label for="caresetting" class="col-sm-2 col-form-label">${ui.message("labtrackingapp.caresettinglabel")}</label>
               <div class="col-sm-10">
                  <!-- Order fields are not editable, they could be set only when creating a new Order-->
                  <select ng-if="!order.uuid" class="form-control" id="caresetting"  ng-required="true"
                     ng-options="item as item.label for item in careSettings | orderBy:'label' track by item.value "
                     ng-model="order.careSetting"></select>
                  <p ng-if="order.uuid" class="form-control-static" >{{ order.careSetting.label }}</p>
               </div>
            </div>
            <div class="form-group row">
               <label class="col-sm-2 col-form-label">${ui.message("labtrackingapp.orderdetails.postopdiagnosislabel")}</label>
               <div class="col-sm-9">
                  <input  type="text"
                          ng-model="order.postopDiagnosis.diagnosis"
                          class="form-control"
                          ng-required="false"
                          uib-typeahead="item as item.label for item in searchDx(${'$viewValue'}) | limitTo:8"
                          typeahead-min-length="2"
                          typeahead-wait-ms="200"
                          typeahead-loading="loadingDx"
                          typeahead-no-results="noDxResults"/>
                  <i ng-show="loadingDx" class="glyphicon glyphicon-refresh"></i>
                  <div ng-show="noDxResults">
                     <i class="glyphicon glyphicon-remove"></i>${ui.message("labtrackingapp.dx.notfound")}
                  </div>
               </div>
            </div>
            <div class="form-group row">
               <label for="instructions" class="col-sm-2 col-form-label">${ui.message("labtrackingapp.instructionslabel")}</label>
               <div class="col-sm-10">
                  <!-- Order fields are not editable-->
                  <textarea ng-if="!order.uuid" class="form-control" id="instructions" placeholder="" ng-model="order.instructions.value"></textarea>
                  <p ng-if="order.uuid" class="form-control-static" >{{order.instructions.value}}</p>
               </div>
            </div>
            <div class="form-group row required">
               <label for="history" class="col-sm-2 col-form-label control-label">${ui.message("labtrackingapp.clinicalhistorylabel")}</label>
               <div class="col-sm-10">
                  <textarea type="text" class="form-control" id="history" placeholder="" ng-model="order.clinicalHistoryForSpecimen.value"></textarea>
               </div>
            </div>
            <div class="form-group row">
               <label class="control-label col-sm-2">${ui.message("labtrackingapp.orderdetails.specimandetailslabel")}</label>
               <div class="col-sm-9">
                  <div class="form-group" ng-repeat="a in concepts.specimenDetails">
                     <label class="control-label col-sm-1">{{${'$'}index+1 }}.</label>
                     <div class="col-sm-11">
                        <input type="text" class="form-control" ng-model="order.specimenDetails[${'$'}index].value"></input>
                     </div>
                  </div>
               </div>
            </div>
            <div class="form-group row">
               <label class="control-label col-sm-3">${ui.message("labtrackingapp.orderdetails.immunohistochemistryNeeded")}</label>
               <div class="col-sm-9">
                  <div class="btn-group btn-toggle">
                     <button class="btn btn-lg btn-default" ng-class="{'btn-danger': order.immunohistochemistryNeeded.value=='3cd6f600-26fe-102b-80cb-0017a47871b2'}" ng-click="order.immunohistochemistryNeeded.value='3cd6f600-26fe-102b-80cb-0017a47871b2'">${ui.message("uicommons.yes")}</button>
                     <button class="btn btn-lg btn-default" ng-class="{'btn-primary': order.immunohistochemistryNeeded.value=='3cd6f86c-26fe-102b-80cb-0017a47871b2'}" ng-click="order.immunohistochemistryNeeded.value='3cd6f86c-26fe-102b-80cb-0017a47871b2'">${ui.message("uicommons.no")}</button>
                  </div>
               </div>
            </div>
            <div class="pull-right">
               <button id="cancelB" type="button" class="btn btn-default cancel" ng-click="handleCancelOrder()">${ui.message("uicommons.cancel")}</button>
               <button class="btn btn-success" ng-click="handleSaveOrder()" ng-disabled="!readyToSubmit()" >${ui.message("uicommons.save")}</button>
            </div>
         </form>
         <div class="row" ng-if="error">
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
   <script type="text/ng-template" id="loadingModal.html">
   <div class="modal-header">
      <h3 class="modal-title" id="loading-title">${ui.message("labtrackingapp.loadingtitle")}</h3>
   </div>
   <div class="modal-body" id="loading-body">
      <img class="center-block"  src="${ ui.resourceLink("uicommons", "images/spinner.gif") }" />
   </div>
   </script>
   <h1 ng-if="error">Debug info</h1>
   <pre ng-if="error">debugInfo={{debugInfo | json }}</pre>
   <pre ng-if="error">{{order | json }}</pre>
</div>
<script type="text/javascript">
   angular.module('labTrackingApp')
      .value('returnUrl', '${ returnUrl }')
      .value('patientUuid', '${ patient.uuid }')
      .value('visitUuid', '${ visit.uuid }')
      .value('orderUuid', '${ orderUuid }')
      .value('visitStartDateTime', '${ visit ? visitStartDateTime : '' }')
      .value('visitStopDateTime', '${ visit && visit.stopDatetime ? visitEndDateTime : '' }')
      .value('serverDatetime', '${ serverDatetime }')
      .value('locationUuid', '${ location.uuid }');

   jq(function () {
       // make sure we reload the page if the location is changes; this custom event is emitted by by the location selector in the header
       jq(document).on('sessionLocationChanged', function () {
           window.location.reload();
       });
   });
</script>
