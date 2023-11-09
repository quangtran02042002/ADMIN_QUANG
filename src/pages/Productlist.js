import React, { useEffect, useState } from 'react'
import { Table } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { deleteAProduct, getProducts, resetState } from "../features/product/productSlice";
import { Link } from "react-router-dom";
import CustomModal from '../components/CustomModal';

const columns = [
    {
        title: "SNo",
        dataIndex: "key",
    },
    {
        title: "Title",
        dataIndex: "title",
        sorter: (a, b) => a.title.length - b.title.length,
    },
    {
        title: "Brand",
        dataIndex: "brand",
        sorter: (a, b) => a.brand.length - b.brand.length,
    },
    {
        title: "Category",
        dataIndex: "category",
        sorter: (a, b) => a.category.length - b.category.length,
    },
    {
        title: "Color",
        dataIndex: "color",
    },
    {
        title: "Price",
        dataIndex: "price",
        sorter: (a, b) => a.price - b.price,
    },
    {
        title: "Action",
        dataIndex: "action",
    },
];

const Productlist = () => {
    const [open, setOpen] = useState(false);
    const [prodId, setprodId] = useState("");

    const showModal = (e) => {
        setOpen(true);
        setprodId(e);
    };
    const hideModal = () => {
        setOpen(false);
    };
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getProducts());
        dispatch(resetState())
    }, []);
    const productState = useSelector((state) => state.product.products);
    const data1 = [];
    for (let i = 0; i < productState.length; i++) {
        data1.push({
            key: i + 1,
            title: productState[i].title,
            brand: productState[i].brand,
            category: productState[i].category,
            color: productState[i].color,
            price: `${productState[i].price}`,
            action: (
                <>
                    <Link to="/" className="fs-3 text-danger">
                        <BiEdit />
                    </Link>
                    <button className="ms-3 fs-3 text-danger bg-transparent border-0"
                        onClick={() => showModal(productState[i]._id)}>
                        <AiFillDelete />
                    </button>
                </>
            ),
        });
    }
    const deleteProd = (e) => {
        dispatch(deleteAProduct(e));
        setOpen(false);
        setTimeout(() => {
            dispatch(getProducts())
        }, 100)
    }
    return (
        <div>
            <h3 className="mb-4 title">Products</h3>
            <div>
                <Table columns={columns} dataSource={data1} />
            </div>
            <CustomModal
                hideModal={hideModal}
                open={open}
                performAction={() => { deleteProd(prodId) }}
                title="Are you sure you want to delete this Product?" />
        </div>
    );
};

export default Productlist;