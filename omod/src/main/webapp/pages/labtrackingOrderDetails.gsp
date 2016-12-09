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

    ui.includeJavascript("labtrackingapp", "bootstrap.min.js")
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

<style>

</style>


<div class="container" ng-app="labTrackingApp" ng-controller="orderDetailsController">
        <div class=row>
              <div class="col-sm-12">
        <date-with-popup ng-model="foo" />
              </div>
        </div>

        <div class="panel panel-primary" id="details_box">
          <div class="panel-heading">${ui.message("labtrackingapp.orderdetailstitle")} Patient ABC123</div>
          <div class="panel-body">
            <div class="panel-group">
              <div class="panel panel-default">
                <div class="panel-heading">
                  <h4 class="panel-title">
                    <a data-toggle="collapse" href="#order_panel">${ui.message("labtrackingapp.orderdetailslabel")}</a>
                  </h4>
                </div>
                <div id="order_panel" class="panel-collapse collapse">
                  <div class="panel-body">
                    <form class="form-horizontal">
                      <div class="form-group">
                        <label class="control-label col-sm-3">Date of Initial Consult</label>
                        <div class="col-sm-9">
                          <p class="form-control-static"> 8-Nov-2014</p>
                        </div>
                      </div>
                    </form>
                    <div class="form-group">
                      <label class="control-label col-sm-3">Procedure site</label>
                      <div class="col-sm-9">
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
                    <a data-toggle="collapse" href="#specimen">${ui.message("labtrackingapp.pathologyspecimendetailslabel")}</a>
                  </h4>
                </div>
                <div id="specimen" class="panel-collapse">
                  <div class="panel-body">

                    <form class="form-horizontal">

                        <div class="form-group">
                            <label class="control-label col-sm-3" for="date_of_sample">${ui.message("labtrackingapp.orderdetails.sampledatelabel")}</label>
                          <div class="col-md-6">

                          </div>

                      <div class="form-group">
                        <label class="control-label col-sm-3" for="date_of_sample">${ui.message("labtrackingapp.orderdetails.sampledatelabel")}</label>
                          <input type="text" class="form-control" uib-datepicker-popup="{{format}}" ng-model="dt" is-open="popup1.opened" datepicker-options="dateOptions" ng-required="true" close-text="Close" alt-input-formats="altInputFormats" />
                          <span class="input-group-btn">
                            <button type="button" class="btn btn-default" ng-click="open1()"><i class="glyphicon glyphicon-calendar"></i></button>
                          </span>
                      </div>

                      <div class="form-group">
                        <label class="control-label col-sm-3" for="proc_location">${ui.message("labtrackingapp.orderdetails.locationlabel")}</label>
                        <div class="col-sm-9">
                            <select type='text' class="form-control" id="proc_location" >
                              <option>Mirebalais Hospital</option>
                              <option>Another Hospital</option>
                              </select>
                        </div>
                      </div>

                      <div class="form-group">
                        <label class="control-label col-sm-3" for="attending_surgeon">${ui.message("labtrackingapp.orderdetails.attendingsurgeonlabel")}</label>
                        <div class="col-sm-9">
                            <select type='text' class="form-control" id="attending_surgeon" >
                              <option>Joseph Jones</option>
                              <option>Another Dr.</option>
                            </select>
                        </div>
                      </div>

                      <div class="form-group">
                        <label class="control-label col-sm-3" for="resident">${ui.message("labtrackingapp.orderdetails.residentlabel")}</label>
                        <div class="col-sm-9">
                            <select type='text' class="form-control" id="resident" >
                              <option>Resident Jones</option>
                              <option>Another Dr.</option>
                            </select>
                        </div>
                      </div>

                      <div class="form-group">
                        <label class="control-label col-sm-3" for="mdtonotify">${ui.message("labtrackingapp.orderdetails.mdtonotifylabel")}</label>
                        <div class="col-sm-9">
                            <select type='text' class="form-control" id="mdtonotify" >
                              <option>MD Jones</option>
                              <option>Another MD.</option>
                            </select>
                        </div>
                      </div>

                      <div class="form-group">
                        <label class="col-sm-3 col-form-label">${ui.message("labtrackingapp.prelabdiagnosislabel")}</label>
                        <div class="col-sm-9">
                          <select class="form-control" id="site" ng-model="order.diagnosis.value">
                            <option ng-repeat="a in order.diagnosis.concept.answers | orderBy:a.label" ng-selected="order.diagnosis.concept.value==a.uuid"  value="{{a.uuid}}">{{a.label}}-{{a.uuid}}</option>
                          </select>
                        </div>
                      </div>
                      <div class="form-group row">
                        <label for="site" class="col-sm-3 col-form-label">${ui.message("labtrackingapp.proceduresitelabel")}</label>
                        <div class="col-sm-9">
                          <select class="form-control" id="site" ng-model="order.procedure.value">
                            <option ng-repeat="a in order.procedure.concept.answers | orderBy:a.label" ng-selected="order.procedure.concept.value==a.uuid"  value="{{a.uuid}}">{{a.label}}-{{a.uuid}}</option>
                          </select>
                        </div>
                      </div>

                       <div class="row">
                         <label class="control-label col-sm-3" for="urgentreviewlabel">${ui.message("labtrackingapp.orderdetails.urgentreviewlabel")}</label>
                         <div class="col-sm-9">
                             <div id="file1" class="btn-group" data-toggle="buttons">
                                 <label class="btn btn-danger"><input type="radio" name="radioGroup2" value="yes">Yes</label>
                                 <label class="btn btn-primary"><input type="radio" name="radioGroup2" >No</label>
                             </div>
                         </div>

                       </div>

                      <div class="form-group">
                        <label class="control-label col-sm-3  col-form-label" for="postopdiagnosis">${ui.message("labtrackingapp.orderdetails.postopdiagnosislabel")}</label>
                        <div class="col-sm-9">
                            <textarea class="form-control" id="postopdiagnosis"></textarea>
                        </div>
                      </div>

                       <div class="form-group">
                         <label class="control-label col-sm-3" for="clinicalhistory">${ui.message("labtrackingapp.clinicalhistorylabel")}</label>
                         <div class="col-sm-9">
                             <textarea class="form-control" id="clinicalhistory"></textarea>
                         </div>
                       </div>

                       <div class="form-group">
                         <label class="control-label col-sm-3" for="specimandetails">${ui.message("labtrackingapp.orderdetails.specimandetailslabel")}</label>
                         <div class="col-sm-9">
                              <textarea class="form-control" id="additionalinformation"></textarea>
                         </div>
                       </div>

                       <div class="form-group">
                         <label class="control-label col-sm-3" for="additionalinformation">${ui.message("labtrackingapp.orderdetails.additionalinformationlabel")}</label>
                         <div class="col-sm-9">
                             <textarea class="form-control" id="additionalinformation"></textarea>
                         </div>
                       </div>


                      <div class="form-group">
                        <div class="col-sm-offset-2 col-sm-9 pull-right">
                          <button type="button" class="btn btn-primary">${ui.message("uicommons.cancel")}</button>
                          <button type="button" class="btn btn-default">${ui.message("uicommons.save")}</button>
                        </div>
                      </div>
                    </form>
                  </div>

                </div>
              </div>

              <div class="panel panel-default">
                <div class="panel-heading">
                    <a data-toggle="collapse" href="#results">${ui.message("labtrackingapp.resultdetailslabel")}</a>
                  </h4>
                </div>
                <div id="results" class="panel-collapse">
                  <div class="panel-body">
                    <form class="form-horizontal">
                      <div class="form-group">
                        <label class="control-label col-sm-3" for="date_of_results">${ui.message("labtrackingapp.orderdetails.resultsdatelabel")}</label>
                        <div class="col-sm-9">
                          <div class='input-group date'>
                            <input type='text' class="form-control" id="date_of_results"  value="8-Nov-2014"/>
                            <span class="input-group-addon">
                             <span class="glyphicon glyphicon-calendar"></span>
                          </span>
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                        <label class="control-label col-sm-3" for="notes">${ui.message("labtrackingapp.orderdetails.noteslabel")}</label>
                        <div class="col-sm-9">
                            <textarea class="form-control" id="notes"></textarea>
                        </div>
                      </div>


                      <div class="form-group">
                        <label class="control-label col-sm-3" for="upload_file">${ui.message("labtrackingapp.orderdetails.uploadfilelabel")}</label>
                        <div class="col-sm-9">
                            <input type="file" class="form-control" id="upload_file" /> <a href="">[TODO: file link here if exists]</a>
                        </div>
                      </div>

                      <div class="form-group">
                        <div class="col-sm-offset-2 col-sm-9 pull-right">
                          <button type="button" class="btn btn-primary">${ui.message("uicommons.cancel")}</button>
                          <button type="button" class="btn btn-default">${ui.message("uicommons.save")}</button>
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
