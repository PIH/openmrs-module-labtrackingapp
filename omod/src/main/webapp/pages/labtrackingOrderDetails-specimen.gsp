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
					<label class="control-label form-control-static col-sm-3">${ui.message("labtrackingapp.orderdetails.sampledatelabel")}</label>
					<div class="col-sm-9">
						<p class="form-control-static">{{(order.sampleDate.value==null?"New":order.sampleDate.value) | date : 'shortDate'}}</p>
					</div>
				</div>
				<div class="form-group">
					<label class="control-label form-control-static col-sm-3" for="proc_location">${ui.message("labtrackingapp.orderdetails.locationlabel")}</label>
					<div class="col-sm-9">
						<input type="text" ng-model="order.locationWhereSpecimenCollected"  uib-typeahead="loc as loc.label for loc in locations| filter:{label:${'$viewValue'}} | limitTo:8" class="form-control" typeahead-editable="false" />
					</div>
				</div>
				<div class="form-group">
					<label class="control-label col-sm-3" for="surgeon">${ui.message("labtrackingapp.orderdetails.attendingsurgeonlabel")}</label>
					<div class="col-sm-9">
						<select id="surgeon" type="text" ng-model="order.surgeon"  ng-options="a as a.label for a in providers | orderBy:'label' track by a.value" class="form-control"></select>
						order.surgeon={{order.surgeon | json}}
					</div>
				</div>
				<div class="form-group">
					<label class="control-label col-sm-3" for="resident">${ui.message("labtrackingapp.orderdetails.residentlabel")}</label>
					<div class="col-sm-9">
						<select id="resident" type="text" ng-model="order.resident"  ng-options="a as a.label for a in providers | orderBy:'label' track by a.value"  class="form-control"></select>
						order.resident={{order.resident | json}}
					</div>
				</div>
				<div class="form-group">
					<label class="control-label col-sm-3" for="mdtonotify">${ui.message("labtrackingapp.orderdetails.mdtonotifylabel")}</label>
					<div class="col-sm-9">
						<input type='text' class="form-control" id="mdtonotify" ng-model="order.mdToNotify.value"  />
					</div>
				</div>
				<div class="form-group">
					<label class="control-label col-sm-3" for="procedure" >${ui.message("labtrackingapp.proceduresitelabel")}</label>
					<div class="col-sm-9">
						<select id="procedure" class="form-control" multiple
                ng-options="item as item.label for item in procedures | orderBy:'label' track by item.value"
                ng-model="order.proceduresForSpecimen" ></select>
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
						<select class="form-control" id="postopdiagnosis"
                    ng-options="item as item.label for item in diagnoses | orderBy:'label' track by item.value "
                    ng-model="order.postopDiagnosis.diagnosis"></select>
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