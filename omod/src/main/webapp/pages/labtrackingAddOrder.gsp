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


    ui.includeJavascript("labtrackingapp", "components/LabTrackingViewQueueController.js")
    ui.includeJavascript("labtrackingapp", "app.js")


%>

<script type="text/javascript" xmlns="http://www.w3.org/1999/html">
    var breadcrumbs = [
        {icon: "icon-home", link: '/' + OPENMRS_CONTEXT_PATH + '/index.htm'},
        {
            label: "${ ui.message("labtrackingapp.title") }", link: "${ ui.pageLink("labtrackingapp", "labtrackingViewQueue?appId=edtriageapp.app.triageQueue") }"
        }

    ];
</script>

<style>

</style>


<div class="container" ng-app="labTrackingApp" ng-controller="viewQueueController">

        <div class="panel panel-primary" id="order_box">
          <div class="panel-heading">Order a new test</div>
          <div class="panel-body">
            <form>
              <div class="form-group row">
                <label class="col-sm-2 col-form-label">Pre-Lab Diagnosis</label>
                <div class="col-sm-10">
                  <input type="text" class="form-control" id="diagnosis" placeholder="">
                </div>
              </div>
              <div class="form-group row">
                <label for="site" class="col-sm-2 col-form-label">Procedure/Site</label>
                <div class="col-sm-10">
                  <select class="form-control" id="site">
                    <option>CNB</option>
                    <option>ABC</option>
                    <option>DEF</option>
                  </select>
                </div>
              </div>
              <div class="form-group row">
                <label for="instructions" class="col-sm-2 col-form-label">Instructions</label>
                <div class="col-sm-10">
                  <textarea class="form-control" id="instructions" placeholder=""></textarea>
                </div>
              </div>
              <div class="form-group row">
                <label for="history" class="col-sm-2 col-form-label">Clinical History</label>
                <div class="col-sm-10">
                  <textarea type="text" class="form-control" id="history" placeholder=""></textarea>
                </div>
              </div>
              <div class="pull-right">
                <button class="btn btn-default cancel">Cancel</button>
                <button class="btn btn-success" onclick="handleSaveOrder()">Save</button>
              </div>
            </form>
          </div>
        </div>

${ ui.includeFragment("edtriageapp", "translations") }

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
