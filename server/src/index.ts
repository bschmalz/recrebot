import 'reflect-metadata';
import 'dotenv-safe/config';
import { COOKIE_NAME, __prod__ } from './constants';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/user';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { User } from './entities/User';
import path from 'path';
import { Campground } from './entities/Campground';
import { Trailhead } from './entities/Trailhead';
import { CampgroundResolver } from './resolvers/campground';
import { TrailheadResolver } from './resolvers/trailhead';
import { TripRequest } from './entities/TripRequest';
import { TripRequestResolver } from './resolvers/tripRequest';
import { scrapeRecData } from './scraper/scrapeRecData';
import { getImages } from './scraper/getImage';
import { sendSMS } from './utils/sendSMS';
import { sendSuccessEmail } from './utils/sendEmail';
import { scrapeWatcher } from './scraper/scrapeWatcher';
import { checkCaliCamps } from './scraper/checkTripRequest';

const main = async () => {
  try {
    await createConnection({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      // logging: true,
      synchronize: true,
      migrations: [path.join(__dirname, './migrations/*')],
      entities: [User, Campground, Trailhead, TripRequest],
    });
    // await conn.runMigrations();

    const app = express();

    let RedisStore = connectRedis(session);
    let redis = new Redis(process.env.REDIS_URL);
    app.set('trust proxy', 1);

    app.use(
      cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
      })
    );

    app.use(
      session({
        name: COOKIE_NAME,
        store: new RedisStore({
          client: redis,
          disableTouch: true,
        }),
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
          httpOnly: true,
          secure: __prod__,
          sameSite: 'lax',
          domain: __prod__ ? 'recrebot.com' : undefined,
        },
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
        resave: false,
      })
    );

    app.use(express.json());

    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [
          UserResolver,
          CampgroundResolver,
          TrailheadResolver,
          TripRequestResolver,
        ],
        validate: false,
      }),
      context: ({ req, res }) => ({
        req,
        res,
        redis,
      }),
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({
      app,
      cors: false,
    });

    app.post('/rc-check', async (req, res) => {
      const result = await checkCaliCamps(
        req.body.reserveCaliCamps,
        req.body.dates,
        req.body.min_nights
      );
      res.send(result);
    });

    app.get('/scrapewatch', (req, res) => {
      scrapeWatcher();
      res.send('Scrapin it up');
    });

    app.listen(parseInt(process.env.PORT), () => {
      console.log('server started');
    });
  } catch (e) {
    console.log('app level exeception caught: ', e);
  }
};

main();
