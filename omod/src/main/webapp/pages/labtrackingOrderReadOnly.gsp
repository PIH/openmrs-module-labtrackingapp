<div class="panel panel-default" ng-if="hasSpecimenCollection(order)">
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
                  <button type="button" class="btn btn-primary btn-sm" ng-show="order.file.url!=null" ng-click="downloadPdf()">Download PDF <i class="glyphicon glyphicon-download" aria-hidden="true"></i></button>
               </div>
            </div>
      </div>
   </div>
</div>
