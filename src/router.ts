// docs for router https://github.com/thepassle/app-tools/blob/master/router/README.md

import { html } from 'lit';

if (!(globalThis as any).URLPattern) {
  await import("urlpattern-polyfill");
}

import { Router } from '@thepassle/app-tools/router.js';
import { lazy } from '@thepassle/app-tools/router/plugins/lazy.js';

// @ts-ignore
import { title } from '@thepassle/app-tools/router/plugins/title.js';

import './pages/app-home.js';

const baseURL: string = (import.meta as any).env.BASE_URL;

export const router = new Router({
    routes: [
      {
        path:baseURL,
        title: 'NOWA KRZYŻÓWKA',
        render: () => html`<app-home></app-home>`
      },


      {
        path: `${baseURL}cross-s-1`,
        title: 'Krzyżówka Mała',
        plugins: [
          lazy(() => import('./pages/app-cross/app-cross.js')),
        ],
        render: () => html`<app-cross size="S" difficulty=250></app-cross>`
      },
      {
        path: `${baseURL}cross-s-2`,
        title: 'Krzyżówka Mała',
        plugins: [
          lazy(() => import('./pages/app-cross/app-cross.js')),
        ],
        render: () => html`<app-cross size="S" difficulty=75></app-cross>`
      },
      {
        path: `${baseURL}cross-s-3`,
        title: 'Krzyżówka Mała',
        plugins: [
          lazy(() => import('./pages/app-cross/app-cross.js')),
        ],
        render: () => html`<app-cross size="S" difficulty=25></app-cross>`
      },
      {
        path: `${baseURL}cross-s-4`,
        title: 'Krzyżówka Mała',
        plugins: [
          lazy(() => import('./pages/app-cross/app-cross.js')),
        ],
        render: () => html`<app-cross size="S" difficulty=8></app-cross>`
      },
      {
        path: `${baseURL}cross-s-5`,
        title: 'Krzyżówka Mała',
        plugins: [
          lazy(() => import('./pages/app-cross/app-cross.js')),
        ],
        render: () => html`<app-cross size="S" difficulty=3></app-cross>`
      },



      {
        path: `${baseURL}cross-m-1`,
        title: 'Krzyżówka Średnia',
        plugins: [
          lazy(() => import('./pages/app-cross/app-cross.js')),
        ],
        render: () => html`<app-cross size="M" difficulty=250></app-cross>`
      },
      {
        path: `${baseURL}cross-m-2`,
        title: 'Krzyżówka Średnia',
        plugins: [
          lazy(() => import('./pages/app-cross/app-cross.js')),
        ],
        render: () => html`<app-cross size="M" difficulty=75></app-cross>`
      },
      {
        path: `${baseURL}cross-m-3`,
        title: 'Krzyżówka Średnia',
        plugins: [
          lazy(() => import('./pages/app-cross/app-cross.js')),
        ],
        render: () => html`<app-cross size="M" difficulty=25></app-cross>`
      },      {
        path: `${baseURL}cross-m-4`,
        title: 'Krzyżówka Średnia',
        plugins: [
          lazy(() => import('./pages/app-cross/app-cross.js')),
        ],
        render: () => html`<app-cross size="M" difficulty=8></app-cross>`
      },
      {
        path: `${baseURL}cross-m-5`,
        title: 'Krzyżówka Średnia',
        plugins: [
          lazy(() => import('./pages/app-cross/app-cross.js')),
        ],
        render: () => html`<app-cross size="M" difficulty=3></app-cross>`
      },


      {
        path: `${baseURL}cross-l-1`,
        title: 'Krzyżówka Duża',
        plugins: [
          lazy(() => import('./pages/app-cross/app-cross.js')),
        ],
        render: () => html`<app-cross size="L" difficulty=250></app-cross>`
      },
      {
        path: `${baseURL}cross-l-2`,
        title: 'Krzyżówka Duża',
        plugins: [
          lazy(() => import('./pages/app-cross/app-cross.js')),
        ],
        render: () => html`<app-cross size="L" difficulty=75></app-cross>`
      },
      {
        path: `${baseURL}cross-l-3`,
        title: 'Krzyżówka Duża',
        plugins: [
          lazy(() => import('./pages/app-cross/app-cross.js')),
        ],
        render: () => html`<app-cross size="L" difficulty=8></app-cross>`
      },
      {
        path: `${baseURL}cross-l-4`,
        title: 'Krzyżówka Duża',
        plugins: [
          lazy(() => import('./pages/app-cross/app-cross.js')),
        ],
        render: () => html`<app-cross size="L" difficulty=8></app-cross>`
      },
      {
        path: `${baseURL}cross-l-5`,
        title: 'Krzyżówka Duża',
        plugins: [
          lazy(() => import('./pages/app-cross/app-cross.js')),
        ],
        render: () => html`<app-cross size="L" difficulty=3></app-cross>`
      },






      {
        path: `${baseURL}editor`,
        title: 'Edytor',
        plugins: [
          lazy(() => import('./pages/app-editor/app-editor.js')),
        ],
        render: () => html`<app-editor></app-editor>`
      }
    ]
  });
