<div class="panel panel-default">
   <div class="panel-heading">
      <h4 class="panel-title">
         <a data-toggle="collapse" href="#specimen_panel">${ui.message("labtrackingapp.pathologyspecimendetailslabel")}</a>
      </h4>
   </div>
   <div id="specimen_panel" class="panel-collapse collapse">
      <form class="form-horizontal">
         <div class="form-group">
            <label class="control-label col-sm-3" for="date_of_sample">${ui.message("labtrackingapp.orderdetails.sampledatelabel")}</label>
            TBD
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