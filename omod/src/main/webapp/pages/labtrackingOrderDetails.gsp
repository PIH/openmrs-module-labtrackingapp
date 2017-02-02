${ ui.includeFragment("labtrackingapp", "libs") }
<%
    ui.decorateWith("appui", "standardEmrPage")
    ui.includeJavascript("labtrackingapp", "components/LabTrackingOrderDetailsController.js")
    ui.includeJavascript("labtrackingapp", "app_order_details.js")
%>

<script type="text/javascript" xmlns="http://www.w3.org/1999/html">
    var breadcrumbs = [
        {icon: "icon-home", link: '/' + OPENMRS_CONTEXT_PATH + '/index.htm'},
        {
            label: "${ ui.message("labtrackingapp.title") }", link: "${ ui.pageLink("labtrackingapp", "labtrackingViewQueue") }"
        },
        {label: "${ ui.message("labtrackingapp.orderdetails.title") }", link: ""}
    ];
</script>

${ ui.includeFragment("coreapps", "patientHeader", [ patient: patient ]) }

<div class="container" ng-app="labTrackingApp" ng-controller="orderDetailsController">
      <div class="panel-group" ng-if="data_loading == false">
        <order-debug-panel order="order" ng-show="debug"></order-debug-panel>
        <order-details-panel order="order"></order-details-panel>
        <order-specimen-panel ng-if="pageType=='specimen'" order="order" locations="locations" providers="providers" procedures="procedures"
            diagnoses="diagnoses" concepts="concepts"></order-specimen-panel>
        <order-results-panel ng-if="pageType=='results'" order="order"></order-results-panel>
        <order-read-only-panel ng-if="pageType=='readonly'" order="order" concepts="concepts"></order-results-panel>
      </div>

    <div class="row" ng-if="data_loading == false">
        <div class="col-sm-12 text-right">
            <button type="button" class="btn btn-default" ng-click="returnToList()">${ui.message("labtrackingapp.returnToListPage")}</button>
            <button ng-if="pageType != 'readonly' && pageType != 'results'"type="button" class="btn btn-default" data-toggle="modal" data-target="#cancelOrderDialog" >${ui.message("labtrackingapp.cancelOrder")}</button>
            <button ng-if="pageType != 'results'" type="button" class="btn btn-default" ng-click="printOrder()">${ui.message("uicommons.print")}</button>
            <button type="button" class="btn btn-primary" ng-click="saveSpecimenDetails()">${ui.message("uicommons.save")}</button>
        </div>
    </div>

     <div class="row" ng-if="data_loading">
        <div class="col-sm-offset-4 col-sm-8">${ui.message("labtrackingapp.loading")} <img src="${ ui.resourceLink("uicommons", "images/spinner.gif") }" /></div>
     </div>
    <script type="text/ng-template" id="saveSpecimenDetails.html">
        <div class="modal-header">
            <h3 class="modal-title" id="modal-title">${ui.message("labtrackingapp.savingtitle")}</h3>
        </div>
        <div class="modal-body" id="modal-body">
            <img class="center-block"  src="${ ui.resourceLink("uicommons", "images/spinner.gif") }" />
        </div>
    </script>

      <div id="cancelOrderDialog" class="modal fade" role="dialog">
        <div class="modal-dialog">

          <!-- Modal content-->
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal">&times;</button>
              <h4 class="modal-title">Order #{{order.orderNumber.value}} - {{order.patient.name}}</h4>
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
            .value('returnUrl', '${ returnUrl }')
            .value('orderUuid', '${ orderUuid }')
            .value('pageType', '${ pageType }')
			.value('patientUuid', '${ patient.uuid }')
			.value('locationUuid', '${ location.uuid }')
            .value('translations', translations);

    jq(function () {
        // make sure we reload the page if the location is changes; this custom event is emitted by by the location selector in the header
        jq(document).on('sessionLocationChanged', function () {
            window.location.reload();
        });
    });
</script>


