"use client";

import React, {useEffect, useState} from "react";
import ListLayout from '@/layouts/ListLayoutWithTags'
import axios from 'axios'


export default function BlogPage() {
    const pageNumber = 1
    const [blogsData, setBlogsData] = useState([]);

    const url: string = "http://site.test/api/v1/blogs";

    useEffect(() => {
        fetchData(url);
    }, []);

    const fetchData = (url: string) => {
        axios
            .get(url)
            .then((data) => {
                setBlogsData(data.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const pagination: {
        currentPage: number,
        totalPages: number,
    } = {
        currentPage: pageNumber,
        totalPages: 11,
    }

    return (
        <ListLayout
            posts={blogsData}
            initialDisplayPosts={blogsData}
            pagination={pagination}
            title="All Posts"
        />
    )
}
