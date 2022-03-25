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
        </div>
    </div>
</div>
