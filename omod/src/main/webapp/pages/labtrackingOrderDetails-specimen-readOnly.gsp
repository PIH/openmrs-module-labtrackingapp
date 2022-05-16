<div class="panel panel-default">
    <div class="panel-heading">
        <h4 class="panel-title">
            <a data-toggle="collapse" href="#specimen_panel">${ui.message("labtrackingapp.pathologyspecimendetailslabel")}</a>
        </h4>
    </div>
    <div id="specimen_panel" class="panel-collapse in" ng-if="order.processedDate.value">
        <div class="panel-body">
            <div class="row">
                <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.processedDatelabel")}</label>
                <div class="col-sm-9">
                    <p class="form-control-static">{{order.processedDate.value | date : 'd-MMM-yy'}}</p>
                </div>
            </div>
            <div class="row">
                <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.accessionNumber")}</label>
                <div class="col-sm-9">
                    <p class="form-control-static" >{{ order.accessionNumber.value }}</p>
                </div>
            </div>
            <div class="row top-buffer">
                <label class="form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.immunohistochemistrySentToBoston")}</label>
                <div class="col-sm-2">
                    <div class="btn-group btn-toggle">
                        <button class="btn btn-lg btn-default" ng-class="{'btn-danger': order.immunohistochemistrySentToBoston.value=='3cd6f600-26fe-102b-80cb-0017a47871b2'}">${ui.message("uicommons.yes")}</button>
                        <button class="btn btn-lg btn-default" ng-class="{'btn-primary': order.immunohistochemistrySentToBoston.value!='3cd6f600-26fe-102b-80cb-0017a47871b2'}">${ui.message("uicommons.no")}</button>
                    </div>
                </div>
                <div  class="col-sm-1 text-right" ng-show="order.immunohistochemistrySentToBoston.value=='3cd6f600-26fe-102b-80cb-0017a47871b2'">
                    <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.dateSentlabel")}:</label>
                </div>
                    <div class="col-sm-3">
                        <p class="form-control-static">{{order.dateImmunoSentToBoston.value | date : 'd-MMM-yy'}}</p>
                    </div>
            </div>
            <div class="row top-buffer">
                <label class="form-control-static text-right col-sm-3">${ui.message("labtrackingapp.orderdetails.specimenSentToPaP")}</label>
                <div class="col-sm-2">
                    <div class="btn-group btn-toggle">
                        <button class="btn btn-lg btn-default" ng-class="{'btn-danger': order.specimenSentToPaP.specimenSent.value=='3cd6f600-26fe-102b-80cb-0017a47871b2'}">${ui.message("uicommons.yes")}</button>
                        <button class="btn btn-lg btn-default" ng-class="{'btn-primary': order.specimenSentToPaP.specimenSent.value!='3cd6f600-26fe-102b-80cb-0017a47871b2'}">${ui.message("uicommons.no")}</button>
                    </div>
                </div>
                <div  class="col-sm-1" ng-show="order.specimenSentToPaP.specimenSent.value=='3cd6f600-26fe-102b-80cb-0017a47871b2'">
                    <label class="control-label form-control-static text-right">${ui.message("labtrackingapp.orderdetails.dateSentlabel")}: </label>
                </div>
                <div class="col-sm-2" ng-show="order.specimenSentToPaP.specimenSent.value=='3cd6f600-26fe-102b-80cb-0017a47871b2'">
                    <p class="form-control-static">{{ order.specimenSentToPaP.dateSent.value | date : 'd-MMM-yy'}}</p>
                </div>
                <div  class="col-sm-1" ng-show="order.specimenSentToPaP.specimenSent.value=='3cd6f600-26fe-102b-80cb-0017a47871b2'">
                    <label class="control-label form-control-static text-right">${ui.message("labtrackingapp.orderdetails.dateReturnedlabel")}: </label>
                </div>
                <div class="col-sm-2" ng-show="order.specimenSentToPaP.specimenSent.value=='3cd6f600-26fe-102b-80cb-0017a47871b2'">
                    <p class="form-control-static">{{ order.specimenSentToPaP.dateReturned.value | date : 'd-MMM-yy'}}</p>
                </div>

            </div>
        </div>
    </div>
</div>
