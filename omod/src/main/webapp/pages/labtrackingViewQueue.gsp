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

    <style>
      .top-buffer { margin-top:20px; }
    </style>


<div class="container" ng-app="labTrackingApp" ng-controller="viewQueueController">


        <div class="panel panel-primary" id="monitor_box">
          <div class="panel-heading">Test Monitor Page</div>
          <div class="panel-body">

              <div class="row">
                <div class="col-md-4">
                  <label for="status">Status:</label>
                  <select class="form-control" id="status">
                    <option>All</option>
                    <option>Requested</option>
                    <option>Reported</option>
                    <option>Taken</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label for="timeframe">from:</label>
                  <div class='input-group date' id='timeframe'>
                    <input type='text' class="form-control" />
                    <span class="input-group-addon">
                        <span class="glyphicon glyphicon-calendar"></span>
                    </span>
                  </div>
                </div>

                <div class="col-md-4">
                  <label for="timeframe">to:</label>
                  <div class='input-group date' id='timeframe'>
                    <input type='text' class="form-control" />
                    <span class="input-group-addon">
                        <span class="glyphicon glyphicon-calendar"></span>
                    </span>
                  </div>
                </div>


              </div>

            <div class="row top-buffer">
            <div class="col-md-3">Search for patient</div>
              <div class="col-md-9">
                <div class='input-group date' id='search'>
                  <input type='text' class="form-control" />
                  <span class="input-group-addon">
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
                <tbody>
                <tr >
                  <td>ABC123</td>
                  <td>Trot Nixon</td>
                  <td>Taken</td>
                  <td>23-Nov-2014</td>
                  <td>23-Nov-2014</td>
                  <td>23-Nov-2014</td>
                  <td>
                    <button class="btn btn-sm btn-primary"  onclick="setState(3)">details</button>
                    <button class="btn btn-sm">print</button>
                    <button class="btn btn-sm">cancel</button>
                  </td>
                </tr>
                <tr>
                  <td>ABC123</td>
                  <td>Trot Nixon</td>
                  <td>Reported</td>
                  <td>23-Nov-2014</td>
                  <td>23-Nov-2014</td>
                  <td></td>
                  <td>
                    <button class="btn btn-sm btn-primary" onclick="setState(3)">details</button>
                    <button class="btn btn-sm">print</button>
                    <button class="btn btn-sm">cancel</button>
                  </td>
                </tr>
                <tr>
                  <td>ABC124</td>
                  <td>Brot Nixon</td>
                  <td>Requested</td>
                  <td>23-Nov-2014</td>
                  <td></td>
                  <td></td>
                  <td>
                    <button class="btn btn-sm btn-primary" onclick="setState(3)">details</button>
                    <button class="btn btn-sm">print</button>
                    <button class="btn btn-sm">cancel</button>
                  </td>
                </tr>
                <tr>
                  <td>ABC126</td>
                  <td>Blot Nixon</td>
                  <td>Taken</td>
                  <td>23-Nov-2014</td>
                  <td>23-Nov-2014</td>
                  <td></td>
                  <td>
                    <button class="btn btn-sm btn-primary" onclick="setState(3)">details</button>
                    <button class="btn btn-sm">print</button>
                    <button class="btn btn-sm">cancel</button>
                  </td>
                </tr>
                <tr>
                  <td>ABC123</td>
                  <td>Trot Nixon</td>
                  <td>Taken</td>
                  <td>23-Nov-2014</td>
                  <td>23-Nov-2014</td>
                  <td></td>
                  <td>
                    <button class="btn btn-sm btn-primary" onclick="setState(3)">details</button>
                    <button class="btn btn-sm">print</button>
                    <button class="btn btn-sm">cancel</button>
                  </td>
                </tr>
                </tbody>
              </table>
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
