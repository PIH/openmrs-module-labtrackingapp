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
					<div class="row justify-content-start" ng-if="order.files.length" ng-repeat="f in order.files">
						<div class="col-sm-3">
							<iframe ng-if="f.value" ngf-src="f.value" width="100" height="100"></iframe>
							<a ng-if="f.url" href="{{ f.url }}">{{ f.label }}</a>
						</div>
						<div class="col-sm-9">
							<button type="button" class="btn btn-primary btn-sm" ng-click="downloadPdf()">${ui.message("labtrackingapp.downloadPDF")} <i class="glyphicon glyphicon-download" aria-hidden="true"></i></button>
							<button type="button" class="btn btn-primary btn-sm" ng-click="removePdf()">${ui.message("labtrackingapp.removePDF")} <i class="glyphicon glyphicon-remove" aria-hidden="true"></i></button>
							<br>
						</div>
					</div>
					<div class="btn-toolbar">
						<label class="btn btn-primary btn-sm" for="file">
							<span>${ui.message("labtrackingapp.addPDF")}</span>
							<i class="glyphicon glyphicon-open" aria-hidden="true"></i>
						</label>
						<form name="resultsForm" id="resultsForm">
							<input type="file"  name="file" id="file" ng-show="0"
								   accept="application/pdf"
								   ngf-select="uploadPdf(${'$'}files)"
								   ngf-multiple="true"
								   ngf-model-invalid="errorFile">
						</form>
					</div>
				</div>
			</div>
			<div class="row top-buffer">
				<label class="control-label col-sm-3 control-label text-right">${ui.message("labtrackingapp.orderdetails.confirmedCancer")}</label>
				<div class="col-sm-9">
					<div class="btn-group btn-toggle">
						<button class="btn btn-lg btn-default" ng-class="{'btn-danger': order.confirmedCancer.value=='3cd6f600-26fe-102b-80cb-0017a47871b2'}" ng-click="order.confirmedCancer.value='3cd6f600-26fe-102b-80cb-0017a47871b2'">${ui.message("uicommons.yes")}</button>
						<button class="btn btn-lg btn-default" ng-class="{'btn-primary': order.confirmedCancer.value=='3cd6f86c-26fe-102b-80cb-0017a47871b2'}" ng-click="order.confirmedCancer.value='3cd6f86c-26fe-102b-80cb-0017a47871b2'; order.confirmedDiagnosis.diagnosis=null">${ui.message("uicommons.no")}</button>
					</div>
				</div>
			</div>
			<div class="row top-buffer" ng-show="order.confirmedCancer.value=='3cd6f600-26fe-102b-80cb-0017a47871b2'">
				<label class="col-sm-3 col-form-label text-right">${ui.message("labtrackingapp.orderdetails.diagnosislabel")}</label>
				<div class="col-sm-9">
					<input  type="text"
							ng-model="order.confirmedDiagnosis.diagnosis"
							class="form-control"
							ng-required="false"
							uib-typeahead="item as item.label for item in searchDx(${'$viewValue'}) | limitTo:8"
							typeahead-min-length="2"
							typeahead-wait-ms="200"
							typeahead-loading="loadingDx"
							typeahead-no-results="noDxResults"/>
					<i ng-show="loadingDx" class="glyphicon glyphicon-refresh"></i>
					<div ng-show="noDxResults">
						<i class="glyphicon glyphicon-remove"></i>${ui.message("labtrackingapp.dx.notfound")}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
