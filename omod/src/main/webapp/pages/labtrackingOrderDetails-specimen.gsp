<div class="panel panel-default">
   <div class="panel-heading">
      <h4 class="panel-title">
         <a data-toggle="collapse" href="#specimen_panel">${ui.message("labtrackingapp.pathologyspecimendetailslabel")}</a>
      </h4>
   </div>
   <div id="specimen_panel" class="panel-collapse">
      <form class="form-horizontal">
          <div class="row">
            <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.sampledatelabel")}</label>
            <div class="col-sm-9">
              <p class="form-control-static">{{(order.sampleDate.value==null?"New":order.sampleDate.value) | date : 'shortDate'}}</p>
            </div>
          </div>
         <div class="form-group">
            <label class="control-label form-control-static text-right col-sm-3" for="proc_location">${ui.message("labtrackingapp.orderdetails.locationlabel")}</label>
            <div class="col-sm-8">
                <input type="text" ng-model="order.location"  uib-typeahead="loc as loc.display for loc in locations| filter:{display:${'$viewValue'}} | limitTo:8" class="form-control" typeahead-editable="false">
            </div>
         </div>
         <div class="form-group">
            <label class="control-label text-right col-sm-3" for="surgeon">${ui.message("labtrackingapp.orderdetails.attendingsurgeonlabel")}</label>
            <div class="col-sm-8">
               <input id="surgeon" type="text" ng-model="order.surgeon"  uib-typeahead="a as a.name for a in providers| filter:{name:${'$viewValue'}} | limitTo:8" class="form-control" typeahead-editable="false">
            </div>
         </div>
         <div class="form-group">
            <label class="control-label col-sm-3" for="resident">${ui.message("labtrackingapp.orderdetails.residentlabel")}</label>
            <div class="col-sm-8">
               <input id="resident" type="text" ng-model="order.resident"  uib-typeahead="a as a.name for a in providers| filter:{name:${'$viewValue'}} | limitTo:8" class="form-control" typeahead-editable="false">            </div>
         </div>
         <div class="form-group">
            <label class="control-label col-sm-3" for="mdtonotify">${ui.message("labtrackingapp.orderdetails.mdtonotifylabel")}</label>
            <div class="col-sm-8">
               <input type='text' class="form-control" id="mdtonotify" ng-model="order.md.value" >
            </div>
         </div>
         <div class="form-group">
            <label class="control-label col-sm-3">${ui.message("labtrackingapp.prelabdiagnosislabel")}</label>
            <div class="col-sm-8">
               <select class="form-control" id="prelabdiagnosis"
                    ng-options="item as item.label disable when item.value=='?????' for item in concepts.preLabDiagnosis.answers | orderBy:'label' track by item.value "
                    ng-selected="order.preLabDiagnosis.value==item.value"
                    ng-model="order.preLabDiagnosis">
               </select>
            </div>
         </div>
         <div class="form-group">
            <label class="control-label col-sm-3" for="procedure" >${ui.message("labtrackingapp.proceduresitelabel")}</label>
            <div class="col-sm-8">
               <select id="procedure" class="form-control" multiple
                ng-options="item as item.label disable when item.value=='?????' for item in concepts.procedure.answers | orderBy:'label' track by item.value"
                ng-model="order.procedures" ></select>
            </div>
         </div>
         <div class="form-group">
            <label class="control-label col-sm-3" for="urgentreviewlabel">${ui.message("labtrackingapp.orderdetails.urgentreviewlabel")}</label>
            <div class="col-sm-8">
                 <div class="btn-group btn-toggle">
                   <button class="btn btn-lg btn-default" ng-class="{'btn-primary': order.urgency.value}" ng-click="order.urgency.value=!order.urgency.value">Yes</button>
                   <button class="btn btn-lg btn-default" ng-class="{'btn-primary': !order.urgency.value}" ng-click="order.urgency.value=!order.urgency.value">No</button>
                 </div>
            </div>
         </div>
         <div class="form-group">
            <label class="control-label col-sm-3"  for="postopdiagnosis">${ui.message("labtrackingapp.orderdetails.postopdiagnosislabel")}</label>
            <div class="col-sm-8">
               <select class="form-control" id="postopdiagnosis"
                    ng-options="item as item.label disable when item.value=='?????' for item in concepts.preLabDiagnosis.answers | orderBy:'label' track by item.value "
                    ng-model="order.postopDiagnosis">
               </select>
            </div>
         </div>
         <div class="form-group">
            <label class="control-label col-sm-3"  for="clinicalhistory">${ui.message("labtrackingapp.clinicalhistorylabel")}</label>
            <div class="col-sm-8">
               <textarea class="form-control" id="clinicalhistory" ng-model="order.clinicalHistory.value"></textarea>
            </div>
         </div>
         <div class="form-group">
            <label class="control-label col-sm-3">${ui.message("labtrackingapp.orderdetails.specimandetailslabel")}</label>
            <div class="col-sm-8">
                <div class="form-group" ng-repeat="a in concepts.specimenDetails">
                    <label class="control-label col-sm-1">{{${'$'}index+1 }}.</label>
                    <div class="col-sm-11">
                       <input type="text" class="form-control" ng-model="order.specimenDetails[${'$'}index].value"></input>
                    </div>
                </div>
            </div>
         </div>
         <div class="form-group" >
            <div class="col-sm-offset-2 col-sm-9 text-right">
               <button type="button" class="btn btn-primary" ng-click="cancelSpecimenDetails()">${ui.message("uicommons.cancel")}</button>
               <button type="button" class="btn btn-default" ng-click="saveSpecimenDetails()">${ui.message("uicommons.save")}</button>
            </div>
         </div>
      </form>
   </div>
</div>