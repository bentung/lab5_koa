"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_koa = __toESM(require("koa"));
var import_koa_router = __toESM(require("koa-router"));
var import_koa_logger = __toESM(require("koa-logger"));
var import_koa_json = __toESM(require("koa-json"));
var import_koa_bodyparser = __toESM(require("koa-bodyparser"));
var import_koa_req_validation = require("koa-req-validation");
var import_filmList = require("./filmList");
const app = new import_koa.default();
const router = new import_koa_router.default();
const customErrorMessage = (_ctx, value) => {
  return `The name must be between 3 and 20 characters long but received length ${value.length}`;
};
const validatorName = [
  (0, import_koa_req_validation.body)("name").isLength({
    min: 3
  }).optional().withMessage(customErrorMessage).build(),
  (0, import_koa_req_validation.body)("film").isLength({
    min: 3
  }).withMessage(customErrorMessage).build()
];
router.get(
  "/",
  (0, import_koa_req_validation.query)("name").isLength({ min: 3 }).withMessage(customErrorMessage).build(),
  async (ctx, next) => {
    const result = (0, import_koa_req_validation.validationResults)(ctx);
    if (result.hasErrors()) {
      ctx.status = 422;
      ctx.body = { err: result.mapped() };
    } else {
      ctx.body = { msg: `Hello world! ${ctx.query.name}` };
    }
    await next();
  }
);
router.post("/", async (ctx, next) => {
  const data = ctx.request.body;
  ctx.body = data;
  await next();
});
router.get("/films", async (ctx, next) => {
  ctx.body = { movie: import_filmList.filmList };
  await next();
});
router.post(
  "/films",
  ...validatorName,
  async (ctx, next) => {
    const result = (0, import_koa_req_validation.validationResults)(ctx);
    if (result.hasErrors()) {
      ctx.status = 422;
      ctx.body = { err: result.mapped() };
    } else {
      const data = ctx.request.body;
      const newId = import_filmList.filmList.length + 1;
      if (data.film)
        import_filmList.filmList.push({ id: newId, name: data.film });
      ctx.body = { msg: "film added" };
    }
    await next();
  }
);
router.get("/film/:id", async (ctx, next) => {
  const id = +ctx.params.id;
  ctx.status = 404;
  film.forEach((f) => {
    if (f.id == id) {
      ctx.status = 200;
    }
  });
  ctx.body = resBody;
  await next();
});
app.use((0, import_koa_json.default)());
app.use((0, import_koa_logger.default)());
app.use((0, import_koa_bodyparser.default)());
app.use(router.routes()).use(router.allowedMethods());
app.use(async (ctx, next) => {
  try {
    await next();
    if (ctx.status === 404)
      ctx.body = { err: "No such endpoint existed" };
  } catch {
  }
});
app.listen(10888, () => {
  console.log("Koa started");
});
//# sourceMappingURL=index.js.map
