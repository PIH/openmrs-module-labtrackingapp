<div class="panel panel-default">
	<div class="panel-heading">
		<h4 class="panel-title">
			<a data-toggle="collapse" href="#results_panel">${ui.message("labtrackingapp.resultdetailslabel")}</a>
		</h4>
	</div>
	<div id="results_panel" class="panel-collapse in">

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
                    <div class="btn-toolbar">
                        <label class="btn btn-primary btn-sm" for="file">
				            <span ng-show="order.file.url==null">${ui.message("labtrackingapp.addPDF")}</span>
				            <span ng-show="order.file.url!=null">${ui.message("labtrackingapp.replacePDF")}</span>
				            <i class="glyphicon glyphicon-open" aria-hidden="true"></i>
				        </label>
                      <button type="button" class="btn btn-primary btn-sm" ng-show="order.file.url!=null" ng-click="removePdf()">${ui.message("labtrackingapp.removePDF")} <i class="glyphicon glyphicon-remove" aria-hidden="true"></i></button>
                      <button type="button" class="btn btn-primary btn-sm" ng-show="order.file.url!=null" ng-click="downloadPdf()">${ui.message("labtrackingapp.downloadPDF")} <i class="glyphicon glyphicon-download" aria-hidden="true"></i></button>
				        <form name="resultsForm" id="resultsForm">
					      <input type="file"  name="file" id="file" ng-show="0"
                                 accept="application/pdf" ngf-select="uploadPdf(${'$'}file)"
                                 ngf-model-invalid="errorFile">
                        </form>
                        <span ng-if="order.file.label">{{order.file.label}}</span>
                    </div>
				</div>
			</div>
		</div>

	</div>
</div>