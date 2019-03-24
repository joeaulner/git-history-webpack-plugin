import addons, { types } from '@storybook/addons';
import { STORY_RENDERED } from '@storybook/core-events';
import React from 'react';

const ADDON_ID = 'myaddon';
const PANEL_ID = `${ADDON_ID}/panel`;

class MyPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
        this.onStoryChange = this.onStoryChange.bind(this);
    }

    componentDidMount() {
        const {api} = this.props;
        api.on(STORY_RENDERED, this.onStoryChange);
    }

    componentWillUnmount() {
        const {api} = this.props;
        api.off(STORY_RENDERED, this.onStoryChange);
    }

    onStoryChange(id) {
        const {api} = this.props;
        const params = api.getParameters(id, 'myAddon');

        if (params && !params.disable) {
            const value = params.data;
            this.setState({ value });
        } else {
            this.setState({ value: undefined });
        }
    };

    render() {
        const {value} = this.state;
        const {active} = this.props;
        return active ? React.createElement('div', {children: value}) : null;
    }
}

addons.register(ADDON_ID, (api) => {
    const title = 'My Addon';
    const render = ({active}) => React.createElement(MyPanel, {
        api,
        active,
        key: PANEL_ID
    });

    addons.add(PANEL_ID, {
        type: types.PANEL,
        title,
        render
    });
});
