/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Manage MySQL database connections.                                                             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

const mysql = require('mysql2');

let connectionPool = null;


class MysqlDb {

    /**
     * Perform a query.
     *
     * @param   {string} sql - The SQL command to be executed.
     * @param   {Array}  values - Values to be substituted in SQL placeholders.
     * @returns Array containing array of result rows and array of fields.
     *
     * @example
     *   const [ type ] = await Db.query('Select * From types Where * = ?', [ 'David' ]);
     */
    static async query(sql, values) {
        if (!connectionPool) await setupConnectionPool();

        return connectionPool.query(sql, values);
    }

    /**
     * Get a connection to the database.
     *
     * This is useful for performing multiple queries within a transaction, or sharing data objects
     * such as temporary tables between subsequent queries. The connection must be released.
     *
     * @example
     *   const db = await Db.connect();
     *   await db.beginTransaction();
     *   try {
     *       await db.query('Insert Into Posts Set Title = ?', title);
     *       await db.query('Insert Into Log Set Data = ?', log);
     *       await db.commit();
     *   } catch (e) {
     *       await db.rollback();
     *       throw e;
     *   }
     *   db.release();
     *
     * @returns {Object} Database connection.
     */
    static async connect() {
        if (!connectionPool) await setupConnectionPool();

        const db = await connectionPool.getConnection();

        return db;
    }


    /**
     * Return connection parameters used to connect to MySQL (obtained from the
     * DB_MYSQL_CONNECTION environment variable which should be a connection string in the format
     * "host=my.host.com; user=my-un; password=my-pw; database=my-db").
     *
     * @returns Object with host, user, password, database properties.
     */
    static connectionParams() {
        const dbConfig = {
            host: 'localhost',
            user: 'root',
            password: '123456',
            database: 'wx_db',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        };
        return dbConfig;
    }
}


/**
 * First connection request after app startup will set up connection pool.
 */
async function setupConnectionPool() {
    const dbConfig = MysqlDb.connectionParams();
    dbConfig.namedPlaceholders = true;
    connectionPool = mysql.createPool(dbConfig);

    // traditional mode ensures not null is respected for unsupplied fields, ensures valid JavaScript dates, etc
    await connectionPool.query('SET SESSION sql_mode = "TRADITIONAL"');
}


export default MysqlDb;