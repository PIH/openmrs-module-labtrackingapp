<div class="panel panel-default">
	<div class="panel-heading">
		<h4 class="panel-title">
			<a data-toggle="collapse" href="#results_panel">${ui.message("labtrackingapp.resultdetailslabel")}</a>
		</h4>
	</div>
	<div id="results_panel" class="panel-collapse">
		<div class="panel-body">
			<div class="row">
				<label class="control-label col-sm-3 text-right" for="date_of_results">${ui.message("labtrackingapp.orderdetails.resultsdatelabel")}</label>
				<div class="col-md-9">
					<div class='input-group date' id='date_of_results'>
						<input type="text" class="form-control" uib-datepicker-popup="{{resultsDate.format}}" ng-model="resultsDate.value" is-open="resultsDate.opened"
                     datepicker-options="resultsDate.options"
                     ng-required="false" close-text="Close" alt-input-formats="resultsDate.altInputFormats" />
                     	<span class="input-group-btn">
							<button type="button" class="btn btn-default" ng-click="showResultsDateBox()">
								<i class="glyphicon glyphicon-calendar"></i>
							</button>
						</span>
					</div>
				</div>
			</div>
			<div class="row top-buffer">
				<label class="control-label col-sm-3 text-right" for="notes">${ui.message("labtrackingapp.orderdetails.noteslabel")}</label>
				<div class="col-sm-9">
					<textarea class="form-control" id="notes"></textarea>
				</div>
			</div>
			<div class="row top-buffer">
				<label class="control-label col-sm-3 text-right" for="upload_file">${ui.message("labtrackingapp.orderdetails.uploadfilelabel")}</label>
				<div class="col-sm-9">
					<input type="file" class="form-control" id="upload_file" />
					<a href="">[TODO: file link here if exists]</a>
				</div>
			</div>
			<div class="row top-buffer">
				<div class="col-sm-offset-3 col-sm-9 text-right">
					<button type="button" class="btn btn-primary" ng-click="cancelSpecimenDetails()">${ui.message("uicommons.cancel")}</button>
					<button type="button" class="btn btn-default">${ui.message("uicommons.save")}</button>
				</div>
			</div>

		</div>

	</div>
</div>
