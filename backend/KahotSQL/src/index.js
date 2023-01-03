const {Client} = require("pg");


exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    const client = new Client({
        user: "master",
        host: "database-1-instance-1.cuibnbovhz7b.us-east-1.rds.amazonaws.com",
        database: "postgres",
        password: "JaiAvi10:14",
        port: 5432
    });

    let res = "Huh?";

    try {
        await client.connect();

        res = JSON.stringify(await client.query(event.body));
        console.log(res);

        await client.end();
    } catch (e) {
        res = JSON.stringify(e);
    }

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        body: res,
    };
};
