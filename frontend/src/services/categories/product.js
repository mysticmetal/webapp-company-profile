import helper from "../../helpers/index"

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}

function detailProduct(id) {
    const requestOptions = {
        method: 'GET',
        headers: helper.authHeader()
    };
    return fetch(`${process.env.VUE_APP_SERVICE}/main/categories/product/detail/`+id, requestOptions).then(handleResponse);
}

function deleteProduct(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: helper.authHeader()
    };
    return fetch(`${process.env.VUE_APP_SERVICE}/main/categories/product/delete/`+id, requestOptions).then(handleResponse);
}


function createProduct(data) {
    const requestOptions = {
        method: 'POST',
        headers: helper.authHeader(),
        body: JSON.stringify(data)
    };
    return fetch(`${process.env.VUE_APP_SERVICE}/main/categories/product/create`, requestOptions).then(handleResponse);
}

function updateProduct(data, id) {
    const requestOptions = {
        method: 'PUT',
        headers: helper.authHeader(),
        body: JSON.stringify(data)
    };
    return fetch(`${process.env.VUE_APP_SERVICE}/main/categories/product/update/`+id, requestOptions).then(handleResponse);
}

export default { detailProduct, deleteProduct, createProduct, updateProduct }