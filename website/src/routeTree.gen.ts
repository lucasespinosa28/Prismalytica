/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as ChatImport } from './routes/chat'
import { Route as AnalysisImport } from './routes/analysis'
import { Route as IndexImport } from './routes/index'

// Create/Update Routes

const ChatRoute = ChatImport.update({
  id: '/chat',
  path: '/chat',
  getParentRoute: () => rootRoute,
} as any)

const AnalysisRoute = AnalysisImport.update({
  id: '/analysis',
  path: '/analysis',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/analysis': {
      id: '/analysis'
      path: '/analysis'
      fullPath: '/analysis'
      preLoaderRoute: typeof AnalysisImport
      parentRoute: typeof rootRoute
    }
    '/chat': {
      id: '/chat'
      path: '/chat'
      fullPath: '/chat'
      preLoaderRoute: typeof ChatImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/analysis': typeof AnalysisRoute
  '/chat': typeof ChatRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/analysis': typeof AnalysisRoute
  '/chat': typeof ChatRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/analysis': typeof AnalysisRoute
  '/chat': typeof ChatRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/analysis' | '/chat'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/analysis' | '/chat'
  id: '__root__' | '/' | '/analysis' | '/chat'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AnalysisRoute: typeof AnalysisRoute
  ChatRoute: typeof ChatRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AnalysisRoute: AnalysisRoute,
  ChatRoute: ChatRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/analysis",
        "/chat"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/analysis": {
      "filePath": "analysis.tsx"
    },
    "/chat": {
      "filePath": "chat.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
