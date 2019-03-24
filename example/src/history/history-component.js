export default function historyComponent(filename) {
    const element = document.createElement('div');
    import('./git-history.js').then((module) => {
        const entry = document.createElement('div');
        entry.innerHTML = `<br />${filename}`;
        module.default[filename].split(/\n+/).forEach((str) => {
            const field = document.createElement('div');
            field.innerHTML = str;
            entry.appendChild(field);
        });
        element.appendChild(entry);
    });
    return element;
}
