import Db from './lib/mysqldb.js';

class users {

    static async postUsers(ctx) {

        let sql = 'Insert Into user Set ?';
        let values = ctx.request.body;
        const [result] = await Db.query(sql, [values]);

        ctx.response.body = result.insertId; // return created member details
        ctx.response.status = 200; //
    }

    static async postRelations(ctx) {

        const userId = ctx.params.userId;
        let friendId = ctx.request.body.friendId;

        let sql = 'Insert Into userrelation Set ?';
        let values = { userId: userId, watchId: friendId, relation: 0 }

        let [result] = await Db.query(sql, [values]);
        const insertId = result.insertId;
        //查询是否朋友是否已经关注用户
        let selectSql = 'Select id from userrelation where userId=:userId and watchId=:watchId';
        [result] = await Db.query(selectSql, { userId: friendId, watchId: userId });
        if (result != null && result[0].id) {
            const updateSql = 'UPDATE userrelation SET relation=1 WHERE id in(?,?)';
            Db.query(updateSql, [insertId, result[0].id]);
        }

        ctx.response.body = insertId;
        ctx.response.status = 200;
    }

    static async postMoments(ctx){
        
    }
}

export default users;