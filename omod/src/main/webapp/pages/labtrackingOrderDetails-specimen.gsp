<style>
    .labtracking_datebox{
        margin-top:0px;
    }
	#procedure option{
		white-space: pre-wrap;
	}
</style>


<div class="panel panel-default">
	<div class="panel-heading">
		<h4 class="panel-title">
			<a data-toggle="collapse" href="#specimen_panel">${ui.message("labtrackingapp.pathologyspecimendetailslabel")}</a>
		</h4>
	</div>
	<div id="specimen_panel" class="panel-collapse in">
		<div class="panel-body">
            <form class="form-horizontal">
                <div class="row">
                    <div class="col-sm-3 text-right">${ui.message("labtrackingapp.orderdetails.sampledatelabel")}</div>
					<div class="col-md-9">
						<div class='input-group date' id='date_of_procedure'>
							<input type="text" class="form-control" uib-datepicker-popup="{{procedureDateBoxOptions.format}}" popup-placement="bottom"
								   ng-model="order.sampleDate.value" is-open="procedureDateBoxOptions.opened"
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
				<div class="form-group">
					<label class="control-label col-sm-3" for="accessionNumber">${ui.message("labtrackingapp.accessionNumber")}</label>
					<div class="col-sm-9">
						<input type='text' class="form-control" id="accessionNumber" ng-model="order.accessionNumber.value"  />
					</div>
				</div>
				<div class="form-group top-buffer">
					<label class="col-sm-3 text-right" for="location">${ui.message("labtrackingapp.orderdetails.locationlabel")}</label>
					<div class="col-sm-9">
					    <select class="form-control" id="location" type="text" ng-model="order.locationWhereSpecimenCollected"  ng-options="a as a.label for a in locations | orderBy:'label' track by a.value" class="form-control"></select>
					</div>
				</div>
				<div class="form-group">
					<label class="control-label col-sm-3" for="surgeon">${ui.message("labtrackingapp.orderdetails.attendingsurgeonlabel")}</label>
					<div class="col-sm-9">
						<select id="surgeon" type="text" ng-model="order.surgeon"  ng-options="a as a.label for a in providers | orderBy:'label' track by a.value" class="form-control"></select>
					</div>
				</div>
				<div class="form-group">
					<label class="control-label col-sm-3" for="resident">${ui.message("labtrackingapp.orderdetails.residentlabel")}</label>
					<div class="col-sm-9">
						<select id="resident" type="text" ng-model="order.resident"  ng-options="a as a.label for a in providers | orderBy:'label' track by a.value"  class="form-control"></select>
					</div>
				</div>
				<div class="form-group">
					<label class="control-label col-sm-3" for="mdtonotify">${ui.message("labtrackingapp.orderdetails.mdtonotifylabel")}</label>
					<div class="col-sm-9">
						<input type='text' class="form-control" id="mdtonotify" ng-model="order.mdToNotify.value"  />
					</div>
				</div>
                <div class="form-group">
                   <label for="procedure" class="control-label col-sm-3">${ui.message("labtrackingapp.proceduresitelabel")}</label>
                   <div class="col-sm-4">
                      <div class="panel panel-default">
                         <div class="panel-heading">${ui.message("labtrackingapp.proceduresAvailable")}</div>
                         <div class="panel-body">
                            <select id="procedure" class="form-control" multiple
                               ng-options="item as item.label for item in procedures | orderBy:'label' track by item.value "
                               ng-model="selectedProcedures" ></select>
                         </div>
                      </div>
                   </div>
                   <div class="col-sm-1">
                      <p>&nbsp;</p>
                      <button class="btn button-wrapper" type="button" ng-disabled="order.proceduresForSpecimen.length > 2" ng-click="addProcedure()"><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>
                      <p>&nbsp;</p>
                      <button class="btn button-wrapper" type="button" ng-disabled="order.proceduresForSpecimen.length == 0" ng-click="removeProcedure()"><span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span></button>
                   </div>
                   <div class="col-sm-4">
                      <div class="panel panel-default">
                         <div class="panel-heading">${ui.message("labtrackingapp.proceduresSelected")}</div>
                         <div class="panel-body">
                              <select id="procedure" class="form-control" multiple
                                 ng-options="item as item.label for item in order.proceduresForSpecimen | orderBy:'label' track by item.value "
                                 ng-model="tempProcedures" ></select>
                         </div>
                      </div>
                   </div>
                </div>

				<div class="form-group">
					<label for="procedurenoncodedforspecimen" class="control-label col-sm-3">${ui.message("labtrackingapp.procedureNonCoded")}</label>
					<div class="col-sm-9">
						<input type="text" class="form-control" id="procedurenoncodedforspecimen" placeholder="" ng-model="order.procedureNonCodedForSpecimen.value"></input>
					</div>
				</div>
				<div class="form-group">
					<label class="control-label col-sm-3" for="urgentreviewlabel">${ui.message("labtrackingapp.orderdetails.urgentreviewlabel")}</label>
					<div class="col-sm-9">
						<div class="btn-group btn-toggle">
							<button class="btn btn-lg btn-default" ng-class="{'btn-danger': order.urgentReview.value=='3cd6f600-26fe-102b-80cb-0017a47871b2'}" ng-click="order.urgentReview.value='3cd6f600-26fe-102b-80cb-0017a47871b2'">Yes</button>
							<button class="btn btn-lg btn-default" ng-class="{'btn-primary': order.urgentReview.value!='3cd6f600-26fe-102b-80cb-0017a47871b2'}" ng-click="order.urgentReview.value=''">No</button>
						</div>
					</div>
				</div>
				<div class="form-group">
					<label class="control-label col-sm-3"  for="postopdiagnosis">${ui.message("labtrackingapp.orderdetails.postopdiagnosislabel")}</label>
					<div class="col-sm-9">
                    <input type="text" ng-model="order.postopDiagnosis.diagnosis"  class="form-control"
                        uib-typeahead="item as item.label for item in alldiagnoses | filter:{label:${'$viewValue'}} | limitTo:8"  />
					</div>
				</div>
				<div class="form-group">
					<label class="control-label col-sm-3"  for="clinicalhistory">${ui.message("labtrackingapp.clinicalhistorylabel")}</label>
					<div class="col-sm-9">
						<textarea class="form-control" id="clinicalhistory" ng-model="order.clinicalHistoryForSpecimen.value"></textarea>
					</div>
				</div>
				<div class="form-group">
					<label class="control-label col-sm-3">${ui.message("labtrackingapp.orderdetails.specimandetailslabel")}</label>
					<div class="col-sm-9">
						<div class="form-group" ng-repeat="a in concepts.specimenDetails">
							<label class="control-label col-sm-1">{{${'$'}index+1 }}.</label>
							<div class="col-sm-11">
								<input type="text" class="form-control" ng-model="order.specimenDetails[${'$'}index].value"></input>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>
