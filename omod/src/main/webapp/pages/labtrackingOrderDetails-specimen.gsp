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
              <p class="form-control-static">{{(order.sampleDate.value==null?"NEW":2) | date : 'shortDate'}}</p>
            </div>
          </div>
         <div class="form-group">
            <label class="control-label form-control-static text-right col-sm-3" for="proc_location">${ui.message("labtrackingapp.orderdetails.locationlabel")}</label>
            <div class="col-sm-8">
               <select type='text' class="form-control" id="proc_location" ng-model="order.location.value" >
                  <option ng-repeat="a in locations | orderBy:a.display" ng-selected="order.location.value==a.uuid"  value="{{a.uuid}}">{{a.display}}</option>
               </select>
            </div>
         </div>
         <div class="form-group">
            <label class="control-label text-right col-sm-3" for="surgeon">${ui.message("labtrackingapp.orderdetails.attendingsurgeonlabel")}</label>
            <div class="col-sm-8">
               <select type='text' class="form-control" ng-model="order.surgeon.value" id="surgeon">
                <option ng-repeat="a in providers | orderBy:a.name" ng-selected="order.surgeon.value==a.uuid"  value="{{a.uuid}}">{{a.name}}</option>
               </select>
            </div>
         </div>
         <div class="form-group">
            <label class="control-label col-sm-3" for="resident">${ui.message("labtrackingapp.orderdetails.residentlabel")}</label>
            <div class="col-sm-8">
               <select type='text' class="form-control" id="resident" ng-model="order.resident.value">
                  <option ng-repeat="a in providers | orderBy:a.name" ng-selected="order.resident.value==a.uuid"  value="{{a.uuid}}">{{a.name}}</option>
               </select>
            </div>
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
               <select class="form-control" id="site" ng-model="order.diagnosis.value">
                  <option ng-repeat="a in order.diagnosis.concept.answers | orderBy:a.label" ng-selected="order.diagnosis.concept.value==a.uuid"  value="{{a.uuid}}">{{a.label}}-{{a.uuid}}</option>
               </select>
            </div>
         </div>
         <div class="form-group">
            <label class="control-label col-sm-3" for="site" >${ui.message("labtrackingapp.proceduresitelabel")}</label>
            <div class="col-sm-8">
               <select class="form-control" id="site" ng-model="order.procedure.value">
                  <option ng-repeat="a in order.procedure.concept.answers | orderBy:a.label" ng-selected="order.procedure.concept.value==a.uuid"  value="{{a.uuid}}">{{a.label}}-{{a.uuid}}</option>
               </select>
            </div>
         </div>
         <div class="form-group">
            <label class="control-label col-sm-3" for="urgentreviewlabel">${ui.message("labtrackingapp.orderdetails.urgentreviewlabel")}</label>
            <div class="col-sm-8">
               <div class="btn-group" id="urgentreviewlabel" data-toggle="buttons">
                  <label class="btn btn-danger"><input type="radio" name="radioGroup2" value="yes">Yes</label>
                  <label class="btn btn-primary"><input type="radio" name="radioGroup2" >No</label>
               </div>
            </div>
         </div>
         <div class="form-group">
            <label class="control-label col-sm-3"  for="postopdiagnosis">${ui.message("labtrackingapp.orderdetails.postopdiagnosislabel")}</label>
            <div class="col-sm-8">
              <select class="form-control" id="site" ng-model="order.postopDiagnosis.value">
                 <option ng-repeat="a in order.diagnosis.concept.answers | orderBy:a.label" ng-selected="order.postopDiagnosis.concept.value==a.uuid"  value="{{a.uuid}}">{{a.label}}-{{a.uuid}}</option>
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
                <div class="form-group" ng-repeat="a in [1,2,3]">
                    <label class="control-label col-sm-1">{{a}}.</label>
                    <div class="col-sm-11">
                       <input type="text" class="form-control" ng-model="order.clinicalHistory.value"></input>
                    </div>
                </div>
            </div>
         </div>
         <div class="form-group" >
            <div class="col-sm-offset-2 col-sm-9 text-right">
               <button type="button" class="btn btn-primary">${ui.message("uicommons.cancel")}</button>
               <button type="button" class="btn btn-default">${ui.message("uicommons.save")}</button>
            </div>
         </div>
      </form>
   </div>
</div>