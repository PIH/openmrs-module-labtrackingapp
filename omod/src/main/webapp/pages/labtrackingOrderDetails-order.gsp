<div class="panel panel-default">
	<div class="panel-heading">
		<h4 class="panel-title">
			<a data-toggle="collapse" href="#order_panel">${ui.message("labtrackingapp.orderdetails.label")} - {{order.orderNumber.value}}</a>
		</h4>
	</div>
	<div id="order_panel" class="panel-collapse in">
		<div class="panel-body">
            <div class="row">
                <label class="control-label form-control-static text-right col-sm-3">${ ui.message("labtrackingapp.orderdetails.dateOfInitialConsult") }</label>
                <div class="col-sm-9">
                    <p class="form-control-static">{{order.requestDate.value | date : 'd-MMM-yy'}}</p>
                </div>
            </div>
            <div class="row">
                <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.proceduresitelabel")}</label>
                <div class="col-sm-9">
                    <p class="form-control-static" ng-repeat="a in order.procedures | orderBy:'label'" >{{a.label}}</p>
                    <p ng-if="order.procedureNonCoded.value" class="form-control-static">{{order.procedureNonCoded.value}}</p>
                </div>
            </div>
            <div class="row">
                <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.preoathologydiagnosislabel")}</label>
                <div class="col-sm-9">
                    <p class="form-control-static" >
                        {{formatDiagnosis(order.preLabDiagnosis)}}
                    </p>
                </div>
            </div>
            <div class="row">
                <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.instructionslabel")}</label>
                <div class="col-sm-9">
                    <p class="form-control-static" >{{order.instructions.value}}</p>
                </div>
            </div>
            <div class="row">
                <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.clinicalhistorylabel")}</label>
                <div class="col-sm-9">
                    <p class="form-control-static" >{{order.clinicalHistory.value}}</p>
                </div>
            </div>
		</div>
	</div>
</div>


