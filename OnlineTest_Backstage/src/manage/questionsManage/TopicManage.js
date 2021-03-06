import React, { Component } from 'react';
import { questionServices, config } from '../../lib'
import {Spin, Table, Input, Button, Icon, List, Card, Pagination, Col, Row, Tooltip, Dropdown, Menu } from 'antd'
import AddTopic from './AddTopic'
import ModifyTopic from './ModifyTopic'
import index from 'antd/lib/progress';
import Modal from 'antd/lib/modal/Modal';
const confirm = Modal.confirm;
class TopicManage extends Component {
    key = 'subject';
    constructor(props) {
        super(props);
        this.state = {
            table_loading: false,
            query: '',
            add_modal: false,
            topics: [],
            modify_modal: false,
            topicId: 0,
            total_count:0,
            currentPage:1,
            pageSize:6,
        }
    }
    componentWillMount() {
        this.props.popKey(this.key);
    }
    componentDidMount() {
        console.log(this.props.id)
        this.loadData();
    }
    loadData() {
        this.setState({ table_loading: true });
        const params = {
            subId: this.props.id,
            currentPage: this.state.currentPage,
            pageSize: this.state.pageSize,
            query: this.state.query
        };
        questionServices.getQueList(params).then((ret) => {
            console.log(ret)
            this.setState({ topics: ret.data.ques,total_count:ret.data.count, table_loading: false });
        }).catch((err) => {
            config.error('连接超时！');
            this.setState({ table_loading: false });
        });
    }
    onChange(page, pageSize) {
        this.setState({ currentPage: page }, () => this.loadData())
    }
    ergodicMap(value) {
        switch (value) {
            case 1: return '简单'
            case 2: return '中级'
            case 3: return '高级'
        }
    }
    selectIndex(value) {
        switch (value) {
            case 0: return 'A'
            case 1: return 'B'
            case 2: return 'C'
            case 3: return 'D'
        }
    }
    clickMenu(item, value) {
        var arr = item.key.split(",");
        console.log(item)
        if (arr[0] == ('modify')) {
            this.setState({ modify_modal: true, topicId: arr[1] })
        } else if (arr[0] == ('delete')) {

        }
    }
    itemMenu(value) {
        return (
            <Menu
                onClick={this.click}>
                <Menu.Item key="modify">
                    <Icon type="edit" />&nbsp;&nbsp;修改题目
                </Menu.Item>
                <Menu.Item key="delete">
                    <Icon type="delete" />&nbsp;&nbsp;删除题目
                </Menu.Item>
            </Menu>
        )
    }
    render() {
        return (
            <div style={{ margin: '20px 40px' }}>
            <Spin spinning={this.state.table_loading}>
                <div
                    style={{overflow:'hidden'}}
                >
                    <div
                        style={{ marginBottom: '20px' }}
                    >
                        <h1
                            style={{ display: 'inline-block', cursor: 'pointer' }} onClick={() => this.props.history.goBack()}>
                            <Icon style={{ fontSize: '22px' }} type="arrow-left" />
                            科目管理
                    </h1>
                        <Icon type="minus" />
                        <h2
                            style={{ display: 'inline-block' }}
                        >题目管理</h2>
                    </div>
                    <div
                        style={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                        <div>
                            <Input
                                size="large"
                                placeholder="题目名称"
                                onChange={(value) => this.setState({ query: value.target.value })}
                                style={{ width: '200px', marginRight: '20px' }}
                                onPressEnter={() => this.loadData()}
                            />
                            <Button icon="search" type="primary" onClick={() => this.loadData()}>搜索</Button>
                        </div>
                        <Button type="primary" onClick={() => this.setState({ add_modal: true })}><Icon type="plus" />新增题目</Button>
                    </div>
                    {this.state.topics.map((ques, quesIndex) => {
                        return (
                            <Card
                                key={quesIndex}
                                title={ques.queName}
                                style={{ width: '31%', float: 'left', margin: '12px 1% 12px 0px', minHeight: '205px' }}
                                extra={
                                    <Dropdown overlay={
                                        <Menu
                                            onClick={this.clickMenu.bind(this)}>
                                            <Menu.Item
                                                key={'modify,' + ques.id}
                                            >
                                                <Icon type="edit" />&nbsp;&nbsp;修改题目
                                        </Menu.Item>
                                            <Menu.Item key={'delete,' + ques.id}>
                                                <Icon type="delete" />&nbsp;&nbsp;删除题目
                                        </Menu.Item>
                                        </Menu>
                                    }>
                                        <Icon style={{ fontSize: '24px' }} type="ellipsis" /></Dropdown>}
                            >
                                <div
                                    style={{ margin: ' 12px 0' }}
                                >难度:&nbsp;{this.ergodicMap(ques.grade)}</div>
                                {ques.options.map((option, optionIndex) => {
                                    return (
                                        <div key={optionIndex}>
                                            <span>{this.selectIndex(optionIndex)}:&nbsp;</span>
                                            <span>{option.description}</span>
                                        </div>
                                    )
                                })}
                                <div
                                    style={{ margin: ' 12px 0' }}
                                >正确答案:&nbsp;{ques.rightAnswer}</div>
                            </Card>
                        )
                    })}
                    <AddTopic
                        subId={this.props.id}
                        visible={this.state.add_modal}
                        onCancel={() => this.setState({ add_modal: false })}
                        loadData={() => this.loadData()}
                        {...this.state}
                    />
                    <ModifyTopic
                        subId={this.props.id}
                        topicId={this.state.topicId}
                        visible={this.state.modify_modal}
                        onCancel={() => this.setState({ modify_modal: false })}
                        loadData={() => this.loadData()}
                        {...this.state}
                    />
                </div>
                <div>
                    <Pagination
                        pageSize={this.state.pageSize}
                        onChange={this.onChange.bind(this)}
                        style={{ textAlign: 'right' }}
                        current={this.state.currentPage} total={this.state.total_count} />
                </div>
                </Spin>
            </div>
        )
    }
}
export default TopicManage;