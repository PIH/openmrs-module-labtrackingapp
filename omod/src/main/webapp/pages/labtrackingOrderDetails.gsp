<%
    ui.decorateWith("appui", "standardEmrPage")

    ui.includeJavascript("uicommons", "angular.min.js")
    ui.includeJavascript("uicommons", "angular-ui/ui-bootstrap-tpls-0.13.0.js")
    ui.includeJavascript("uicommons", "angular-ui/angular-ui-router.min.js")
    ui.includeJavascript("uicommons", "ngDialog/ngDialog.min.js")
    ui.includeJavascript("uicommons", "angular-resource.min.js")
    ui.includeJavascript("uicommons", "angular-common.js")
    ui.includeJavascript("uicommons", "angular-app.js")
    ui.includeJavascript("uicommons", "angular-translate.min.js")
    ui.includeJavascript("uicommons", "angular-translate-loader-url.min.js")
    ui.includeJavascript("uicommons", "services/conceptService.js")
    ui.includeJavascript("uicommons", "directives/coded-or-free-text-answer.js")
    ui.includeJavascript("uicommons", "services/session.js")
    ui.includeJavascript("uicommons", "filters/serverDate.js")

    ui.includeCss("uicommons", "ngDialog/ngDialog.min.css")
    ui.includeCss("labtrackingapp", "labtrackingapp.css")

    ui.includeJavascript("uicommons", "model/user-model.js")
    ui.includeJavascript("uicommons", "model/encounter-model.js")

    ui.includeJavascript("labtrackingapp", "bootstrap.min.js")
    ui.includeJavascript("labtrackingapp", "components/LabTrackingDataService.js")
    ui.includeJavascript("labtrackingapp", "components/EncounterFactory.js")
    ui.includeJavascript("labtrackingapp", "components/LabTrackingOrderFactory.js")

    ui.includeJavascript("labtrackingapp", "components/LabTrackingOrderDetailsController.js")
    ui.includeJavascript("labtrackingapp", "app_order_details.js")
%>

<script type="text/javascript" xmlns="http://www.w3.org/1999/html">
    var breadcrumbs = [
        {icon: "icon-home", link: '/' + OPENMRS_CONTEXT_PATH + '/index.htm'},
        {
            label: "${ ui.message("labtrackingapp.title") }", link: "${ ui.pageLink("labtrackingapp", "labtrackingViewQueue?appId=labtrackingapp.app.viewQueue") }"
        }

    ];
</script>

<div class="container" ng-app="labTrackingApp" ng-controller="orderDetailsController">
  <div class="panel panel-primary" id="details_box">
    <div class="panel-heading">${ui.message("labtrackingapp.orderdetailstitle")} Patient ABC123</div>
    <div class="panel-body">
      <div class="panel-group">
        <order-details-panel order="order"></order-details-panel>
        <order-specimen-panel order="order"></order-specimen-panel>
        <order-results-panel order="order"></order-results-panel>
        <order-debug-panel order="order"></order-debug-panel>
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
            .value('orderUuid', '${ orderUuid }')
            .value('translations', translations);

    jq(function () {
        // make sure we reload the page if the location is changes; this custom event is emitted by by the location selector in the header
        jq(document).on('sessionLocationChanged', function () {
            window.location.reload();
        });
    });
</script>
