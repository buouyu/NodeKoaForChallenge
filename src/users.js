import Db from './lib/mysqldb.js';

class users {

    static async postUsers(ctx) {

        let sql = 'Insert Into user Set ?';
        let values = ctx.request.body;
        const [result] = await Db.query(sql, [values]);

        ctx.response.body = "ok"; // return created member details
        ctx.response.status = 200; //
    }

    static async postRelations(ctx) {

        const userId = ctx.params.userId;
        let friendId = ctx.request.body.friendId;


        let sql = 'Insert Into userrelation Set ?';
        let values = { userId: userId, watchId: friendId, relation: 0 }

        let [result] = await Db.query(sql, [values]);
        const insertId = result.insertId;
        //查询朋友是否已经关注用户
        let selectSql = 'Select id from userrelation where userId=:userId and watchId=:watchId';
        [result] = await Db.query(selectSql, { userId: friendId, watchId: userId });
        if (result != null && result[0] != null && result[0].id) {
            const updateSql = 'UPDATE userrelation SET relation=1 WHERE id=? OR id=?';
            await Db.query(updateSql, [insertId, result[0].id]);
        }


        /*
        const db = await Db.connect();
        await db.beginTransaction();
        let result;
        let result2;
        try {
            let sql = 'Insert Into userrelation Set ?'
            let values = { userId: userId, watchId: friendId, relation: 0 }
            let sql2 = 'Select id from userrelation where userId=:userId and watchId=:watchId';
            result = await db.query(sql, [values]);
            result2 = await db.query(sql2, { userId: friendId, watchId: userId });
            await db.commit();
        } catch (e) {
            await db.rollback();
            throw e;
        }

        const insertId = result[0].insertId;
        if (result2 != null && result2[0][0] != null && result2[0][0].id) {
            const updateSql = 'UPDATE userrelation SET relation=1 WHERE id=? OR id=?';
            await db.query(updateSql, [insertId, result2[0][0].id]);
        }
        db.release();
        */


        ctx.response.body = "ok";
        ctx.response.status = 200;
    }

    static async postMoments(ctx) {
        const userId = ctx.params.userId;
        let values = ctx.request.body;
        values["userId"] = userId;
        values["addDate"] = new Date().getTime();
        let sql = 'Insert Into sendlog Set ?';
        const [result] = await Db.query(sql, [values]);

        ctx.response.body = "ok";
        ctx.response.status = 200; //
    }

    static async deleteRelations(ctx) {
        const userId = ctx.params.userId;
        const friendId = ctx.params.friendId;

        const db = await Db.connect();
        await db.beginTransaction();
        try {
            let sql = 'DELETE FROM userrelation WHERE userId=? AND watchId=?';
            let sql2 = 'UPDATE userrelation SET relation=0 WHERE userId=? AND watchId=?';
            await db.query(sql, [userId, friendId]);
            await db.query(sql2, [friendId, userId]);
            await db.commit();
        } catch (e) {
            await db.rollback();
            throw e;
        }
        db.release();

        /*
         let sql = 'DELETE FROM userrelation WHERE userId=? AND watchId=?';
         const [result] = await Db.query(sql, [userId, friendId]);
 
         sql = 'UPDATE userrelation SET relation=0 WHERE userId=? AND watchId=?';
         Db.query(sql, [friendId, userId]);
        */

        ctx.response.body = "ok";
        ctx.response.status = 200; //
    }

    static async deleteMoments(ctx) {
        const userId = ctx.params.userId;
        const momentId = ctx.params.momentId;

        let sql = 'DELETE FROM sendlog WHERE userId=? AND momentId=?';
        const [result] = await Db.query(sql, [userId, momentId]);

        ctx.response.body = { "data": "ok" };
        ctx.response.status = 200; //
    }

    static async getUsers(ctx) {
        const userId = ctx.params.userId;

        let sql = 'SELECT * FROM `user` WHERE userId=?';
        const [result] = await Db.query(sql, [userId]);
        ctx.response.body = { "data": result[0] };
        ctx.response.status = 200; //
    }
    static async getStreams(ctx) {
        const userId = ctx.params.userId;
        const lastId = ctx.query.lastId;

        let sql = 'call getStreams(?,?)';
        const [result] = await Db.query(sql, [userId, lastId]);

        ctx.response.body = { "data": result[0] };
        ctx.response.status = 200; //
    }
}

export default users;