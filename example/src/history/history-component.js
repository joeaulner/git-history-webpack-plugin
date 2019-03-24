console.log(module.id);
console.log(__filename);

export default function historyComponent() {
    const element = document.createElement('div');
    import('./git-history.js').then((module) => {
        for (let filename in module.default) {
            const entry = document.createElement('div');
            entry.innerHTML = filename;
            element.appendChild(entry);
        }
    });
    return element;
}
