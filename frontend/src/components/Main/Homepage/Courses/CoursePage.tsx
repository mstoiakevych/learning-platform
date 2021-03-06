import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {authAxios} from "../../../../utils/axios";
import {Course} from "../../../../types/course";
import {Request} from "../../../../types/request";
import Modules from "./Modules/Modules";
import {Button, Modal, Input, Menu, Spin, Form, Badge, Drawer, List, Avatar, Collapse} from "antd";
import {isAuthor} from "../../../../utils/functions";
import {useTypedSelector} from "../../../../hooks/useTypedSelector";
import {useActions} from "../../../../hooks/useActions";
import {useHistory} from "react-router-dom";
import {ExclamationCircleOutlined, CheckOutlined, CloseOutlined} from "@ant-design/icons";

import "./CoursePage.css";

const {SubMenu} = Menu;
const {TextArea} = Input;
const {Panel} = Collapse;

const CoursePage = () => {

        const {id}: any = useParams()
        const [course, setCourse] = useState<Course | null>(null)
        let [author, SetAuthor] = useState(false)
        const [visible, setVisible] = useState(false);

        const {requests, loading} = useTypedSelector(state => state.requests)
        const {updateCourse, deleteCourse, acceptCourseRequest, deleteCourseRequest, fetchCourseRequests} = useActions()

        const history = useHistory();

        useEffect(() => {
            authAxios.get<Course>(`/courses/${id}/`).then(res => {
                setCourse(res.data)

                if (isAuthor(res.data)) {
                    SetAuthor(true)
                    fetchCourseRequests(id)
                }
            })
        }, [])

        const acceptRequest = (request: Request) => {
            acceptCourseRequest(id, request.id)
        }

        const deleteRequest = (request: Request) => {
            deleteCourseRequest(id, request.id)
        }

        const showDrawer = () => {
            setVisible(true)
        }

        const onClose = () => {
            setVisible(false)
        }

        const update = (values: any) => {
            let data = {...values}
            delete data.code
            delete data.students
            updateCourse(id, data)
        }

        const del = () => {
            Modal.confirm({
                title: 'Delete course?',
                icon: <ExclamationCircleOutlined/>,
                content: 'Data could not be recovered',
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk() {
                    deleteCourse(id)
                }
            })
        }

        if (!course) {
            return <div className="spinner">
                <Spin/>
            </div>
        }

        return (
            <>
                {author &&
                <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '20px'}}>
                    <Badge count={requests?.length} style={{backgroundColor: '#2db7f5'}}>
                        <Button size='middle' onClick={showDrawer}>Requests</Button>
                    </Badge>
                </div>}
                <Drawer
                    title="Requests"
                    placement="right"
                    onClose={onClose}
                    visible={visible}
                    width={"35vw"}
                    closable
                >
                    <List
                        itemLayout="vertical"
                        dataSource={requests}
                        renderItem={request => (
                            <List.Item>
                                {!loading ? <List.Item.Meta
                                    avatar={
                                        <Avatar style={{width: "55px", height: "55px"}}
                                                src={request.student.photo ? request.student.photo
                                                    : "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"}/>
                                    }
                                    title={
                                        <div>
                                            <div>{request.student.username ? request.student.username : `user${request.id}`}</div>
                                            <div className="float-right">
                                                <Button shape="circle" className="mx-1"
                                                        onClick={() => acceptRequest(request)}>
                                                    <CheckOutlined
                                                        style={{verticalAlign: "baseline", color: "#2db7f5"}}/>
                                                </Button>

                                                <Button shape="circle" className="mx-1" danger
                                                        onClick={() => deleteRequest(request)}>
                                                    <CloseOutlined
                                                        style={{verticalAlign: "baseline", paddingBottom: "4px"}}/>
                                                </Button>

                                            </div>
                                        </div>}
                                    description={request.student.email}
                                >
                                </List.Item.Meta> : <div className="spinner"><Spin/></div>}
                            </List.Item>
                        )}
                    />
                </Drawer>
                <Collapse defaultActiveKey={['1']} className="m-b-10">
                    <Panel key="1" header="Course details">
                        <Form
                            style={{paddingTop: "40px"}}
                            name="basic"
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={update}
                        >
                            <Form.Item
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input course name!',
                                    },
                                ]}
                                initialValue={course.name}
                            >
                                <Input placeholder="Name" addonBefore="Name" disabled={!author}
                                       className="detail-input"/>
                            </Form.Item>


                            <Form.Item
                                name="subject"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input course subject!',
                                    },
                                ]}
                                initialValue={course.subject}
                            >
                                <Input placeholder="Subject" addonBefore="Subject"
                                       disabled={!author}
                                       className="detail-input"/>
                            </Form.Item>

                            <Form.Item
                                name="section"
                                initialValue={course.section}
                            >
                                <Input placeholder="Section" addonBefore="Section"
                                       disabled={!author}
                                       className="detail-input"/>
                            </Form.Item>

                            <Form.Item
                                name="audience"
                                initialValue={course.audience}
                            >
                                <Input placeholder="Audience" addonBefore="Audience" value={course.audience}
                                       disabled={!author}
                                       className="detail-input"/>
                            </Form.Item>

                            <Form.Item
                                name="code"
                                initialValue={course.code}
                            >
                                <Input placeholder="Code" addonBefore="Code"
                                       disabled
                                       className="detail-input"/>
                            </Form.Item>
                            <Form.Item
                                name="students"
                                initialValue={course.students.length}
                            >
                                <Input placeholder="Number of students" addonBefore="Students"
                                       disabled className="detail-input"/>
                            </Form.Item>

                            <Form.Item
                                name="description"
                                initialValue={course.description}
                            >
                                <TextArea disabled={!author} autoSize={{minRows: 6}} showCount maxLength={300}
                                          placeholder="Description"/>
                            </Form.Item>

                            {author && <Menu mode="inline" style={{width: 256}}>
                                <SubMenu key="sub1" title="Option">
                                    <Menu.Item key="1" className="menu-item" style={{padding: 0}}>
                                        <Button type="primary" block htmlType="submit">
                                            Save
                                        </Button>
                                    </Menu.Item>
                                    <Menu.Item key="2" className="menu-item" style={{padding: 0}} danger>
                                        <Button type="primary" danger block onClick={del}>
                                            Delete
                                        </Button>
                                    </Menu.Item>
                                </SubMenu>
                            </Menu>}
                        </Form>
                    </Panel>
                </Collapse>
                <Modules courseId={id} author={author}/>
            </>
        );
    }
;

export default CoursePage;
