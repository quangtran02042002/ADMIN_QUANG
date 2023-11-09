import React, { useEffect, useState } from 'react'
import CustomInput from '../components/CustomInput'
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation, useNavigate } from "react-router-dom"
import { useFormik } from "formik";
import * as Yup from "yup";
import { createBrand, getABrand, resetState, updateABrand } from '../features/brand/brandSlice';

let schema = Yup.object().shape({
    title: Yup.string().required("Brand name is required"),

});

const Addbrand = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const newBrand = useSelector((state) => state.brand);
    const { isSuccess, isError, isLoading, createdBrand, brandName, updatedBrand } = newBrand
    const getBrandId = location.pathname.split('/')[3];
    useEffect(() => {
        if (getBrandId !== undefined) {
            dispatch(getABrand(getBrandId))

        } else {
            dispatch(resetState())
        }
    }, [getBrandId])

    const dispatch = useDispatch();

    useEffect(() => {
        if (isSuccess && createdBrand) {
            toast.success('🦄 Brand Added Successfully');
        }
        if (isSuccess && updatedBrand) {
            toast.success('🦄 Brand Updated Successfully');
            navigate('/admin/list-brand')
        }
        if (isError) {
            toast.error('🦄 Something Went Wrong');
        }
    }, [isSuccess, isError, isLoading])
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: brandName || "",
        },
        validationSchema: schema,
        onSubmit: (values) => {
            if (getBrandId !== undefined) {
                const data = { id: getBrandId, brandData: values }
                dispatch(updateABrand(data))
                dispatch(resetState())
            } else {
                dispatch(createBrand(values))
                formik.resetForm();
                setTimeout(() => {
                    dispatch(resetState())
                }, 300);
            }
        },
    });


    return (
        <div>
            <h3 className='mb-4 title'>{getBrandId !== undefined ? "Edit" : "Add"} Brand</h3>
            <div>
                <form action="" onSubmit={formik.handleSubmit}>
                    <CustomInput
                        type="text"
                        label="Enter Brand"
                        name="title"
                        onCh={formik.handleChange("title")}
                        onBl={formik.handleBlur("title")}
                        val={formik.values.title}
                        id="brand" />
                    <div className='error'>
                        {formik.touched.title && formik.errors.title}
                    </div>
                    <button type="submit" className='btn btn-success border-0 rounded-3 my-5'>{getBrandId !== undefined ? "Edit" : "Add"} Brand</button>

                </form>
            </div>
        </div>
    )
}

export default Addbrand