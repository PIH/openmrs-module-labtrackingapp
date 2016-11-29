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
            label: "${ ui.message("labtrackingapp.title") }", link: "${ ui.pageLink("labtrackingapp", "labtrackingViewQueue?appId=labtrackingapp.app.viewQueue") }"
        }

    ];
</script>

<style>

</style>


<div class="container" ng-app="labTrackingApp" ng-controller="viewQueueController">



        <div class="panel panel-primary" id="details_box">
          <div class="panel-heading">Test Details for Patient ABC123</div>
          <div class="panel-body">
            <div class="panel-group">
              <div class="panel panel-default">
                <div class="panel-heading">
                  <h4 class="panel-title">
                    <a data-toggle="collapse" href="#order_panel">Order details</a>
                  </h4>
                </div>
                <div id="order_panel" class="panel-collapse collapse">
                  <div class="panel-body">
                    <form class="form-horizontal">
                      <div class="form-group">
                        <label class="control-label col-sm-2">Date of Initial Consult</label>
                        <div class="col-sm-10">
                          <p class="form-control-static"> 8-Nov-2014</p>
                        </div>
                      </div>
                    </form>
                    <div class="form-group">
                      <label class="control-label col-sm-2">Procedure site</label>
                      <div class="col-sm-10">
                        <p class="form-control-static"> CNB</p>
                      </div>
                    </div>
                    </form>
                  </div>
                </div>
              </div>
              <div class="panel panel-default">
                <div class="panel-heading">
                  <h4 class="panel-title">
                    <a data-toggle="collapse" href="#specimen">Pathology Specimen details</a>
                  </h4>
                </div>
                <div id="specimen" class="panel-collapse collapse">
                  <div class="panel-body">

                    <form class="form-horizontal">
                      <div class="form-group">
                        <label class="control-label col-sm-2" for="date_of_sample">Sample Date</label>
                        <div class="col-sm-10">
                          <div class='input-group date'>
                            <input type='text' class="form-control" id="date_of_sample" value="8-Nov-2014"/>
                            <span class="input-group-addon">
                             <span class="glyphicon glyphicon-calendar"></span>
                          </span>
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <label class="control-label col-sm-2" for="proc_location">Location where procedure performed</label>
                        <div class="col-sm-10">
                          <div class='input-group date'>
                            <select type='text' class="form-control" id="proc_location" >
                              <option>Mirebalais Hospital</option>
                              <option>Another Hospital</option>
                              </select>
                          </span>
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <label class="control-label col-sm-2" for="atttending_surgeon">Attending surgeon</label>
                        <div class="col-sm-10">
                          <div class='input-group date'>
                            <select type='text' class="form-control" id="atttending_surgeon" >
                              <option>Joseph Jones</option>
                              <option>Another Dr.</option>
                            </select>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="control-label col-sm-2" ></label>
                        <div class="col-sm-10">
                          <p class="form-control-static"> more elements ...</p>
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="col-sm-offset-2 col-sm-10 pull-right">
                          <button type="button" class="btn btn-primary">Save</button>
                          <button type="button" class="btn btn-default">Cancel</button>
                        </div>
                      </div>
                    </form>
                  </div>

                </div>
              </div>

              <div class="panel panel-default">
                <div class="panel-heading">
                  <h4 class="panel-title">
                    <a data-toggle="collapse" href="#results">Result details</a>
                  </h4>
                </div>
                <div id="results" class="panel-collapse collapse">
                  <div class="panel-body">
                    <form class="form-horizontal">
                      <div class="form-group">
                        <label class="control-label col-sm-2" for="date_of_results">Results Date</label>
                        <div class="col-sm-10">
                          <div class='input-group date'>
                            <input type='text' class="form-control" id="date_of_results"  value="8-Nov-2014"/>
                            <span class="input-group-addon">
                             <span class="glyphicon glyphicon-calendar"></span>
                          </span>
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <label class="control-label col-sm-2" for="notes">Notes</label>
                        <div class="col-sm-10">
                          <div class='input-group date'>
                            <textarea class="form-control" id="notes"></textarea>
                          </div>
                        </div>
                      </div>


                      <div class="form-group">
                        <label class="control-label col-sm-2" for="upload_file">Upload file</label>
                        <div class="col-sm-10">
                          <div class='input-group date'>
                            <input type="file" class="form-control" id="upload_file" /> <a href="">file link here is exists</a>
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="col-sm-offset-2 col-sm-10 pull-right">
                          <button type="button" class="btn btn-primary">Save</button>
                          <button type="button" class="btn btn-default">Cancel</button>
                        </div>
                      </div>


                    </form>

                  </div>

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
