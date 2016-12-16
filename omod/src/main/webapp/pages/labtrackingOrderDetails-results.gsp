<div class="panel panel-default">
  <div class="panel-heading">
    <h4 class="panel-title">
    <a data-toggle="collapse" href="#results_panel">${ui.message("labtrackingapp.resultdetailslabel")}</a>
    </h4>
  </div>
  <div id="results_panel" class="panel-collapse collapse">
    <form class="form-horizontal">
      <div class="form-group">
        <label class="control-label col-sm-3" for="date_of_results">${ui.message("labtrackingapp.orderdetails.resultsdatelabel")}</label>
        <div class="col-sm-9">
          <div class='input-group date'>
            <input type='text' class="form-control" id="date_of_results"  value="8-Nov-2014"/>
            <span class="input-group-addon">
             <span class="glyphicon glyphicon-calendar"></span>
           </span>
         </div>
       </div>
     </div>

     <div class="form-group">
      <label class="control-label col-sm-3" for="notes">${ui.message("labtrackingapp.orderdetails.noteslabel")}</label>
      <div class="col-sm-9">
        <textarea class="form-control" id="notes"></textarea>
      </div>
    </div>


    <div class="form-group">
      <label class="control-label col-sm-3" for="upload_file">${ui.message("labtrackingapp.orderdetails.uploadfilelabel")}</label>
      <div class="col-sm-9">
        <input type="file" class="form-control" id="upload_file" /> <a href="">[TODO: file link here if exists]</a>
      </div>
    </div>

    <div class="form-group">
      <div class="col-sm-offset-2 col-sm-9 pull-right">
        <button type="button" class="btn btn-primary">${ui.message("uicommons.cancel")}</button>
        <button type="button" class="btn btn-default">${ui.message("uicommons.save")}</button>
      </div>
    </div>
  </form>
</div>
</div>
