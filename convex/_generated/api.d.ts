/* prettier-ignore-start */

/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as container from "../container.js";
import type * as data from "../data.js";
import type * as helpers from "../helpers.js";
import type * as http from "../http.js";
import type * as layers from "../layers.js";
import type * as model from "../model.js";
import type * as tags from "../tags.js";
import type * as tensorflow_data from "../tensorflow/data.js";
import type * as tensorflow_tf_fn_mapping from "../tensorflow/tf_fn_mapping.js";
import type * as tensorflow_tf_model from "../tensorflow/tf_model.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  container: typeof container;
  data: typeof data;
  helpers: typeof helpers;
  http: typeof http;
  layers: typeof layers;
  model: typeof model;
  tags: typeof tags;
  "tensorflow/data": typeof tensorflow_data;
  "tensorflow/tf_fn_mapping": typeof tensorflow_tf_fn_mapping;
  "tensorflow/tf_model": typeof tensorflow_tf_model;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

/* prettier-ignore-end */
