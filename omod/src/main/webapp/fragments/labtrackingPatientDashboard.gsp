
<style>
    .small {
        font-size: 0.9em;
    }
    .smaller {
         font-size: 0.8em;
    }
</style>


<% if (orders.values().size() > 0) { %>
    <div class="info-section">
        <div class="info-header">
            <i class="icon-beaker"></i>

            <h3>${ ui.message("labtrackingapp.pathology").toUpperCase() }</h3>
            <i class="icon-share-alt edit-action right" title="Edit"
               onclick="location.href='${ui.pageLink("labtrackingapp", "labtrackingViewQueue", [ patientId: patient.id ])}';"></i>
        </div>

        <div class="info-body">
            <ul>
                <% orders.each { ord -> %>
                    <% ord.value.getAt('procedures').each { procedure -> %>
                        <li class="small"><strong>${procedure}</strong></li>
                    <% } %>
                        <ul>
                            <li class="smaller">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${ord.value.getAt('requestDate').format('MM/dd/yy')} ${ ui.message("labtrackingapp.requested") }</li>
                            <li class="smaller">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${ord.value.getAt('sampleDate') == null ? ui.message("labtrackingapp.notTaken") : ord.value.getAt('sampleDate').format('MM/dd/yy') + " " + ui.message("labtrackingapp.taken") }</li>
                            <li class="smaller">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${ord.value.getAt('resultDate') == null ? ui.message("labtrackingapp.noResults") : ord.value.getAt('resultDate').format('MM/dd/yy') + " " + ui.message("labtrackingapp.results") }</li>
                        </ul>
                        <li></li>
                <% } %>
            </ul>
        </div>
    </div>
<% } %>