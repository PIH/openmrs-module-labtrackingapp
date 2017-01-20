<div class="panel panel-default">
	<div class="panel-heading">
		<h4 class="panel-title">
			<a data-toggle="collapse" href="#results_panel">${ui.message("labtrackingapp.resultdetailslabel")}</a>
		</h4>
	</div>
	<div id="results_panel" class="panel-collapse in">
	<form class="form-horizontal" name="resultsForm" id="resultsForm">
		<div class="panel-body">
			<div class="row">
				<label class="control-label col-sm-3 text-right" for="date_of_results">${ui.message("labtrackingapp.orderdetails.resultsdatelabel")}</label>
				<div class="col-md-9">
					<div class='input-group date' id='date_of_results'>
						<input type="text" class="form-control" uib-datepicker-popup="{{dateBoxOptions.format}}"
						ng-model="order.resultDate.value" is-open="dateBoxOptions.opened"
                         datepicker-options="dateBoxOptions.options"
                     ng-required="false" close-text="Close" alt-input-formats="dateBoxOptions.altInputFormats" />
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
					<textarea class="form-control" id="notes" ng-model="order.notes.value"></textarea>
				</div>
			</div>
			<div class="row top-buffer">
				<label class="control-label col-sm-3 text-right" for="upload_file">${ui.message("labtrackingapp.orderdetails.uploadfilelabel")}</label>
				<div class="col-sm-9">

					      <input type="file" ngf-select ng-model="order.fileData" name="file"
                                 accept="application/pdf" ngf-max-size="2MB" required
                                 ngf-model-invalid="errorFile">
                          <i ng-show="resultsForm.file.${'$'}error.maxSize">File too large
                              {{errorFile.size / 1000000|number:1}}MB: max 2M</i>
                          <button ng-disabled="!resultsForm.${'$'}valid"
                                  ng-click="uploadPdf(order.fileData)">Submit</button>
                          <span class="progress" ng-show="order.fileData.progress >= 0">
                            <div style="width:{{order.fileData.progress}}%" 
                                ng-bind="order.fileData.progress + '%'"></div>
                          </span>
                          <span ng-show="order.fileData.result">Upload Successful</span>
                          <div ng-show="errorMsg" class="alert alert-danger" >{{errorMsg}}</div>
      
					<button ng-click="downloadPdf()" class="btn btn-primary">download PDF <i class="glyphicon glyphicon-list-alt" aria-hidden="true"></i></button>
				</div>
			</div>
		</div>
		</form>
	</div>
</div>