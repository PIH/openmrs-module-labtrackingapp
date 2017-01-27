<%
// CSS FILES
ui.includeCss("labtrackingapp", "labtrackingapp.css")

// JS FILES
ui.includeJavascript("uicommons", "angular.min.js")
ui.includeJavascript("uicommons", "angular-resource.min.js")
ui.includeJavascript("uicommons", "angular-common.js")
ui.includeJavascript("uicommons", "angular-app.js")
ui.includeJavascript("uicommons", "services/session.js")
ui.includeJavascript("uicommons", "filters/serverDate.js")

// required for the ui-boostrap libs
ui.includeJavascript("labtrackingapp", "libs/angular-animate.js")
ui.includeJavascript("labtrackingapp", "libs/angular-sanitize.js")
ui.includeJavascript("labtrackingapp", "libs/bootstrap.min.js")

// libs for the bootstrap date picker and other libs
//  the version in openmrs is older
ui.includeJavascript("labtrackingapp", "libs/ui-bootstrap-tpls-2.3.1.js")

// used for the file uploaed
ui.includeJavascript("labtrackingapp", "libs/ng-file-upload-shim.min.js")
ui.includeJavascript("labtrackingapp", "libs/ng-file-upload.min.js")

// used for cookie management
ui.includeJavascript("labtrackingapp", "libs/angular-cookies.min.js")

// used for all the apps
ui.includeJavascript("labtrackingapp", "components/LabTrackingDataService.js")
ui.includeJavascript("labtrackingapp", "components/EncounterFactory.js")
ui.includeJavascript("labtrackingapp", "components/LabTrackingOrderFactory.js")
%>
