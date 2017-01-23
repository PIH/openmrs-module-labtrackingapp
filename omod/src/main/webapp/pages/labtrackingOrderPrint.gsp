
<%
    ui.decorateWith("appui", "standardEmrPage")
    ui.includeFragment("labtrackingapp", "libs")
    ui.includeJavascript("labtrackingapp", "components/LabTrackingPrintController.js")
    ui.includeJavascript("labtrackingapp", "app_order_print.js")
%>


<div class="container" ng-app="labTrackingApp" ng-controller="printController">
    <div class="row">
        <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderNumberLabel")}</label>
        <div class="col-sm-9">
            <p class="form-control-static" >{{order.orderNumber.value}}</p>
        </div>
    </div>
    <div class="row">
        <label class="control-label form-control-static text-right col-sm-3">Patient Information:</label>
        <div class="col-sm-9">
            <p class="form-control-static">
                {{order.patient.name}} <br/>

            <span class="gender-age">
                <span>${ui.message("coreapps.gender." + ui.encodeHtml(patient.gender))}&nbsp;</span>
                <span>
                <% if (patient.birthdate) { %>
                <% if (patient.age > 0) { %>
                    ${ui.message("coreapps.ageYears", patient.age)}
                <% } else if (patient.ageInMonths > 0) { %>
                    ${ui.message("coreapps.ageMonths", patient.ageInMonths)}
                <% } else { %>
                    ${ui.message("coreapps.ageDays", patient.ageInDays)}
                <% } %>
                (<% if (patient.birthdateEstimated) { %>~<% } %>${ ui.formatDatePretty(patient.birthdate) })
                <% } else { %>
                    ${ui.message("coreapps.unknownAge")}
                <% } %>
                </span>
            </span>


               </p>
        </div>
    </div>
    <div class="row">
        <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.clinicalhistorylabel")}</label>
        <div class="col-sm-9">
            <p class="form-control-static" >{{order.clinicalHistoryForSpecimen.value}}</p>
        </div>
    </div>
    <div class="row">
        <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.proceduresitelabel")}</label>
        <div class="col-sm-9">
            <p class="form-control-static" ng-repeat="a in order.proceduresForSpecimen | orderBy:'label'" >{{a.label}}</p>
            <p ng-if="order.procedureNonCodedForSpecimen.value" class="form-control-static">{{order.procedureNonCodedForSpecimen.value}}</p>
        </div>
    </div>
    <div class="row">
        <label class="control-label form-control-static text-right col-sm-3">Date Of procedure</label>
        <div class="col-sm-9">
            <p class="form-control-static">{{order.sampleDate.value | date : 'shortDate'}}</p>
        </div>
    </div>
    <div class="row">
        <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.locationlabel")}</label>
        <div class="col-sm-9">
            <p class="form-control-static" >{{order.locationWhereSpecimenCollected.label}}</p>
        </div>
    </div>
    <div class="row">
        <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.preoathologydiagnosislabel")}</label>
        <div class="col-sm-9">
            <p class="form-control-static" >{{order.preLabDiagnosis.label}}</p>
        </div>
    </div>
    <div class="row">
        <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.postopdiagnosislabel")}</label>
        <div class="col-sm-9">
            <p class="form-control-static" >{{order.postopDiagnosis.diagnosis.label}}</p>
        </div>
    <div class="row">
        <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.noteslabel")}</label>
        <div class="col-sm-9">
            <p class="form-control-static" >{{order.notes.value}}</p>
        </div>
    </div>
    <div class="row">
        <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.specimandetailslabel")}</label>
        <div class="col-sm-9">
            <div class="form-group" ng-repeat="a in concepts.specimenDetails">
                <label class="control-label col-sm-1">{{${'$'}index+1 }}.</label>
                <div class="col-sm-11">
                    <p class="form-control-static" >{{order.specimenDetails[${'$'}index].value}}</p>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.attendingsurgeonlabel")}</label>
        <div class="col-sm-9">
            <p class="form-control-static" >{{order.surgeon.label}}</p>
        </div>
    </div>
    <div class="row">
        <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.residentlabel")}</label>
        <div class="col-sm-9">
            <p class="form-control-static" >{{order.resident.label}}</p>
        </div>
    </div>
    <div class="row">
        <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.urgentreviewlabel")}</label>
        <div class="col-sm-9">
            <p class="form-control-static" >{{order.urgentReview.value == "3cd6f600-26fe-102b-80cb-0017a47871b2"?"${ui.message("uicommons.yes")}":"${ui.message("uicommons.yes")}"}}</p>
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