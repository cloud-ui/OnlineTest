import React, {Component} from 'react';

class UserManage extends Component {
    key = 'userManager';
    componentWillMount() {
        this.props.popKey(this.key);
    }
    render() {
        return (
            <div>123</div>
        )
    }
}
export default UserManage;