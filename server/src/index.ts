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
import { createConnection, getConnection, getManager } from 'typeorm';
import { User } from './entities/User';
import path from 'path';
import { createUserLoader } from './utils/createUserLoader';
import { Campground } from './entities/Campground';
import { Trailhead } from './entities/Trailhead';
import { scrapeRecData } from './scraper/scrapeRecData';

const main = async () => {
  await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, './migrations/*')],
    entities: [User, Campground, Trailhead],
  });
  // await conn.runMigrations(); -

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

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
    }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.get('/testget', async (req, res) => {
    console.log('checking it out');

    const wawona = 'wawona';

    const yosemite = 'yosemite';

    const songs = await getManager()
      .createQueryBuilder()
      .select('campground')
      .from(Campground, 'campground')
      .where('campground.name ilike :name', {
        name: `%${wawona}%`,
      })
      .orWhere('campground.recarea_name ilike :name', {
        name: `%${yosemite}%`,
      })
      .getMany();
    console.log('did it work?', songs);
    res.send('should have got it');
  });

  app.get('/raw', async (req, res) => {
    const rawData = await getManager().query(`
    
    select id, name, round((point(a.longitude,a.latitude) <@> point(11,11))::numeric, 3) as miles
    from campground a
    where (a.recarea_name ilike '%yosemite%')
    and a.longitude < 50
    order by point(a.longitude,a.latitude) <-> point(11, 11)
    `);
    console.log('cg', rawData);
    res.send('raw');
  });

  app.get('/scrape', async (req, res) => {
    console.log('server scrape');
    // scrapeRecData();
    res.send('Scaper here!');
  });

  app.listen(parseInt(process.env.PORT), () => {
    console.log('server started');
  });
};

main();
