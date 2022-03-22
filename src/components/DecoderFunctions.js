function getStatus(statusCode) {
    let status = statusCode === "C" ? "Completed"
        : statusCode === "P" ? "In Progress"
            : statusCode === "I" ? "Issue"
                : "Not Started";

    return status;
}

function getDepartment(deptCode) {
    let dept = deptCode === "R" ? "Risk"
        : deptCode === "A" ? "Action"
            : deptCode === "I" ? "Issue"
                : "Decision";

    return dept
}

function getScopeType(scopeCode) {
    let scope = scopeCode === "F" ? "Functional"
        : scopeCode === "TE" ? "Technical"
            : scopeCode === "CO" ? "Conversion"
                : scopeCode === "G" ? "General"
                    : scopeCode === "CU" ? "Cutover"
                        : "Testing";

    return scope;
}

function getValue(valueCode) {
    let value = valueCode === 0 ? "TBD"
        : valueCode === 1 ? "Low"
            : valueCode === 2 ? "Medium"
                : valueCode === 3 ? "High"
                    : "Critical";

    return value;
}

function getEffort(effortCode) {
    let effort = effortCode === 0 ? "TBD"
        : effortCode === 1 ? "High"
            : effortCode === 2 ? "Medium"
                : "Low";

    return effort;
}

function getPriority(priorityCode) {
    let priority = priorityCode === 0 ? "TBD"
        : priorityCode < 3 ? "Low"
            : priorityCode < 8 ? "Medium"
                : priorityCode < 12 ? "High"
                    : "Critical";

    return priority;
}

function getApprovalStatus(approvalStatusCode) {
    let approvalStatus = approvalStatusCode === 0 ? "No" : "Yes";

    return approvalStatus;
}

export {
    getStatus,
    getDepartment,
    getScopeType,
    getValue,
    getEffort,
    getPriority,
    getApprovalStatus
}