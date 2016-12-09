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

    ui.includeCss("uicommons", "ngDialog/ngDialog.min.css")
    ui.includeCss("labtrackingapp", "labtrackingapp.css")

    ui.includeJavascript("uicommons", "model/user-model.js")
    ui.includeJavascript("uicommons", "model/encounter-model.js")

    ui.includeJavascript("labtrackingapp", "components/LabTrackingDataService.js")
    ui.includeJavascript("labtrackingapp", "components/EncounterFactory.js")
    ui.includeJavascript("labtrackingapp", "components/LabTrackingOrderFactory.js")
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

</style>


<div class="container" ng-app="labTrackingApp" ng-controller="addOrderController">

        <div class="panel panel-primary" id="order_box">
          <div class="panel-heading">${ui.message("labtrackingapp.addorderpagetitle")}</div>
          <div class="panel-body">
            <form>
              <div class="form-group row">
                <label class="col-sm-2 col-form-label">${ui.message("labtrackingapp.prelabdiagnosislabel")}</label>
                <div class="col-sm-10">
                  <select class="form-control" id="site" ng-model="order.diagnosis.value">
                    <option ng-repeat="a in order.diagnosis.concept.answers | orderBy:a.label" ng-selected="order.diagnosis.concept.value==a.uuid"  value="{{a.uuid}}">{{a.label}}-{{a.uuid}}</option>
                  </select>

                </div>
              </div>
              <div class="form-group row">
                <label for="site" class="col-sm-2 col-form-label">${ui.message("labtrackingapp.proceduresitelabel")}</label>
                <div class="col-sm-10">
                  <select class="form-control" id="site" ng-model="order.procedure.value">
                    <option ng-repeat="a in order.procedure.concept.answers | orderBy:a.label" ng-selected="order.procedure.concept.value==a.uuid"  value="{{a.uuid}}">{{a.label}}-{{a.uuid}}</option>
                  </select>
                </div>
              </div>
              <div class="form-group row">
                <label for="instructions" class="col-sm-2 col-form-label">${ui.message("labtrackingapp.instructionslabel")}</label>
                <div class="col-sm-10">
                  <textarea class="form-control" id="instructions" placeholder=""></textarea>
                </div>
              </div>
              <div class="form-group row">
                <label for="history" class="col-sm-2 col-form-label">${ui.message("labtrackingapp.clinicalhistorylabel")}</label>
                <div class="col-sm-10">
                  <textarea type="text" class="form-control" id="history" placeholder=""></textarea>
                </div>
              </div>
              <div class="pull-right">
                <button class="btn btn-default cancel">${ui.message("uicommons.cancel")}</button>
                <button class="btn btn-success" ng-click="handleSaveOrder()">${ui.message("uicommons.save")}</button>
              </div>
            </form>
             <div class="row">
                <div class="col-sm-12">
                    <br/>
                    <div class="alert alert-danger" ng-if="error"><strong>Save failed!</strong> - {{error}}</div>
                    <div class="alert alert-success" ng-if="was_saved"><strong>The order was saved</strong></div>
                </div>
             </div>

          </div>
        </div>

        <h1 ng-if="error">Debug info</h1>
        <pre ng-if="error">debugInfo={{debugInfo | json }}</pre>

        <pre ng-if="error">{{order | json }}</pre>
</div>
${ ui.includeFragment("labtrackingapp", "translations") }

<script type="text/javascript">
    angular.module('labTrackingApp')
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
