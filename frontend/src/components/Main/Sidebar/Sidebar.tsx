import React, {useEffect, useState} from 'react';
import {Layout, Menu, Spin} from "antd";
import {
    DesktopOutlined, FileOutlined,
    ProfileOutlined,
    RiseOutlined,
    ScheduleOutlined,
    SnippetsOutlined
} from "@ant-design/icons";
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {useActions} from "../../../hooks/useActions";
import {Link, useHistory} from "react-router-dom"

const {Sider} = Layout;
const {SubMenu} = Menu;

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(true);
    const {authorCourses, studentCourses, loading, error} = useTypedSelector(state => state.courses)
    const {fetchAuthorMaterials} = useActions()
    const history = useHistory()

    useEffect(() => {
        fetchAuthorMaterials()
    }, [])


    if (loading) {
        return <div className="spinner">
            <Spin/>
        </div>
    }

    if (error) {
        if (error.code === 401) {
            history.push('/login')
            return null
        }

        return <h1 color="red">{error.message}</h1>
    }

    return (
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
            <div className="logo"/>
            <Menu theme="dark" mode="inline" selectable={false}>
                <Menu.Item key="2" icon={<DesktopOutlined/>}>
                    <Link to="" style={{textDecoration: 'none'}}>
                        Home
                    </Link>
                </Menu.Item>
                <Menu.Item key="1" icon={<RiseOutlined/>}>
                    <Link to="progress" style={{textDecoration: 'none'}}>
                        Progress
                    </Link>
                </Menu.Item>

                <SubMenu key="courses" icon={<ScheduleOutlined/>} title="My Courses">
                    {authorCourses.map(course =>
                        <SubMenu key={course.id} icon={<ProfileOutlined/>} title={course.name}>
                            {course.modules?.map(module =>
                                <SubMenu key={module.id} icon={<SnippetsOutlined/>} title={module.name}>
                                    {module.lessons?.map(lesson =>
                                        <Menu.Item key={lesson.id}>Lesson 1</Menu.Item>
                                    )}
                                </SubMenu>
                            )}
                        </SubMenu>
                    )}
                </SubMenu>
                <Menu.Item key="9" icon={<FileOutlined/>}>
                    <Link to="files" style={{textDecoration: 'none'}}>
                        Files
                    </Link>
                </Menu.Item>
            </Menu>
        </Sider>
    );
};

export default Sidebar;
