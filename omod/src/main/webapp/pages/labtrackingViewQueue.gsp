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
            label: "${ ui.message("labtrackingapp.test") }", link: "${ ui.pageLink("labtrackingapp", "labtrackingViewQueue?appId=edtriageapp.app.triageQueue") }"
        }

    ];
</script>

<div class="container" ng-app="labTrackingApp" ng-controller="viewQueueController">
   <div class="panel panel-primary" id="monitor_box">
      <div class="panel-heading">Test Monitor Page</div>
      <div class="panel-body">
         <div class="row">
            <div class="col-md-4">
               <label for="status">Status:</label>
               <select class="form-control" id="status" ng-model="filter.status.value" ng-change="handleFilterChange('status')">
                  <option>All</option>
                  <option>Requested</option>
                  <option>Reported</option>
                  <option>Taken</option>
               </select>
            </div>
            <div class="col-md-4">
               <label for="from_date">to:</label>
               <div class='input-group date' id='from_date'>
                  <input type="text" class="form-control" uib-datepicker-popup="{{filter.date_box.format}}" ng-model="filter.from_date.value" is-open="filter.from_date.opened"
                     datepicker-options="filter.date_box.options"  ng-change="handleFilterChange('to_date')"
                     ng-required="true" close-text="Close" alt-input-formats="filter.date_box.altInputFormats" />
                  <span class="input-group-btn">
                  <button type="button" class="btn btn-default" ng-click="handleFromDate()"><i class="glyphicon glyphicon-calendar"></i></button>
                  </span>
               </div>
            </div>
            <div class="col-md-4">
               <label for="to_date">to:</label>
               <div class='input-group date' id='to_date'>
                  <input type="text" class="form-control" uib-datepicker-popup="{{filter.date_box.format}}" ng-model="filter.to_date.value" is-open="filter.to_date.opened"
                     datepicker-options="filter.date_box.options" ng-change="handleFilterChange('from_date')"
                     ng-required="true" close-text="Close" alt-input-formats="filter.date_box.altInputFormats" />
                  <span class="input-group-btn">
                  <button type="button" class="btn btn-default" ng-click="handleToDate()"><i class="glyphicon glyphicon-calendar"></i></button>
                  </span>
               </div>
            </div>
         </div>
         <div class="row top-buffer">
            <div class="col-md-3">Search for patient</div>
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
                     <th>Patient ID</th>
                     <th>Name</th>
                     <th>Status</th>
                     <th>Request Date</th>
                     <th>Sample Date</th>
                     <th>Result Date</th>
                     <th>Actions</th>
                  </tr>
               </thead>
               <tbody  ng-if="!data_loading">
                  <tr ng-repeat="a in testOrderQueue | testOrderFilter:filter | orderBy:a.requestDate.value" >
                     <td>{{a.patient.id}}</td>
                     <td>{{a.patient.name}}</td>
                     <td>{{a.status.display}}</td>
                     <td>{{a.requestDate.value | date : 'shortDate'}}</td>
                     <td>{{a.sampleDate.value | date : 'shortDate'}}</td>
                     <td>{{a.resultDate.value | date : 'shortDate'}}</td>
                     <td>
                        <button class="btn btn-sm btn-primary" ng-click="handleDetails(a)">details</button>
                        <button class="btn btn-sm" ng-click="handlePrint(a)" >print</button>
                        <button class="btn btn-sm" data-toggle="modal" data-target="#cancelOrderDialog" ng-click="showCancelOrder(a)">cancel</button>
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>

         <div class="row" ng-if="data_loading">
           <div class="col-sm-offset-4 col-sm-8">${ui.message("labtrackingapp.listpage.pleasewait")} <img src="${ ui.resourceLink("uicommons", "images/spinner.gif") }" /></div>
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
           <h4 class="modal-title">Order #{{selectedOrder.orderNumber.value}} for {{selectedOrder.patient.name}}</h4>
         </div>
         <div class="modal-body">
           <p>Please provide a reason for canceling the order</p>
           <textarea ng-model="orderCancelReason" class="form-control"></textarea>
         </div>
         <div class="modal-footer">
           <button type="button" class="btn btn-default" data-dismiss="modal" ng-click="handleCancelOrder()" ng-disabled="orderCancelReason==null || orderCancelReason.length==0">OK</button>
           <button type="button" class="btn btn-default" data-dismiss="modal" ng-click="dismissCancelOrder()">Cancel</button>
         </div>
       </div>

     </div>
   </div>

</div>


${ ui.includeFragment("labtrackingapp", "translations") }

<script type="text/javascript">
    angular.module('labTrackingApp')
            .value('patientDashboard', '')
            .value('serverDateTimeInMillis', '')
            .value('locationUuid', '')
            .value('translations', translations);

    jq(function () {
        // make sure we reload the page if the location is changes; this custom event is emitted by by the location selector in the header
        jq(document).on('sessionLocationChanged', function () {
            window.location.reload();
        });
    });
</script>
