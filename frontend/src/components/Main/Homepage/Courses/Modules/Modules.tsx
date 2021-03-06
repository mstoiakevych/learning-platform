import React, {FC, useEffect, useRef, useState} from 'react';
import {useTypedSelector} from "../../../../../hooks/useTypedSelector";
import {useActions} from "../../../../../hooks/useActions";
import {Button, Drawer, Form, Input, List, notification, Spin} from "antd";
import {Link} from "react-router-dom";
import {PlusOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import {Module} from "../../../../../types/module";
import {RequestError} from "../../../../../types/error";

const {TextArea} = Input;


interface ModulesProps {
    courseId: number,
    author: boolean,
}

const Modules: FC<ModulesProps> = ({courseId, author}) => {
    const {modules, loading, error} = useTypedSelector(state => state.modules)
    const [visible, setVisible] = useState(false);

    const prevErrorRef = useRef<RequestError | null>();
    useEffect(() => {
        prevErrorRef.current = error
    })
    const prevError = prevErrorRef.current

    const {fetchModules, createModule} = useActions()

    useEffect(() => {
        fetchModules(courseId)
    }, [])

    const showDrawer = () => {
        setVisible(true)
    }

    const onClose = () => {
        setVisible(false)
    }

    const showError = () => {
        if (error) {
            notification.open({
                message: 'Error',
                icon: <ExclamationCircleOutlined style={{color: "#f5222d"}}/>,
                description: error.message,
            })
        }
    }

    const onSubmit = (values: any) => {
        const data: Partial<Module> = {...values}
        createModule(courseId, data)
        onClose()
    }

    function moduleInput() {
        return (
            <Form
                name="basic"
                initialValues={{
                    remember: true,
                }}
                onFinish={onSubmit}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input module name!',
                        },
                    ]}
                >
                    <Input type="text" placeholder="Name"/>
                </Form.Item>

                <Form.Item name="description">
                    <TextArea autoSize={{minRows: 6}} showCount maxLength={300} placeholder="Description"/>
                </Form.Item>

                <Form.Item className="float-right">
                    <Button type="default" className="ml-3" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="primary" className="mx-3" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        )
    }


    if (loading) {
        return <div className="spinner">
            <Spin/>
        </div>
    }

    if (prevError?.message !== error?.message) {
        showError()
    }

    return <>
        {author && <Button className="px-5 mr-3 float-right" type="primary" shape="round"
                            onClick={showDrawer}
                            icon={<PlusOutlined style={{verticalAlign: "baseline"}}/>}
                            size='large'>Create</Button>}

        <Drawer
            title="Enter module details"
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
            width={"35vw"}
        >
            {moduleInput()}
        </Drawer>
        <h1 style={{textAlign: 'center', fontSize: '2rem'}}>Modules</h1>
        <List
            itemLayout="horizontal"
            dataSource={modules}
            renderItem={module => (
                <List.Item>
                    <List.Item.Meta
                        title={<Link to={`/courses/${courseId}/modules/${module.id}`}>{module.name}</Link>}
                        description={module.description}
                    />
                </List.Item>
            )}
        />
    </>;
};

export default Modules;
