<div class="panel panel-default">
   <div class="panel-heading">
      <h4 class="panel-title">
         <a data-toggle="collapse" href="#order_panel">${ui.message("labtrackingapp.pathologyspecimendetailslabel")} </a>
      </h4>
   </div>
   <div id="order_panel" class="panel-collapse in">
      <div class="panel-body">
         <div class="row">
            <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.clinicalhistorylabel")}</label>
            <div class="col-sm-9">
               <p class="form-control-static" >{{order.clinicalHistoryForSpecimen.value}}</p>
            </div>
         </div>
         <div class="row">
            <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.proceduresitelabel")}</label>
            <div class="col-sm-9">
               <p class="form-control-static" ng-repeat="a in order.proceduresForSpecimen | orderBy:'label'" >{{a.label}}</p>
               <p ng-if="order.procedureNonCodedForSpecimen.value" class="form-control-static">{{order.procedureNonCodedForSpecimen.value}}</p>
            </div>
         </div>
         <div class="row">
            <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.sampledatelabel")}</label>
            <div class="col-sm-9">
               <p class="form-control-static">{{order.sampleDate.value | date : 'shortDate'}}</p>
            </div>
         </div>
         <div class="row">
            <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.locationlabel")}</label>
            <div class="col-sm-9">
               <p class="form-control-static" >{{order.locationWhereSpecimenCollected.label}}</p>
            </div>
         </div>
         <div class="row">
            <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.preoathologydiagnosislabel")}</label>
            <div class="col-sm-9">
               <p class="form-control-static" >{{order.preLabDiagnosis.label}}</p>
            </div>
         </div>
         <div class="row">
            <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.postopdiagnosislabel")}</label>
            <div class="col-sm-9">
               <p class="form-control-static" >{{order.postopDiagnosis.diagnosis.label}}</p>
            </div>
         </div>
            <div class="row">
               <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.specimandetailslabel")}</label>
               <div class="col-sm-9">
                  <div class="form-group" ng-repeat="a in concepts.specimenDetails">
                     <div class="col-sm-12">
                        <p class="form-control-static" >{{${'$'}index+1 }}. {{order.specimenDetails[${'$'}index].value}}</p>
                     </div>
                  </div>
               </div>
            </div>
            <div class="row">
               <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.attendingsurgeonlabel")}</label>
               <div class="col-sm-9">
                  <p class="form-control-static" >{{order.surgeon.label}}</p>
               </div>
            </div>
            <div class="row">
               <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.residentlabel")}</label>
               <div class="col-sm-9">
                  <p class="form-control-static" >{{order.resident.label}}</p>
               </div>
            </div>
         <div class="row">
            <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.mdtonotifylabel")}</label>
            <div class="col-sm-9">
               <p class="form-control-static" >{{order.mdToNotify.value}}</p>
            </div>
         </div>
            <div class="row">
               <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.urgentreviewlabel")}</label>
               <div class="col-sm-9">
                  <p class="form-control-static" >{{order.urgentReview.value == "3cd6f600-26fe-102b-80cb-0017a47871b2"?"${ui.message("uicommons.yes")}":"${ui.message("uicommons.no")}"}}</p>
               </div>
            </div>
         </div>
      </div>
   </div>
</div>

<div class="panel panel-default">
   <div class="panel-heading">
      <h4 class="panel-title">
         <a data-toggle="collapse" href="#order_panel">${ui.message("labtrackingapp.resultdetailslabel")} </a>
      </h4>
   </div>
   <div id="order_panel" class="panel-collapse in">
      <div class="panel-body">
         <div class="row">
            <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.resultsdatelabel")}</label>
            <div class="col-sm-9">
               <p class="form-control-static">{{order.resultDate.value | date : 'shortDate'}}</p>
            </div>
         </div>
            <div class="row">
               <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.noteslabel")}</label>
               <div class="col-sm-9">
                  <p class="form-control-static" >{{order.notes.value}}</p>
               </div>
            </div>
            <div class="row">
               <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.uploadfilelabel")}</label>
               <div class="col-sm-9">
                  <button type="button" class="btn btn-primary btn-sm" ng-show="order.file.url!=null" ng-click="downloadPdf()">Download PDF <i class="glyphicon glyphicon-download" aria-hidden="true"></i></button>
               </div>
            </div>
      </div>
   </div>
</div>