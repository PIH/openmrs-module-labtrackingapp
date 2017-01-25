${ ui.includeFragment("labtrackingapp", "libs") }
<%
   ui.decorateWith("appui", "standardEmrPage")
   ui.includeJavascript("labtrackingapp", "components/LabTrackingViewQueueController.js")
   ui.includeJavascript("labtrackingapp", "app_view_queue.js")
   %>
<script type="text/javascript" xmlns="http://www.w3.org/1999/html">
   var breadcrumbs = [
       {icon: "icon-home", link: '/' + OPENMRS_CONTEXT_PATH + '/index.htm'},
       {
           label: "${ ui.message("labtrackingapp.title") }", link: "${ ui.pageLink("labtrackingapp", "labtrackingViewQueue?patientId=patient?.uuid") }"
       }

   ];
</script>
${
if(patient){
ui.includeFragment("coreapps", "patientHeader", [ patient: patient ])
}
else{
''
}
}
<div class="container" ng-app="labTrackingApp" ng-controller="viewQueueController">
   <div class="panel panel-primary" id="monitor_box">
      <div class="panel-heading">${ui.message("labtrackingapp.listpage.panelheading")}</div>
      <div class="panel-body">
         <div class="row">
            <div class="col-md-4">
               <label for="status">${ui.message("labtrackingapp.listpage.status")}:</label>
               <select class="form-control" id="status" ng-model="filter.status" ng-change="handleFilterChange('status')"
                  ng-options="item as item.label for item in statusCodes">
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
            <div class="col-md-3">${ui.message("labtrackingapp.listpage.search")}</div>
            <div class="col-md-9">
               <div class='input-group date' id='search'>
                  <input type='text' class="form-control" ng-model="filter.patient.name" ng-change="handleFilterChange('patient')" />
                  <span class="input-group-addon" ng-click="handleFilterChange('patient')">
                  <span class="glyphicon glyphicon-search"></span>
                  </span>
               </div>
            </div>
         </div>
         <div class="top-buffer">
            <table id="example" class="table display" cellspacing="0" width="100%">
               <thead>
                  <tr>
                     <th ng-show="patientUuid==null">${ui.message("labtrackingapp.listpage.patient")}</th>
                     <th ng-show="patientUuid==null">${ui.message("labtrackingapp.listpage.name")}</th>
                     <th>${ui.message("labtrackingapp.listpage.status")}</th>
                     <th>${ui.message("labtrackingapp.listpage.requestdate")}</th>
                     <th>${ui.message("labtrackingapp.listpage.sampledate")}</th>
                     <th>${ui.message("labtrackingapp.listpage.resultdate")}</th>
                     <th>${ui.message("labtrackingapp.listpage.actions")}</th>
                  </tr>
               </thead>
               <tbody  ng-if="!data_loading">
                  <tr ng-repeat="a in testOrderQueue" >
                     <td ng-show="patientUuid==null">{{a.patient.id}}</td>
                     <td ng-show="patientUuid==null">{{a.patient.name}}</td>
                     <td>{{a.status.label}}</td>
                     <td>{{a.requestDate.value | date : 'shortDate'}}</td>
                     <td><span ng-if="a.urgentReview.value" class="glyphicon glyphicon-exclamation-sign urgent-icon" title="Requires urgent review!"></span> {{a.sampleDate.value | date : 'shortDate'}}</td>
                     <td><span role="button" ng-show="a.file.url!=null" ng-click="downloadPdf(a)" title="Download"><i class="glyphicon glyphicon-download" aria-hidden="true"></i> </span>{{a.resultDate.value | date : 'shortDate'}}</td>
                     <td>
                        <button class="btn btn-sm btn-primary" ng-click="handleDetails(a)">${ui.message("labtrackingapp.listpage.details")}</button>
                        <button class="btn btn-sm" ng-click="handlePrint(a)" >${ui.message("uicommons.print")}</button>
                        <button ng-if="a.canceled==false" class="btn btn-sm" data-toggle="modal" data-target="#cancelOrderDialog" ng-click="showCancelOrder(a)">${ui.message("uicommons.cancel")}</button>
                        <button ng-show="a.canceled==true" class="btn btn-sm" data-toggle="modal" data-target="#cancelOrderDialog" ng-click="showCancelOrder(a, true)">${ui.message("labtrackingapp.purge")}</button>
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
               <ul id="paging" uib-pagination total-items="filter.paging.totalItems" ng-model="filter.paging.currentPage" max-size="filter.paging.maxSize" ng-change="filter.paging.pageChanged()"
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
               <p>${ui.message("labtrackingapp.listpage.ordercancelreasonprompt")}</p>
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