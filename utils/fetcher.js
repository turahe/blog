"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
// const res =  axios.get(`http://site.test/api/v1/blogs`)
axios_1.default.get('/http://site.test/api/v1/blogs')
    .then(function (response) {
    console.log(response.data);
    console.log(response.status);
    console.log(response.statusText);
    console.log(response.headers);
    console.log(response.config);
});
