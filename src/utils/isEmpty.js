export function isEmpty(obj) {
    // Check if obj is an actual object and not null
    if (obj && typeof obj === 'object') {
        // Get all keys of the object
        const keys = Object.keys(obj);

        // If no keys, the object is empty
        if (keys.length === 0) {
            return true;
        }

        // Check each key
        return keys.every(key => {
            // Recursively check nested objects
            return isEmpty(obj[key]);
        });
    }

    // If not an object, it's not empty (considering the requirement)
    return false;
}
