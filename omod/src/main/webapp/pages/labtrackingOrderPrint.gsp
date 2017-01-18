
<%
    ui.decorateWith("appui", "standardEmrPage")
    ui.includeFragment("labtrackingapp", "libs")
    ui.includeJavascript("labtrackingapp", "components/LabTrackingPrintController.js")
    ui.includeJavascript("labtrackingapp", "app_order_print.js")
%>


<div class="container" ng-app="labTrackingApp" ng-controller="printController">
    <div class="row">
        <label class="control-label form-control-static text-right col-sm-3">Date of Initial Consult</label>
        <div class="col-sm-9">
            <p class="form-control-static">{{order.requestDate.value | date : 'shortDate'}}</p>
        </div>
    </div>
    <div class="row">
        <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.proceduresitelabel")}</label>
        <div class="col-sm-9">
            <p class="form-control-static" ng-repeat="a in order.procedures | orderBy:'label'" >{{a.label}}</p>
            <p ng-if="order.procedureNonCoded.value" class="form-control-static">{{order.procedureNonCoded.value}}</p>
        </div>
    </div>
    <div class="row">
        <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.preoathologydiagnosislabel")}</label>
        <div class="col-sm-9">
            <p class="form-control-static" >{{order.preLabDiagnosis.label}}</p>
        </div>
    </div>
    <div class="row">
        <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.instructionslabel")}</label>
        <div class="col-sm-9">
            <p class="form-control-static" >{{order.instructions.value}}</p>
        </div>
    </div>
    <div class="row">
        <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.clinicalhistorylabel")}</label>
        <div class="col-sm-9">
            <p class="form-control-static" >{{order.clinicalHistory.value}}</p>
        </div>
    </div>
</div>

<script type="text/javascript">
    angular.module('labTrackingApp')
            .value('orderUuid', '${ orderUuid }');

    jq(function () {
        // make sure we reload the page if the location is changes; this custom event is emitted by by the location selector in the header
        jq(document).on('sessionLocationChanged', function () {
            window.location.reload();
        });
    });
</script>