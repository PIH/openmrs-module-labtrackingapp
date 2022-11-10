<div class="panel panel-default" ng-if="hasSpecimenCollection(order)">
   <div class="panel-heading">
      <h4 class="panel-title">
         <a data-toggle="collapse" href="#order_panel">${ui.message("labtrackingapp.resultdetailslabel")} </a>
      </h4>
   </div>
   <div id="order_panel" class="panel-collapse in" ng-if="order.resultDate.value">
      <div class="panel-body">
         <div class="row">
            <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.resultsdatelabel")}</label>
            <div class="col-sm-9">
               <p class="form-control-static">{{order.resultDate.value | date : 'd-MMM-yy'}}</p>
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
                  <button type="button" class="btn btn-primary btn-sm" ng-show="order.files.length > 0" ng-click="downloadPdf()">Download PDF <i class="glyphicon glyphicon-download" aria-hidden="true"></i></button>
               </div>
            </div>
            <div class="row">
               <label class="form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.confirmedCancer")}</label>
               <div class="col-sm-9">
                  <div class="btn-group btn-toggle">
                     <button class="btn btn-lg btn-default" ng-class="{'btn-danger': order.confirmedCancer.value=='3cd6f600-26fe-102b-80cb-0017a47871b2'}">${ui.message("uicommons.yes")}</button>
                     <button class="btn btn-lg btn-default" ng-class="{'btn-primary': order.confirmedCancer.value!='3cd6f600-26fe-102b-80cb-0017a47871b2'}">${ui.message("uicommons.no")}</button>
                  </div>
               </div>
            </div>
            <div class="row">
               <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.diagnosislabel")}</label>
               <div class="col-sm-9">
                  <p class="form-control-static" >
                     {{formatDiagnosis(order.confirmedDiagnosis.diagnosis)}}
                  </p>
               </div>
            </div>
      </div>
   </div>
</div>
