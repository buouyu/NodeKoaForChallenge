import Db from './lib/mysqldb.js';

class users {    

    static async postUsers(ctx) {

        let sql = 'Insert Into user Set ?';
        let values= ctx.request.body;
        const [result] = await Db.query(sql, [values]);

        ctx.response.body = result.insertId; // return created member details
        ctx.response.status = 201; // Created
    }
}

export default users;