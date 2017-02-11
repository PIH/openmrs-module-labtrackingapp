${ui.includeFragment("labtrackingapp", "libs")}
<% ui.decorateWith("appui", "standardEmrPage") %>

${ui.includeFragment("coreapps", "patientHeader", [patient: patient])}

<style>
.info-container {
    display: inline;
    float: left;
    width: 35.41667%;
    margin: 0 1.04167%;
}

.info-header {
    border-bottom: 6px solid #501d3d;
}

.info-section {
    display: inline;
    float: left;
    width: 97.91667%;
    margin: 0 1.04167%;
    margin: 5px;
    margin-top: 10px;
}

.info-header i {
    font-size: 1.3em;
    color: #501d3d;

}

.info-header h3 {
    display: inline-block;
    font-family: "OpenSansBold";
    font-size: 1em;
    margin: 0;
}

.info-body {
    background: #F9F9F9;
    border: 1px solid #eee;
    padding: 5px;
    color: #003f5e;
}
</style>

<div class="container">
    <div class="info-container column">
        <div class="info-section">
            <div class="info-header">
                <i class="icon-beaker"></i>

                <h3>PATHOLOGY</h3>
                <i class="icon-share-alt edit-action right" title="Edit"
                   onclick="location.href = 'labtrackingViewQueue.page?patientId=${patient.uuid}';"></i>
            </div>

            <div class="info-body">

                <% if (orders.size() == 0) { %>
                NO ORDERS TO SHOW
                <% } %>

                <ul>
                    <% orders.each { ord -> %>
                <li><strong>${ord.value.getAt('procedures').size()} Procedure${ord.value.getAt('procedures').size() == 1 ? "" : "s"} - ${ord.value.getAt('procedures')}</strong></li>
                    <ul>
                        <li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${ord.value.getAt('requestDate').format('MM/dd/yy')} requested</li>
                        <li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${ord.value.getAt('sampleDate') == null ? "Not" : ord.value.getAt('sampleDate').format('MM/dd/yy')} taken</li>
                        <li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${ord.value.getAt('resultDate') == null ? "No" : ord.value.getAt('resultDate').format('MM/dd/yy')} results</li>
                    </ul>
                    <% } %>
            </div>
        </div>
    </div>
</div>
