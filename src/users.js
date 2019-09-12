import Db from '../lib/mysqldb.js';

class users {

    static async insert(values) {
        if (values.userId == null || values.name == null) {

        }

        try {

            const [result] = await Db.query('Insert Into user Set ?', [values]);
            return result.insertId;

        } catch (e) {

        }
    }

    static async postUsers(ctx) {

        ctx.request.body = await castBoolean.fromStrings('user', ctx.request.body);

        const id = await Member.insert(ctx.request.body);

        ctx.response.body = await Member.get(id); // return created member details
        ctx.response.status = 201; // Created
    }
}

export default users;