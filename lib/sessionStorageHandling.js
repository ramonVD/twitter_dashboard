
/*Returns undefined if the key isnt saved in session storage,
else it returns the json parsed value*/
export function valueInSessionStorage(keyName) {
    try {
        const value = window.sessionStorage.getItem(keyName);
        if (value === null) return undefined;
        return JSON.parse(value);
    } catch {
        return undefined;
    }
}