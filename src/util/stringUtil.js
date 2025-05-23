export const getModifiedRowDifference = (newRow, oldRow) => {
    let changes = '';

    for (let key in newRow) {
        if (newRow.hasOwnProperty(key) && oldRow.hasOwnProperty(key)) {
            const oldValue = oldRow[key];
            const newValue = newRow[key];

            // Check if the property is an object and has a 'name' attribute
            if (typeof oldValue === 'object' && typeof newValue === 'object' && oldValue !== null && newValue !== null) {
                if (oldValue.name !== newValue.name) {
                    changes += `- ${key.toUpperCase()} from '${oldValue.name}' to '${newValue.name}'\n`;
                }
            }
            // Updating from null to an object
            else if (oldValue === null && typeof newValue === 'object' && newValue !== null) {
                changes += `- ${key.toUpperCase()} from NULL to '${newValue.name}'\n`;
            }
            else if (oldValue !== newValue) {
                changes += `- ${key.toUpperCase()} from '${oldValue}' to '${newValue}'\n`;
            }
        }
    }

    return changes.trim(); // Remove the trailing newline
}

export const getLoginErrorByStatus = (statusCode) => {
    let text = statusCode + ": An error occurred, please try again later!";
    if (statusCode === 400) {
        text = statusCode + ": Bad request.";
    }
    if (statusCode === 401) {
        text = statusCode + ": You provided an incorrect password.";
    }
    if (statusCode === 404) {
        text = statusCode + ": This user does not exist.";
    }
    if (statusCode === 405) {
        text = statusCode + ": User is inactive and must be activated by an admin.";
    }
    return text;
}