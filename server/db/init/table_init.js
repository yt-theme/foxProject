const mysql_func = require("../defs/mysql_func")

class Tb_init {
    constructor () {

    }

    // user 表
    user_table () {
        return new Promise ((resolve, reject) => {
            mysql_func.query(
               `create table if not exists \`users\` (
                    \`id\` bigint not null auto_increment,
                    \`name\` varchar(30) default null unique,
                    \`passwd\` varchar(800) default null,
                    \`lastlogin\` varchar(14),
                    primary key (\`id\`)
                ) engine=InnoDB auto_increment=1 default charset=utf8;`,
            '')
            .then((v)  => { 
                console.log('users table already init')
                resolve(v)
            }).catch((v) => { 
                console.log('users table init err =>')
                reject(v)
            })
        })
    }
}

module.exports = Tb_init