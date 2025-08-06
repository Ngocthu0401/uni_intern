package com.internship.enums;

public enum ReportType {
    WEEKLY("Weekly Report"),
    MONTHLY("Monthly Report"), 
    FINAL("Final Report");
    
    private final String displayName;
    
    ReportType(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}