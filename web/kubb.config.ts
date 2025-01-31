import { defineConfig } from '@kubb/core'
import {pluginOas} from "@kubb/plugin-oas";
import {pluginTs} from "@kubb/plugin-ts";
import {pluginClient} from "@kubb/plugin-client";
import {pluginReactQuery} from "@kubb/plugin-react-query";

export default defineConfig({
  name: 'SV.Pay',
  root: '.',
  input: {
    path: './swagger.json',
  },
  output: {
    path: './src/http/generated',
    clean: true,
  },
  plugins: [
    pluginOas({
      generators: [],
      validate: false
    }),
    pluginTs({
      output: {
        path: 'models',
      },
      dateType: 'date'
    }),
    pluginClient({
      output: {
        path: 'client',
      },
      importPath: '@/http/client-fetch',
      paramsType: 'inline',
      pathParamsType: 'object',
      dataReturnType: 'full'
    }),
    pluginReactQuery({
      output: {
        path: 'hooks',
      },
      paramsType: 'inline',
      pathParamsType: 'object',
      suspense: {},
      client: {
        importPath: '@/http/client-fetch',
        dataReturnType: 'full',
      },
      mutation: {
        methods: [ 'put', 'post' ],
      },
      query: {
        methods: [ 'get' ],
      },
    }),
  ]
})