function ajax_post (url, paramsObj) {
    return new Promise ((resolve, reject) => {
        let xhttp = new XMLHttpRequest()
        
        xhttp.open('POST', url, true)
        // xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
        // xhttp.setRequestHeader("Content-type", "multipart/form-data")
        // xhttp.setRequestHeader("token", token)
        xhttp.send(paramsObj)

        // 回调
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4) {
                let s = xhttp.status
                if (s>= 200 && s< 300) { let resT = xhttp.responseText; let resX = xhttp.responseXML; resolve({ data: JSON.parse(resT) }) } 
                else                   { reject(status)                                                                                   }
            }
        }
    })
}