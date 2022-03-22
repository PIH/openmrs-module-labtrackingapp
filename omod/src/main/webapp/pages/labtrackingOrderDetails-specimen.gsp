<div class="panel panel-default">
	<div class="panel-heading">
		<h4 class="panel-title">
			<a data-toggle="collapse" href="#specimen_panel">${ui.message("labtrackingapp.pathologyspecimendetailslabel")}</a>
		</h4>
	</div>
	<div id="specimen_panel" class="panel-collapse in">
		<div class="panel-body">

                <div class="row">
                    <div class="col-sm-3 text-right" for="date_of_procedure">${ui.message("labtrackingapp.orderdetails.processedDatelabel")}</div>
					<div class="col-md-9">
						<div class='input-group date' id='date_of_procedure'>
							<input type="text" class="form-control" uib-datepicker-popup="{{procedureDateBoxOptions.format}}" popup-placement="top"
								   ng-model="order.processedDate.value" is-open="procedureDateBoxOptions.opened"
								   datepicker-options="procedureDateBoxOptions.options"
								   ng-required="false" close-text="Close" alt-input-formats="procedureDateBoxOptions.altInputFormats" />
							<span class="input-group-btn">
								<button type="button" class="btn btn-default" ng-click="showProcedureDateBox()">
									<i class="glyphicon glyphicon-calendar"></i>
								</button>
							</span>
						</div>
                    </div>
                </div>
				<div class="row top-buffer">
					<label class="control-label col-sm-3" for="accessionNumber">${ui.message("labtrackingapp.accessionNumber")}</label>
					<div class="col-sm-9">
						<input type='text' class="form-control" id="accessionNumber" ng-model="order.accessionNumber.value"  />
					</div>
				</div>


		</div>
	</div>
</div>
