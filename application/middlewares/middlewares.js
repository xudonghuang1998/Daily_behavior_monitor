import { send } from '../deps.js';

const errorMiddleware = async(context, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
  }
}

const requestTimingMiddleware = async({ request }, next) => {
  const time = new Date();
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(time.toLocaleTimeString(), `${request.method} ${request.url.pathname} - ${ms} ms` );
}

const userIdMiddleware = async({ session }, next) => {
  await next();
  if (await session.get('authenticated')){
    const user = await session.get('user');
    console.log(`user_id: ${user.id}`);
  } else {
    console.log('user_id: Anonymous');
  }
}

const accessControl = async({ request, session, response }, next) => {
  if (request.url.pathname.startsWith('/auth') || request.url.pathname === '/') {
    await next();
  } else {
    if(await session.get('authenticated')){
      await next();
    } else {
      response.redirect('/auth/login');
    }
  }
}

const serveStaticFilesMiddleware = async(context, next) => {
  if (context.request.url.pathname.startsWith('/static')) {
    const path = context.request.url.pathname.substring(7);
  
    await send(context, path, {
      root: `${Deno.cwd()}/static`
    });
  
  } else {
    await next();
  }
}

export { errorMiddleware, requestTimingMiddleware, userIdMiddleware, accessControl, serveStaticFilesMiddleware };