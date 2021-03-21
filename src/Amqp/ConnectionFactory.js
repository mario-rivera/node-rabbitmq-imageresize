class ConnectionFactory
{
    /**
     * @param {import('amqplib')} amqp
     * @param {string} dsn
     * 
     * @returns {Promise<import('amqplib').Connection>}
     */
    static create(amqp, dsn)
    {
        return amqp.connect(dsn);
    }
}

module.exports = {
    ConnectionFactory: ConnectionFactory
};
