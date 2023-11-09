import React, { useEffect, useState } from 'react'
import CustomInput from '../components/CustomInput'
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation, useNavigate } from "react-router-dom"
import { useFormik } from "formik";
import * as Yup from "yup";
import { createBlogCategory, resetState, updateABlogCat, getABlogCat, } from '../features/bcategory/bcategorySlice';


let schema = Yup.object().shape({
    title: Yup.string().required("Blog Category is required"),

});
const Addblogcat = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const getBlogCatId = location.pathname.split("/")[3];
    const newBlogCategory = useSelector((state) => state.bCategory);
    const { isSuccess, isError, isLoading, createdBlogCategory, blogCatName, updatedBlogCategory } = newBlogCategory

    useEffect(() => {
        if (getBlogCatId !== undefined) {
            dispatch(getABlogCat(getBlogCatId));
        } else {
            dispatch(resetState());
        }
    }, [getBlogCatId]);


    useEffect(() => {
        if (isSuccess && createdBlogCategory) {
            toast.success('🦄 Blog Category Added Successfully');
        }
        if (isSuccess && updatedBlogCategory) {
            toast.success('🦄 Blog Category Updated Successfully');
            navigate('/admin/blog-category-list')
        }
        if (isError) {
            toast.error('🦄 Something Went Wrong');
        }
    }, [isSuccess, isError, isLoading])
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: blogCatName || "",
        },
        validationSchema: schema,
        onSubmit: (values) => {
            const data = { id: getBlogCatId, blogCatData: values }
            if (getBlogCatId !== undefined) {
                dispatch(updateABlogCat(data));
                dispatch(resetState());
            } else {
                dispatch(createBlogCategory(values))
                formik.resetForm();
                setTimeout(() => {
                    dispatch(resetState())
                }, 300);
            }
        },
    });
    return (
        <div>
            <h3 className='mb-4 title'>{getBlogCatId !== undefined ? "Edit" : "Add"} Blog Category</h3>
            <div>
                <form action="" onSubmit={formik.handleSubmit}>
                    <CustomInput
                        type="text"
                        label="Enter Blog Category"
                        name="title"
                        onCh={formik.handleChange("title")}
                        onBl={formik.handleBlur("title")}
                        val={formik.values.title}
                        id="blogcat" />
                    <div className='error'>
                        {formik.touched.title && formik.errors.title}
                    </div>
                    <button type="submit" className='btn btn-success border-0 rounded-3 my-5'>{getBlogCatId !== undefined ? "Edit" : "Add"} Blog Category</button>

                </form>
            </div>
        </div>
    )
}

export default Addblogcat