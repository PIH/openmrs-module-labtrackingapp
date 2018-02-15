<div class="panel panel-default">
  <div class="panel-heading">
    <h4 class="panel-title">
      <a data-toggle="collapse" href="#debug_panel">DEBUG</a>
    </h4>
  </div>
  <div id="debug_panel" class="panel-collapse in">
    <div class="panel-body">      
      <div class="row">
        <pre>{{order.debug.message}}</pre>
        <pre> order.specimenDetailsEncounter.uuid = {{order.specimenDetailsEncounter.uuid}}</pre>
        <a target="_blank" href="/openmrs/ws/rest/v1/encounter/{{order.specimenDetailsEncounter.uuid}}?v=custom:(encounterProviders)">/openmrs/ws/rest/v1/encounter{{order.specimenDetailsEncounter.uuid}}</a>
      </div>
    </div>
  </div>
</div>