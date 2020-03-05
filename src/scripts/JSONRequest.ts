  export const GetJSON = async (url) => {
    // return fetch(url);
    return new Promise( (resolve, reject) => {
        let request = new XMLHttpRequest()
        request.open('GET', url, true)
        request.responseType = 'json'
        request.send()
        request.onload = () => {
            if (request.status >= 200 && request.status < 400) { // If response is all good...
                resolve(request.response);
            } else {
                console.log('There was an error retrieving the API');
                reject('err');
            }
        };
    })     
  }

  export const stringKeyToJSON = (obj,str) => {
    let data = JSON.parse(JSON.stringify(obj));
    str.split('.').forEach((e,i)=>{
      data = data[e]
    })
    return (data)
  }