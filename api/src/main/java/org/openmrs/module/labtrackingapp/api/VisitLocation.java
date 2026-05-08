package org.openmrs.module.labtrackingapp.api;

import org.openmrs.Location;

public class VisitLocation {

    private Location location;

    private Location nearestVisitLocation;

    public VisitLocation(Location location) {
        this.location = location;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Location getNearestVisitLocation() {
        return nearestVisitLocation;
    }

    public void setNearestVisitLocation(Location nearestVisitLocation) {
        this.nearestVisitLocation = nearestVisitLocation;
    }
}
