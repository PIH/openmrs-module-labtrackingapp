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
					<label class="control-label col-sm-3 text-right" for="accessionNumber">${ui.message("labtrackingapp.accessionNumber")}</label>
					<div class="col-sm-9">
						<input type='text' class="form-control" id="accessionNumber" ng-model="order.accessionNumber.value"  />
					</div>
				</div>

				<div class="row top-buffer">
					<label class="col-sm-3 text-right">${ui.message("labtrackingapp.orderdetails.immunohistochemistrySentToBoston")}</label>
					<div class="col-sm-9">
						<div class="btn-group btn-toggle">
							<button class="btn btn-lg btn-default" ng-class="{'btn-danger': order.immunohistochemistrySentToBoston.value=='3cd6f600-26fe-102b-80cb-0017a47871b2'}" ng-click="order.immunohistochemistrySentToBoston.value='3cd6f600-26fe-102b-80cb-0017a47871b2'">${ui.message("uicommons.yes")}</button>
							<button class="btn btn-lg btn-default" ng-class="{'btn-primary': order.immunohistochemistrySentToBoston.value!='3cd6f600-26fe-102b-80cb-0017a47871b2'}" ng-click="order.immunohistochemistrySentToBoston.value=''; order.dateImmunoSentToBoston.value=null">${ui.message("uicommons.no")}</button>
						</div>
					</div>
				</div>
				<!-- show the date when the Immunohistochemistry was sent to Boston if the previous button is Yes-->
				<div class="row top-buffer" ng-show="order.immunohistochemistrySentToBoston.value=='3cd6f600-26fe-102b-80cb-0017a47871b2'">
					<div class="col-sm-3 text-right" for="date_immuno_sent">${ui.message("labtrackingapp.orderdetails.dateImmunoSentlabel")}</div>
					<div class="col-md-9">
						<div class='input-group date' id='date_immuno_sent'>
							<input type="text" class="form-control" uib-datepicker-popup="{{immunoDateBoxOptions.format}}" popup-placement="top"
								   ng-model="order.dateImmunoSentToBoston.value" is-open="immunoDateBoxOptions.opened"
								   datepicker-options="immunoDateBoxOptions.options"
								   ng-required="false" close-text="Close" alt-input-formats="immunoDateBoxOptions.altInputFormats" />
							<span class="input-group-btn">
								<button type="button" class="btn btn-default" ng-click="showImmunoDateBox()">
									<i class="glyphicon glyphicon-calendar"></i>
								</button>
							</span>
						</div>
					</div>
				</div>
		</div>
	</div>
</div>
