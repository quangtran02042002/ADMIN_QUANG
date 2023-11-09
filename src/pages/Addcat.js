import React, { useEffect, useState } from 'react'
import CustomInput from '../components/CustomInput'
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation, useNavigate } from "react-router-dom"
import { useFormik } from "formik";
import * as Yup from "yup";
import { createCategory, getAProductCategory, resetState, updateAProductCategory } from "../features/pcategory/pcategorySlice"
let schema = Yup.object().shape({
    title: Yup.string().required("Category name is required"),
});

const Addcat = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const getPCatId = location.pathname.split('/')[3];
    const dispatch = useDispatch();
    const newCategory = useSelector((state) => state.pCategory);
    const { isSuccess, isError, isLoading, createdCategory, categoryName, updatedCategory } = newCategory
    useEffect(() => {
        if (getPCatId !== undefined) {
            dispatch(getAProductCategory(getPCatId))

        } else {
            dispatch(resetState())
        }
    }, [getPCatId])


    useEffect(() => {
        if (isSuccess && createdCategory) {
            toast.success('🦄 Category Added Successfully');
        }
        if (isSuccess && updatedCategory) {
            toast.success('🦄 Category Updated Successfully');
            navigate('/admin/list-category')
        }
        if (isError) {
            toast.error('🦄 Something Went Wrong');
        }
    }, [isSuccess, isError, isLoading])
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: categoryName || "",
        },
        validationSchema: schema,
        onSubmit: (values) => {
            if (getPCatId !== undefined) {
                const data = { id: getPCatId, pCatData: values }
                dispatch(updateAProductCategory(data))
                dispatch(resetState())
            } else {
                dispatch(createCategory(values))
                formik.resetForm();
                setTimeout(() => {
                    dispatch(resetState())
                }, 300);
            }

        },
    });


    return (
        <div>
            <h3 className='mb-4 title'>{getPCatId !== undefined ? "Edit" : "Add"} Category</h3>
            <div>
                <form action="" onSubmit={formik.handleSubmit}>
                    <CustomInput
                        type="text"
                        label="Enter Product Category"
                        name="title"
                        onCh={formik.handleChange("title")}
                        onBl={formik.handleBlur("title")}
                        val={formik.values.title}
                        id="category" />
                    <div className='error'>
                        {formik.touched.title && formik.errors.title}
                    </div>
                    <button type="submit" className='btn btn-success border-0 rounded-3 my-5'>{getPCatId !== undefined ? "Edit" : "Add"} Category</button>

                </form>
            </div>
        </div>
    )
}

export default Addcat