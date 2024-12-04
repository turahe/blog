import axios from "axios";

// const res =  axios.get(`http://site.test/api/v1/blogs`)
axios.get('http://site.test/api/v1/blogs')
    .then(function (response) {
        console.log(response.data.data.length);
        // console.log(response.status);
        // console.log(response.statusText);
        // console.log(response.headers);
        // console.log(response.config);
    });