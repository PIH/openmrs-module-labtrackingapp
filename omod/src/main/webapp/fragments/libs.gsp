<%
ui.includeJavascript("uicommons", "angular.min.js")

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

//required for the ui-boostrap libs
ui.includeJavascript("labtrackingapp", "libs/angular-animate.js")
ui.includeJavascript("labtrackingapp", "libs/angular-sanitize.js")
ui.includeJavascript("labtrackingapp", "libs/bootstrap.min.js")
// libs for the bootstrap date picker and other libs
//  the version in openmrs is older
ui.includeJavascript("labtrackingapp", "libs/ui-bootstrap-tpls-2.3.1.js")

ui.includeJavascript("labtrackingapp", "components/LabTrackingDataService.js")
ui.includeJavascript("labtrackingapp", "components/EncounterFactory.js")
ui.includeJavascript("labtrackingapp", "components/LabTrackingOrderFactory.js")
%>
