export async function Ajax(route, method, body, callback,isFormData,files) {
    console.log('test files', files)
    let reqBody = {
        method: method,
        mode: 'cors',
        credentials: 'include',
    };
    if(method !== 'GET' && method !== 'HEAD'){
        if(isFormData){
            const formData = new FormData();
            let jsonData = JSON.stringify(body);
            formData.append('jsonData',jsonData);
            if(files){
                console.log('has files')
                for(const [key, value] of Object.entries(files)){
                    console.log('has files', key, value)
                    formData.append(key, value);
                }
            }
            reqBody['body'] = formData;

        } else{
            reqBody['body'] = JSON.stringify(body);
        }
    }
    const myCsrf = sessionStorage.getItem('Csrf');
    if(myCsrf){
        reqBody.headers = {'X-CSRF-TOKEN': myCsrf};
    }
    const req = new Request(route, reqBody);
    let responseJson = null;
    try {
        const response = await fetch(req);
        if (response.ok) {
            console.log('response ok');
            const csrf = response.headers.get('Csrf');
            if(csrf){
                sessionStorage.setItem('Csrf', csrf);
            }
            responseJson = await response.json();
        } else {
            throw new Error('Response not ok');
        }
    } catch (exception) {
        console.log('Ajax Error:', exception.message);
    }
    console.log('response in ajax', responseJson)
    callback(responseJson);
}
