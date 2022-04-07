${ ui.includeFragment("labtrackingapp", "libs") }
<%
   ui.decorateWith("appui", "standardEmrPage", [ includeBootstrap: false ])
   ui.includeJavascript("labtrackingapp", "components/LabTrackingViewQueueController.js")
   ui.includeJavascript("labtrackingapp", "app_view_queue.js")

   def middleLabel = patient ? ui.format(patient.familyName + ", " + patient.givenName):  ui.message("labtrackingapp.title")
   def middleUrl   = patient ? ui.pageLink("coreapps", "clinicianfacing/patient", [patientId: patient.id]) : ""
   def endCrumb= patient ? ",{label: '" + ui.message("labtrackingapp.title") + "'}":""

%>
<script type="text/javascript" xmlns="http://www.w3.org/1999/html">
   var breadcrumbs = [
       {icon: "icon-home", link: '/' + OPENMRS_CONTEXT_PATH + '/index.htm'},
       {label: "${middleLabel}", link: "${ middleUrl }"}
       ${endCrumb}
   ];
</script>
${patient?ui.includeFragment("coreapps", "patientHeader", [ patient: patient ]) : '' }
<div class="container" ng-app="labTrackingApp" ng-controller="viewQueueController">
   <div class="panel panel-primary" id="monitor_box">
      <div class="panel-heading">${ui.message("labtrackingapp.listpage.panelheading")}</div>
      <div class="panel-body">
         <div class="row">
            <div class="col-md-4">
               <label for="status">${ui.message("labtrackingapp.listpage.status")}:</label>
               <select class="form-control" id="status" ng-model="filter.status" ng-change="handleFilterChange('status')"
                  ng-options="item as item.translatedLabel for item in statusCodes track by item.value">
               </select>
            </div>
            <div class="col-md-4">
               <label for="from_date">${ui.message("labtrackingapp.listpage.from")}:</label>
               <div class='input-group date' id='from_date'>
                  <input type="text" class="form-control" uib-datepicker-popup="{{filter.date_box.format}}" ng-model="filter.from_date.value" is-open="filter.from_date.opened"
                     datepicker-options="filter.date_box.options"  ng-change="handleFilterChange('to_date')"
                     ng-required="false" close-text="Close" alt-input-formats="filter.date_box.altInputFormats" />
                  <span class="input-group-btn">
                  <button type="button" class="btn btn-default" ng-click="handleFromDate()"><i class="glyphicon glyphicon-calendar"></i></button>
                  </span>
               </div>
            </div>
            <div class="col-md-4">
               <label for="to_date">${ui.message("labtrackingapp.listpage.to")}:</label>
               <div class='input-group date' id='to_date'>
                  <input type="text" class="form-control" uib-datepicker-popup="{{filter.date_box.format}}" ng-model="filter.to_date.value" is-open="filter.to_date.opened"
                     datepicker-options="filter.date_box.options" ng-change="handleFilterChange('from_date')"
                     ng-required="false" close-text="Close" alt-input-formats="filter.date_box.altInputFormats" />
                  <span class="input-group-btn">
                  <button type="button" class="btn btn-default" ng-click="handleToDate()"><i class="glyphicon glyphicon-calendar"></i></button>
                  </span>
               </div>
            </div>
         </div>

         <div class="row top-buffer" ng-show="patientUuid==null">
            <div class="col-md-3 text-left">
               <label>
                  <input id="suspectedCancer-search" type="checkbox" ng-change="handleFilterChange('suspectedCancer')" ng-model="filter.suspectedCancer"/>
                  ${ui.message("labtrackingapp.orderdetails.suspectedCancer")}
               </label>
            </div>
            <div class="col-md-2 text-left">
               <label>
                  <input id="urgentReview-search" type="checkbox" ng-change="handleFilterChange('urgentReview')" ng-model="filter.urgentReview"/>
                  ${ui.message("labtrackingapp.orderdetails.urgentreviewlabel")}
               </label>
            </div>
            <div class="col-md-2 text-right">${ui.message("labtrackingapp.listpage.search")}</div>
            <div class="col-md-5">
               <div class='input-group' id='search'>
                  <input  id="patient-search" type='text' class="form-control" ng-model="filter.patient.name" ng-keypress="handleSearchChange(${'$'}event)" placeholder="${ui.message("labtrackingapp.findPatient.search.placeholder")}" autofocus />
                  <span role="button" class="input-group-addon" ng-click="filter.patient.name=null;handleFilterChange('patient')">
                     <span class="glyphicon glyphicon-remove"></span>
                  </span>
               </div>
            </div>
         </div>

         <div class="row top-buffer" ng-show="patientUuid==null">

         </div>
         <div class="top-buffer">
            <table id="example" class="table display" cellspacing="0" width="100%">
               <thead>
                  <tr>
                     <th ng-show="patientUuid==null">${ui.message("labtrackingapp.listpage.patient")}</th>
                     <th ng-show="patientUuid==null">${ui.message("labtrackingapp.listpage.name")}</th>
                     <th>${ui.message("labtrackingapp.accessionNumber")}</th>
                     <th>${ui.message("labtrackingapp.listpage.status")}</th>
                     <th>${ui.message("labtrackingapp.listpage.requestdate")}</th>
                     <th>${ui.message("labtrackingapp.listpage.processingDate")}</th>
                     <th>${ui.message("labtrackingapp.listpage.resultdate")}</th>
                     <th>${ui.message("labtrackingapp.listpage.actions")}</th>
                  </tr>
               </thead>
               <tbody  ng-if="!data_loading">
                  <tr ng-repeat="a in testOrderQueue" >
                     <td ng-show="patientUuid==null"><a href="/${ ui.contextPath() }/coreapps/clinicianfacing/patient.page?patientId={{ a.patient.value }}">{{a.patient.id}}</a></td>
                     <td  ng-show="patientUuid==null"><a href="/${ ui.contextPath() }/coreapps/clinicianfacing/patient.page?patientId={{ a.patient.value }}">{{a.patient.name}}</a></td>
                     <td>{{a.accessionNumber.value}}</td>
                     <td> {{ translateStatusCode(a.status.label) }}</td>
                     <td class="text-center small">
                        <a role="button" ng-class="{ 'no-link': !canEdit() }" ng-click="canEdit() && a.visit.value && handleDetails(a, 'request')">
                           <span ng-if="a.urgentReview.value" class="glyphicon glyphicon-exclamation-sign urgent-icon" title="Requires urgent review!"></span>
                           <span ng-if="a.sampleDate.value!=null">{{a.sampleDate.value | date : dateFormat }}</span>
                        </a>
                     </td>
                     <td class="text-center small">
                        <a role="button" ng-class="{ 'no-link': !canEdit() }" ng-click="canEdit() && handleDetails(a, 'specimen')"><span title="Enter a value" ng-if="canEdit() && a.processedDate.value==null"><i class="glyphicon glyphicon-edit" aria-hidden="true"></i> ${ui.message("labtrackingapp.listpage.enter")}</span><span ng-if="a.processedDate.value!=null">{{a.processedDate.value | date : dateFormat }}</span></a>
                     </td>
                     <td class="text-center small"><span role="button" ng-show="a.file.url!=null" ng-click="downloadPdf(a)" title="Download"><i class="glyphicon glyphicon-download" aria-hidden="true"></i></span>
                         <a role="button" ng-class="{ 'no-link': !canEdit() }" ng-click="canEdit() && handleDetails(a, 'results')">
                            <span title="Enter a value" ng-if="canEdit() && a.processedDate.value!=null && a.resultDate.value==null"><i class="glyphicon glyphicon-edit" aria-hidden="true"></i> ${ui.message("labtrackingapp.listpage.enter")}</span>
                            <span ng-if="a.resultDate.value!=null">{{a.resultDate.value | date : dateFormat}}</span>
                         </a>
                      </td>
                     <td>
                            <button title="{{a.orderNumber.value}}" class="btn btn-xs btn-primary" ng-click="handleDetails(a, 'readonly')">${ui.message("labtrackingapp.listpage.details")}</button>
                            <button class="btn btn-xs" ng-click="handlePrint(a)" >${ui.message("uicommons.print")}</button>
                            <button ng-if="canEdit() && a.canceled==false && a.resultDate.value == null" class="btn btn-xs" data-toggle="modal" data-target="#cancelOrderDialog" ng-click="showCancelOrder(a)">${ui.message("uicommons.cancel")}</button>
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
         <div class="row" ng-if="data_loading">
            <div class="col-sm-offset-4 col-sm-8">${ui.message("labtrackingapp.listpage.pleasewait")} <img src="${ ui.resourceLink("uicommons", "images/spinner.gif") }" /></div>
         </div>
         <div class="row">
            <div class="col-sm-6">  <br/>
               <label for="paging">Showing {{filter.paging.currentEntryStart}} to {{filter.paging.currentEntryEnd}} of {{filter.paging.totalItems}} entries</label>
            </div>
            <div class="col-sm-6 text-right">
               <ul id="paging" uib-pagination total-items="filter.paging.totalItems" ng-model="filter.paging.currentPage" max-size="filter.paging.maxSize" ng-change="pageChanged()"
                  class="pagination-sm" boundary-link-numbers="true"></ul>
            </div>
         </div>
         <div class="row" ng-if="errorMessage && !data_loading">
            <div class="col-sm-12">
               <div class="alert alert-danger" ng-if="error"><strong>There was an error loading the test orders</strong> - {{error}}</div>
            </div>
         </div>
      </div>
   </div>
   <div id="cancelOrderDialog" class="modal fade" role="dialog">
      <div class="modal-dialog">
         <!-- Modal content-->
         <div class="modal-content">
            <div class="modal-header">
               <button type="button" class="close" data-dismiss="modal">&times;</button>
               <h4 class="modal-title">Order #{{selectedOrder.orderNumber.value}} - {{selectedOrder.patient.name}}</h4>
            </div>
            <div class="modal-body">
               <p ng-show="is_cancel">${ui.message("labtrackingapp.listpage.ordercancelreasonprompt")}</p>
               <p ng-show="is_purge">${ui.message("labtrackingapp.listpage.orderpurgereasonprompt")}</p>
            </div>
            <div class="modal-footer">
               <button type="button" class="btn btn-default" data-dismiss="modal" ng-click="handleCancelOrder()">${ui.message("uicommons.yes")}</button>
               <button type="button" class="btn btn-default" data-dismiss="modal" ng-click="dismissCancelOrder()">${ui.message("uicommons.no")}</button>
            </div>
         </div>
      </div>
   </div>
</div>
${ ui.includeFragment("labtrackingapp", "translations") }
<script type="text/javascript">
   angular.module('labTrackingApp')
   .value('patientUuid', '${ patient?.uuid }')
   .value('locationUuid', '${ location.uuid }')
   .value('returnUrl', '${ returnUrl }')
           .value('translations', translations);

   jq(function () {
       // make sure we reload the page if the location is changes; this custom event is emitted by by the location selector in the header
       jq(document).on('sessionLocationChanged', function () {
           window.location.reload();
       });
   });
</script>
