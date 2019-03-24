import historyComponent from '../history/history-component';

export default function childComponent() {
    let element = document.createElement('div');
    element.appendChild(historyComponent(__filename));
    return element;
}
