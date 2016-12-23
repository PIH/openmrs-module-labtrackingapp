
<div class="panel panel-default">
  <div class="panel-heading">
    <h4 class="panel-title">
      <a data-toggle="collapse" href="#order_panel">${ui.message("labtrackingapp.orderdetailslabel")}</a>
    </h4>
  </div>
  <div id="order_panel" class="panel-collapse ">
    <div class="panel-body">      
      <div class="row">
        <label class="control-label form-control-static text-right col-sm-3">Date of Initial Consult</label>
        <div class="col-sm-9">
          <p class="form-control-static">{{order.requestDate.value | date : 'shortDate'}}</p>
        </div>
      </div>
      <div class="row">
        <label class="control-label form-control-static text-right col-sm-3">${ui.message("labtrackingapp.proceduresitelabel")}</label>
        <div class="col-sm-9">
          <p class="form-control-static">{{order.procedure.display}}</p>
        </div>
      </div>
    </div>
  </div>
</div>


