import React, { Component } from 'react';
import { Card, Icon, Pagination, Checkbox, Row, Col,message } from 'antd'
import { connect } from 'react-redux';
import { communicateServices, taskServices } from '../lib/index';
import { Button } from 'antd/lib/radio';

class PaperTask extends Component {

    constructor(props) {
        super(props)
        this.state = {
            uId: this.props.uId,
            quesList: [],
            que: [],
            queIds: [],
            selectOptions: [],
            queCount: 0,
            paperId: this.props.paperId,
            question:[],
        }
    }
    componentDidMount() {
        this.loadData()
    }
    loadData() {
        taskServices.startExerciseByPId({ pId: this.props.paperId }).then((ret) => {
            this.setState({
                quesList: ret.data.ques, queCount: ret.data.queCount,
                que: ret.data.ques[0]
            })
            console.log(this.state.que)
        }).catch((err) => {
        })
    }
    onChange(page) {
        const question = this.state.question
        question.push(this.state.que)
        this.setState({ question: question, que: this.state.quesList[page - 1] })
    }
    selectOption(checkedValues) {
        const selectOptions = this.state.selectOptions
        selectOptions.push(checkedValues)
        this.setState({ selectOptions: selectOptions })
    }
    onSubmit(){
        const question = this.state.question
        const queIds = this.state.queIds
        question.push(this.state.que)
        this.setState({ question: question})
        question.map((value,index)=>{
            value.map((item,key)=>{
                queIds.push(item.queId)
            })
        })
        const params = {
            uId : this.state.uId,
            paperId : this.state.paperId,
            queIds : queIds,
            selectAnswerIds : this.state.selectOptions
        }
        taskServices.submitAnswer(params).then((ret)=>{
            message.success("提交成功！")
            console.log(ret)
            window.location.href="/"
        }).catch((err)=>{
            message.error("失败！")
        })
    }
    render() {
        return (
            <div style={{ padding: '20px 0px', width: '70%', minHeight: '442px', margin: 'auto' }}>
                <div style={{ backgroundColor: '#fff', padding: '20px' }}>
                    {this.state.que.map((item, keys) => {
                        return (
                            <Card key={item.queId}
                                title={<h2>{item.queContent}</h2>}
                                extra={<a onClick={() => this.props.history.goBack()}>返回题库</a>}
                                style={{ width: '100%', height: '100%' }}>
                                <Checkbox.Group onChange={this.selectOption.bind(this)}>

                                    <div key={keys}>
                                        {item.options.map((option, optionIndex) => {
                                            return (
                                                <Row key={optionIndex}>
                                                    <Col span={8}><Checkbox value={option.opId}>{option.description}</Checkbox></Col>
                                                </Row>
                                            )
                                        })}
                                    </div>
                                    </Checkbox.Group>

                             </Card>
                        )
                            })}
                    <div style={{display:'flex',justifyContent:'flex-end',paddingTop: '20px'}}>
                        <Pagination
                            style={{ paddingRight: '20px' }}
                            onChange={this.onChange.bind(this)}
                            defaultPageSize={1}
                            defaultCurrent={1}
                            total={this.state.queCount} />
                        <Button onClick={() => this.onSubmit()} >提交</Button>
                    </div>
                    
                </div>


            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        uId: state.Session.User.id
    }
}
PaperTask = connect(mapStateToProps)(PaperTask)
export default PaperTask;