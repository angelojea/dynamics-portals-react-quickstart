import {
    HomePage, Page1, Page2, Page3, RegisterCallbackPage,
} from "../pages";

export enum Route {
    Home = '/',
    Page1 = '/page-1',
    Page2 = '/page-2',
    Page3 = '/page-3',
    RegisterCallback = '/register-callback'
}

export const Routes: RoutesModule = {
    Home: { path: Route.Home, component: HomePage, },
    Page1: { path: Route.Page1, component: Page1, },
    Page2: { path: Route.Page2, component: Page2, },
    Page3: { path: Route.Page3, component: Page3, },
    RegisterCallback: { path: Route.RegisterCallback, component: RegisterCallbackPage, },
}

export interface RoutesModule {
    Home: RouteConfig,
    Page1: RouteConfig,
    Page2: RouteConfig,
    Page3: RouteConfig,
    RegisterCallback: RouteConfig,
}

export interface RouteConfig {
    path: Route,
    component: any,
}
