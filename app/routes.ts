import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route('/about', 'routes/about.tsx'),
    route('/contact', 'routes/contact/index.tsx'),
    route('/auth', 'routes/auth/auth.tsx'),
    route('dashboard', 'routes/dashboard/index.tsx',[
        index('routes/dashboard/home.tsx'),
        route('profile', 'routes/dashboard/profile.tsx'),
        route('settings', 'routes/dashboard/settings.tsx'),
        route('link', 'routes/dashboard/link.tsx'),
    ]),
    route('plan','routes/dashboard/plan.tsx'),
    route('upload', 'routes/upload/index.tsx'),
    route('/*','components/not-found.tsx')
] satisfies RouteConfig;
