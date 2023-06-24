import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import {Pool} from "pg";

interface PollRequest{
  slug: string;
  [key: string]: string;
}

const URL = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}/${process.env.PGDATABASE}?options=project%3D${process.env.ENDPOINT_ID}`

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  let body: PollRequest;
  const pool = new Pool({connectionString: URL, ssl: { rejectUnauthorized: true }});

  if(event.body !== null && event.body !== undefined){
    body = JSON.parse(event.body);
    if(body.slug === null || body.slug === undefined){
      return {
        statusCode: 400,
        body: JSON.stringify({message: "Slug missing."})
      }
    }
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({message: "Body missing."})
    }
  }

  const slug: string = body.slug;

  try {
    await pool.connect();
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Could not connect to server',
      }),
    };
  }

  for (let key in body){
    if(key == "slug") continue;
    try {
      const text = 'INSERT INTO responses(slug, "questionID", answer, "createdAt", "updatedAt") VALUES($1, $2, $3, now(), now())'
      const values = [slug, key, body[key]]

      await pool.query(text, values);
    } catch (e) {
      console.log(e);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Could not insert value ' + key,
        }),
      };
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Response submitted successfully.',
    }),
  };
};