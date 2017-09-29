const uploadFile = (params) => {
    console.log("Promise uploadFile: ", params);
    return new Promise((resolve, reject) => {
        if (params.data.file && params.data.file[0].rawFile instanceof File) {
            const formData = new FormData();
            formData.append('file', params.data.file[0].rawFile);
            fetch('/api/files', {
                method: 'post',
                body: formData,
            })
                .then(response => response.json())
                .then(file => {
                    const tmp = {
                        ...params,
                        data: {
                            ...params.data,
                            featuredImg: file,
                        },
                    };
                    resolve(tmp)
                });
        } else {
            resolve(params);
        }
    });
};

const uploadAnswer = (params) => {
    console.log("Promise uploadFile: ", params);
    return new Promise((resolve, reject) => {
        if (params.data.answers && params.data.answers[0].photos[0].rawFile instanceof File) {
            const tmp = [];
            params.data.answers.forEach(e => {
                tmp.push(e.photos[0].rawFile);
            });
            const photos = tmp.filter(photo => {
                    return photo instanceof File
                }
            );
            if (photos.length) {
                const formData = new FormData();
                photos.map(photo => {
                    return formData.append('photos', photo)
                });
                return fetch('/api/photos', {
                    method: 'post',
                    body: formData,
                })
                    .then(response => response.json())
                    .then(photos => {
                        params = {
                            ...params,
                            data: {
                                ...params.data,
                                answers: photos.map((photo) => {
                                    return {img: photo}
                                }),
                            }
                        };
                        resolve(params);
                    });
            } else {
                resolve(params);
            }
        } else {
            resolve(params);
        }
    });
};

const addUploadCapabilities = requestHandler => (type, resource, params) => {
    if ((type === 'UPDATE' || type === "CREATE") &&
        (resource === 'quizzes' || resource === 'questions' || resource === 'results')) {
        console.log("addUploadCapabilities: ", params.data);
        if (Object.prototype.toString.call(params.data.file) === '[object Array]') {
            console.log("addUploadCapabilities length: ", params.data.file.length);
        } else {
            console.log("addUploadCapabilities length: 0");
        }

        return uploadFile(params)
        // .then(uploadAnswer)
            .then(params => requestHandler(type, resource, params))
            .catch(error => console.log(error.message));
    } else {
        return requestHandler(type, resource, params);
    }
};

export default addUploadCapabilities;