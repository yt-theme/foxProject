let http = require('http')

class Http_instance {
    constructor () {
        this.http_server = http.createServer({
            "maxHeaderSize": 65536
        })
    }
    
    static get_instance () {
        if (!this.instance) {
            this.instance = new Http_instance()
        }
        return this.instance
    }
}

module.exports = Http_instance.get_instance().http_server