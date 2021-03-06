import {Dispatch} from "redux";
import {Course, CourseAction, CourseActionTypes} from "../../types/course";
import {authAxios} from "../../utils/axios";

export const fetchStudentCourses = () => {
    return async (dispatch: Dispatch<CourseAction>) => {
        try {
            dispatch({type: CourseActionTypes.FETCH_STUDENT_COURSES})

            const materialsResponse = await authAxios.get<Array<Course>>('/get_student_bundle/')
            const materials = materialsResponse.data

            dispatch({type: CourseActionTypes.FETCH_STUDENT_COURSES_SUCCESS, payload: materials})

        } catch (error) {
            dispatch({
                type: CourseActionTypes.FETCH_STUDENT_COURSES_ERROR,
                payload: {code: error.response.status, message: 'Failed to fetch student materials'}
            })
        }
    }
}

export const fetchAuthorMaterials = () => {
    return async (dispatch: Dispatch<CourseAction>) => {
        try {
            dispatch({type: CourseActionTypes.FETCH_AUTHOR_COURSES})

            const materialsResponse = await authAxios.get<Array<Course>>('/get_author_bundle/')
            const materials = materialsResponse.data

            dispatch({type: CourseActionTypes.FETCH_AUTHOR_COURSES_SUCCESS, payload: materials})

        } catch (error) {
            dispatch({
                type: CourseActionTypes.FETCH_AUTHOR_COURSES_ERROR,
                payload: {code: error.response.status, message: 'Failed to fetch author materials'}
            })
        }
    }
}

export const createCourse = (course: Partial<Course>) => {
    return async (dispatch: Dispatch<CourseAction>) => {
        try {
            dispatch({type: CourseActionTypes.CREATE_SINGLE_COURSE})
            const response = await authAxios.post<Course>('/courses/', course)
            dispatch({type: CourseActionTypes.CREATE_SINGLE_COURSE_SUCCESS, payload: response.data})
        } catch (error) {
            dispatch({
                type: CourseActionTypes.CREATE_SINGLE_COURSE_ERROR,
                payload: {code: error.response.status, message: 'Failed to create course'}
            })
        }
    }
}

export const updateCourse = (courseId: number, course: Partial<Course>) => {
    return async (dispatch: Dispatch<CourseAction>) => {
        try {
            dispatch({type: CourseActionTypes.UPDATE_SINGLE_COURSE})
            const response = await authAxios.put<Course>(`/courses/${courseId}/`, course)
            dispatch({type: CourseActionTypes.UPDATE_SINGLE_COURSE_SUCCESS, payload: response.data})
        } catch (error) {
            dispatch({type: CourseActionTypes.UPDATE_SINGLE_COURSE_ERROR, payload: {code: error.response.status, message: `Failed to update course with ID ${courseId}`}})
        }
    }
}

export const deleteCourse = (courseId: number) => {
    return async (dispatch: Dispatch<CourseAction>) => {
        try {
            dispatch({type: CourseActionTypes.DELETE_SINGLE_COURSE})
            await authAxios.delete(`/courses/${courseId}/`)
            dispatch({type: CourseActionTypes.DELETE_SINGLE_COURSE_SUCCESS, payload: courseId})
            window.history.back()
        } catch (error) {
            dispatch({
                type: CourseActionTypes.DELETE_SINGLE_COURSE_ERROR,
                payload: {code: error.response.status, message: `Failed to delete course with ID ${courseId}`}
            })
        }
    }
}
