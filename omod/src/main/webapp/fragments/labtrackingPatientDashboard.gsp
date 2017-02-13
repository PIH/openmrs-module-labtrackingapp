${ui.includeFragment("labtrackingapp", "libs")}

<% if (orders.values().size() > 0) { %>
    <div class="info-section">
        <div class="info-header">
            <i class="icon-beaker"></i>

            <h3>${ ui.message("labtrackingapp.pathology").toUpperCase() }</h3>
            <i class="icon-share-alt edit-action right" title="Edit"
               onclick="location.href = 'labtrackingViewQueue.page?patientId=${patient.uuid}';"></i>
        </div>

        <div class="info-body">
            <ul>
                <% orders.each { ord -> %>
            <li><strong>${ord.value.getAt('procedures').size()} ${ord.value.getAt('procedures').size() == 1 ? ui.message("labtrackingapp.procedure") : ui.message("labtrackingapp.procedures")} - ${ord.value.getAt('procedures')}</strong></li>
                <ul>
                    <li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${ord.value.getAt('requestDate').format('MM/dd/yy')} ${ ui.message("labtrackingapp.requested") }</li>
                    <li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${ord.value.getAt('sampleDate') == null ? ui.message("labtrackingapp.notTaken") : ord.value.getAt('sampleDate').format('MM/dd/yy') + " " + ui.message("labtrackingapp.taken") }</li>
                    <li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${ord.value.getAt('resultDate') == null ? ui.message("labtrackingapp.noResults") : ord.value.getAt('resultDate').format('MM/dd/yy') + " " + ui.message("labtrackingapp.results") }</li>
                </ul>
                <% } %>
        </div>
    </div>
<% } %>