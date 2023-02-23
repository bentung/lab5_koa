import Koa from "koa";
import Router, { RouterContext } from 'koa-router';
import logger from 'koa-logger';
import json from 'koa-json';
import bodyParser from "koa-bodyparser";
import { CustomErrorMessageFunction, query, body, validationResults } from "koa-req-validation";

import { filmList } from "./filmList";

const app: Koa = new Koa();
const router: Router = new Router();

const customErrorMessage: CustomErrorMessageFunction = (
  _ctx: RouterContext,
  value: string) => {
  return (
    `The name must be between 3 and 20 ` +
    `characters long but received length ${value.length}`
  )
}

const validatorName = [
  body("name").isLength({
    min: 3
  }).optional().withMessage(customErrorMessage).build(),
  body("film").isLength({
    min: 3
  }).withMessage(customErrorMessage).build(),
  // body("id").isInt({ min: 10000, max: 20000 }).build()
]

// Set up endpoint
router.get('/',
  query("name")
    .isLength({ min: 3 })
    .withMessage(customErrorMessage)
    .build(),
  async (ctx: RouterContext, next: any) => {
    // ctx.body = { msg: 'Hello World!' };
    const result = validationResults(ctx);
    if (result.hasErrors()) {
      ctx.status = 422;
      ctx.body = { err: result.mapped() }
    } else {
      ctx.body = { msg: `Hello world! ${ctx.query.name}` };
    }

    await next();
  })

router.post('/', async (ctx: RouterContext, next: any) => {
  const data = ctx.request.body;
  ctx.body = data;
  await next();
})

router.get('/films', async (ctx: RouterContext, next: any) => {
  ctx.body = { movie: filmList };
  await next();
})

router.post('/films',
  ...validatorName,
  async (ctx: RouterContext, next: any) => {
    const result = validationResults(ctx);
    if (result.hasErrors()) {
      ctx.status = 422;
      ctx.body = { err: result.mapped() }
    } else {
      const data: any = ctx.request.body;
      const newId = filmList.length + 1;
      if (data.film) filmList.push({ id: newId, name: data.film })

      ctx.body = { msg: 'film added' };
    }

    await next();
  })

router.get('/film/:id', async (ctx: RouterContext, next: any) => {
  const id: number = +ctx.params.id;
  ctx.status = 404;
  film.forEach((f) => {
    if (f.id == id) {
      // replace the data
      ctx.status = 200;
    }
  })
  ctx.body = resBody;
  await next()
});

// End of endpoint set up


// other plug-ins
app.use(json());
app.use(logger());
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());
app.use(async (ctx: RouterContext, next: any) => {
  try {
    await next();
    if (ctx.status === 404)
      ctx.body = { err: "No such endpoint existed" }
  }
  catch {

  }
})

// Start Koa
app.listen(10888, () => {
  console.log("Koa started");
})