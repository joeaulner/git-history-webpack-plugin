import _ from 'lodash';
import childComponent from './child-component';

export default function component() {
    let element = document.createElement('div');
    element.innerHTML = _.join(['Hello', 'webpack', 'plugin'], ' ');
    element.appendChild(childComponent());
    return element;
}

document.body.appendChild(component());
