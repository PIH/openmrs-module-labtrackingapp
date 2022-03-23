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
                    <p class="form-control-static">{{order.sampleDate.value | date : 'd-MMM-yy'}}</p>
                </div>
            </div>
            <div class="row">
                <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderNumberLabel")}</label>
                <div class="col-sm-9">
                    <p class="form-control-static">{{order.orderNumber.value}}</p>
                </div>
            </div>
            <div class="row">
                <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.proceduresitelabel")}</label>
                <div class="col-sm-9">
                    <p class="form-control-static" ng-repeat="a in order.procedures | orderBy:'label'" >{{ a.label }}</p>
                </div>
            </div>
            <div class="row">
                <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.procedureNonCoded")}</label>
                <div class="col-sm-9">
                    <p class="form-control-static">{{order.procedureNonCoded.value}}</p>
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
                    <p class="form-control-static" >{{ order.clinicalHistoryForSpecimen.value }}</p>
                </div>
            </div>
            <div class="row">
                <label class="control-label form-control-static text-right col-sm-3">${ ui.message("labtrackingapp.orderdetails.sampledatelabel") }</label>
                <div class="col-sm-9">
                    <p class="form-control-static">{{order.sampleDate.value | date : 'd-MMM-yy'}}</p>
                </div>
            </div>
            <div class="row">
                <label class="form-control-static text-right col-sm-3" for="location">${ui.message("labtrackingapp.orderdetails.locationlabel")}</label>
                <div class="col-sm-9">
                    <p class="form-control-static" id="location">{{order.locationWhereSpecimenCollected.label}}</p>
                </div>
            </div>
            <div class="row">
                <label class="form-control-static text-right col-sm-3" for="surgeon">${ui.message("labtrackingapp.orderdetails.attendingsurgeonlabel")}</label>
                <div class="col-sm-9">
                    <p class="form-control-static" id="surgeon">{{ order.surgeon.label }}</p>
                </div>
            </div>
            <div class="row">
                <label class="form-control-static text-right col-sm-3" for="resident">${ui.message("labtrackingapp.orderdetails.residentlabel")}</label>
                <div class="col-sm-9">
                    <p class="form-control-static" id="resident">{{ order.resident.label }}</p>
                </div>
            </div>
            <div class="row">
                <label class="form-control-static text-right col-sm-3" for="mdtonotify">${ui.message("labtrackingapp.orderdetails.mdtonotifylabel")}</label>
                <div class="col-sm-9">
                    <p class="form-control-static" id="mdtonotify">{{ order.mdToNotify.value }}</p>
                </div>
            </div>
            <div class="row">
                <label class="form-control-static text-right col-sm-3" for="phoneNumberForClinician">${ui.message("labtrackingapp.orderdetails.phoneNumberForClinician")}</label>
                <div class="col-sm-9">
                    <p class="form-control-static" id="phoneNumberForClinician">{{ order.phoneNumberForClinician.value }}</p>
                </div>
            </div>
            <div class="row">
                <label class="form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.suspectedCancer")}</label>
                <div class="col-sm-9">
                    <div class="btn-group btn-toggle">
                        <button class="btn btn-lg btn-default" ng-class="{'btn-danger': order.suspectedCancer.value=='3cd6f600-26fe-102b-80cb-0017a47871b2'}">${ui.message("uicommons.yes")}</button>
                        <button class="btn btn-lg btn-default" ng-class="{'btn-primary': order.suspectedCancer.value!='3cd6f600-26fe-102b-80cb-0017a47871b2'}">${ui.message("uicommons.no")}</button>
                    </div>
                </div>
            </div>
            <div class="row">
                <label class="form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.urgentreviewlabel")}</label>
                <div class="col-sm-9">
                    <div class="btn-group btn-toggle">
                        <button class="btn btn-lg btn-default" ng-class="{'btn-danger': order.urgentReview.value=='3cd6f600-26fe-102b-80cb-0017a47871b2'}">${ui.message("uicommons.yes")}</button>
                        <button class="btn btn-lg btn-default" ng-class="{'btn-primary': order.urgentReview.value!='3cd6f600-26fe-102b-80cb-0017a47871b2'}">${ui.message("uicommons.no")}</button>
                    </div>
                </div>
            </div>
            <div class="row">
                <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.postopdiagnosislabel")}</label>
                <div class="col-sm-9">
                    <p class="form-control-static" >
                        {{formatDiagnosis(order.postopDiagnosis.diagnosis)}}
                    </p>
                </div>
            </div>
            <div class="row">
                <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.specimandetailslabel")}</label>
                <div class="col-sm-9">
                    <div class="form-group" ng-repeat="a in concepts.specimenDetails">
                        <div class="col-sm-12">
                            <p ng-if="order.specimenDetails[${'$'}index].value" class="form-control-static" >{{${'$'}index+1 }}. {{ order.specimenDetails[${'$'}index].value }}</p>
                        </div>
                    </div>
                </div>
            </div>
		</div>
	</div>
</div>


