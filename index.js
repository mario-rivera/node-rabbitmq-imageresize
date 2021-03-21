const { container } = require('./kernel/container');

(async () => {
    /** @type {import('amqplib').Connection} */
    const connection = await container.get('Amqp/Connection');
    let channel = await connection.createChannel();

    channel.once('error', (error) => {
        console.log(error.message);
        process.exit();
    });

    await channel.assertExchange("sharp", 'direct', {durable: false, autoDelete: true});

    let result = await channel.assertQueue("", {autoDelete: true, exclusive: true});
    await channel.bindQueue(result.queue, "sharp", "resize");

    channel.close();

    channel = await connection.createChannel();

    await channel.publish("sharp", "resize", Buffer.from("Hello"));
    await channel.publish("sharp", "resize", Buffer.from("Hello"));
    await channel.publish("sharp", "resize", Buffer.from("Hello"));
    await channel.publish("sharp", "resize", Buffer.from("Hello"));
    await channel.publish("sharp", "resize", Buffer.from("Hello"));
    await channel.publish("sharp", "resize", Buffer.from("Hello"));
    await channel.publish("sharp", "resize", Buffer.from("Hello"));
    await channel.publish("sharp", "resize", Buffer.from("Hello"));
    await channel.publish("sharp", "resize", Buffer.from("Hello"));
    await channel.publish("sharp", "resize", Buffer.from("Hello"));
    await channel.publish("sharp", "resize", Buffer.from("Hello"));
    await channel.publish("sharp", "resize", Buffer.from("Hello"));
    await channel.publish("sharp", "resize", Buffer.from("Hello"));
    
    channel.prefetch(1);
    // await channel.consume(result.queue, async function(message){
    //     console.log(message.content.toString());
    //     await channel.ack(message);
    // });

    // let message = false;
    try {
        do {
            message = await channel.get(result.queue);
            if (message) {
                // throw new Error('zup');
                console.log(message.content.toString());
            }
        } while(message);
    } finally {
        channel.close();
        connection.close();
    }
})();