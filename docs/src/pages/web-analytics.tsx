import { DocHeader } from "@/components/doc-header";
import { CodeBlock } from "@/components/code-block";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const vercelInstallBlock = `pnpm i vercel`;

const vercelInstallNpmBlock = `npm i vercel`;

const vercelInstallYarnBlock = `yarn i vercel`;

const vercelInstallBunBlock = `bun i vercel`;

const analyticsInstallBlock = `pnpm i @vercel/analytics`;

const analyticsInstallNpmBlock = `npm i @vercel/analytics`;

const analyticsInstallYarnBlock = `yarn i @vercel/analytics`;

const analyticsInstallBunBlock = `bun i @vercel/analytics`;

const nextjsPagesAppTsx = `import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/next";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default MyApp;`;

const nextjsPagesAppJsx = `import { Analytics } from "@vercel/analytics/next";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default MyApp;`;

const nextjsAppLayoutTsx = `import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}`;

const nextjsAppLayoutJsx = `import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}`;

const remixRootTsx = `import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Analytics } from "@vercel/analytics/remix";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Analytics />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}`;

const remixRootJsx = `import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Analytics } from "@vercel/analytics/remix";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Analytics />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}`;

const nuxtAppVueTsx = `<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt';
</script>

<template>
  <Analytics />
  <NuxtPage />
</template>`;

const nuxtAppVueJsx = `<script setup>
import { Analytics } from '@vercel/analytics/nuxt';
</script>

<template>
  <Analytics />
  <NuxtPage />
</template>`;

const sveltekitLayoutTs = `import { dev } from "$app/environment";
import { injectAnalytics } from "@vercel/analytics/sveltekit";

injectAnalytics({ mode: dev ? "development" : "production" });`;

const sveltekitLayoutJs = `import { dev } from "$app/environment";
import { injectAnalytics } from "@vercel/analytics/sveltekit";

injectAnalytics({ mode: dev ? "development" : "production" });`;

const astroBaseLayoutTsx = `---
import Analytics from '@vercel/analytics/astro';
{/* ... */}
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <!-- ... -->
    <Analytics />
  </head>
  <body>
    <slot />
  </body>
</html>`;

const astroBaseLayoutJsx = `---
import Analytics from '@vercel/analytics/astro';
{/* ... */}
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <!-- ... -->
    <Analytics />
  </head>
  <body>
    <slot />
  </body>
</html>`;

const astroConfigMjsTs = `import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  output: "server",
  adapter: vercel({
    webAnalytics: {
      enabled: true, // set to false when using @vercel/analytics@1.4.0
    },
  }),
});`;

const astroConfigMjsJs = `import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  output: "server",
  adapter: vercel({
    webAnalytics: {
      enabled: true, // set to false when using @vercel/analytics@1.4.0
    },
  }),
});`;

const htmlScriptTs = `<script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>`;

const htmlScriptJs = `<script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>`;

const otherInjectTs = `import { inject } from "@vercel/analytics";

inject();`;

const otherInjectJs = `import { inject } from "@vercel/analytics";

inject();`;

const reactAppTsx = `import { Analytics } from "@vercel/analytics/react";

export default function App() {
  return (
    <div>
      {/* ... */}
      <Analytics />
    </div>
  );
}`;

const reactAppJsx = `import { Analytics } from "@vercel/analytics/react";

export default function App() {
  return (
    <div>
      {/* ... */}
      <Analytics />
    </div>
  );
}`;

const vueAppVueTsx = `<script setup lang="ts">
import { Analytics } from '@vercel/analytics/vue';
</script>

<template>
  <Analytics />
  <!-- your content -->
</template>`;

const vueAppVueJsx = `<script setup>
import { Analytics } from '@vercel/analytics/vue';
</script>

<template>
  <Analytics />
  <!-- your content -->
</template>`;

const deployBlock = `vercel deploy`;

export function WebAnalyticsPage() {
  return (
    <div className="space-y-6">
      <DocHeader
        badge="Getting Started"
        title="Vercel Web Analytics"
        description="Get started with using Vercel Web Analytics on your project. Learn how to enable it, add the package, deploy your app, and view data in the dashboard."
      />

      <Card>
        <CardHeader>
          <CardTitle>Prerequisites</CardTitle>
        </CardHeader>
        <CardContent className="docs-prose">
          <ul>
            <li>A Vercel account. If you don't have one, you can <a href="https://vercel.com/signup" target="_blank" rel="noopener noreferrer">sign up for free</a>.</li>
            <li>A Vercel project. If you don't have one, you can <a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer">create a new project</a>.</li>
            <li>The Vercel CLI installed.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Install Vercel CLI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CodeBlock code={vercelInstallBlock} language="bash" fileName="terminal" />
          <div className="space-y-2">
            <p className="text-sm font-medium">Other package managers:</p>
            <CodeBlock code={vercelInstallYarnBlock} language="bash" fileName="terminal (yarn)" />
            <CodeBlock code={vercelInstallNpmBlock} language="bash" fileName="terminal (npm)" />
            <CodeBlock code={vercelInstallBunBlock} language="bash" fileName="terminal (bun)" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Enable Web Analytics in Vercel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
          <p>On the Vercel dashboard, select your Project and then click the <span className="font-semibold text-foreground">Analytics</span> tab and click <span className="font-semibold text-foreground">Enable</span> from the dialog.</p>
          <div className="rounded-lg border border-blue-200/20 bg-blue-50/10 p-4">
            <p className="text-sm text-blue-200">💡 <span className="font-semibold">Note:</span> Enabling Web Analytics will add new routes (scoped at <code className="rounded bg-blue-900/30 px-1.5 py-0.5 text-xs">/_vercel/insights/*</code>) after your next deployment.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add @vercel/analytics to your project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Using the package manager of your choice, add the <code className="rounded bg-muted px-1.5 py-0.5 text-xs">@vercel/analytics</code> package to your project:</p>
          <CodeBlock code={analyticsInstallBlock} language="bash" fileName="terminal" />
          <div className="space-y-2">
            <p className="text-sm font-medium">Other package managers:</p>
            <CodeBlock code={analyticsInstallYarnBlock} language="bash" fileName="terminal (yarn)" />
            <CodeBlock code={analyticsInstallNpmBlock} language="bash" fileName="terminal (npm)" />
            <CodeBlock code={analyticsInstallBunBlock} language="bash" fileName="terminal (bun)" />
          </div>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Framework Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
          <p>Select your framework below to view instructions on integrating Vercel Web Analytics:</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next.js (Pages Directory)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">The <code className="rounded bg-muted px-1.5 py-0.5 text-xs">Analytics</code> component is a wrapper around the tracking script, offering more seamless integration with Next.js, including route support.</p>
          <p className="text-sm text-muted-foreground">If you are using the <code className="rounded bg-muted px-1.5 py-0.5 text-xs">pages</code> directory, add the following code to your main app file:</p>
          <CodeBlock code={nextjsPagesAppTsx} language="tsx" fileName="pages/_app.tsx" />
          <p className="text-sm font-medium">JavaScript version:</p>
          <CodeBlock code={nextjsPagesAppJsx} language="jsx" fileName="pages/_app.js" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next.js (App Directory)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">The <code className="rounded bg-muted px-1.5 py-0.5 text-xs">Analytics</code> component is a wrapper around the tracking script, offering more seamless integration with Next.js, including route support.</p>
          <p className="text-sm text-muted-foreground">Add the following code to the root layout:</p>
          <CodeBlock code={nextjsAppLayoutTsx} language="tsx" fileName="app/layout.tsx" />
          <p className="text-sm font-medium">JavaScript version:</p>
          <CodeBlock code={nextjsAppLayoutJsx} language="jsx" fileName="app/layout.jsx" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Remix</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">The <code className="rounded bg-muted px-1.5 py-0.5 text-xs">Analytics</code> component is a wrapper around the tracking script, offering a seamless integration with Remix, including route detection.</p>
          <p className="text-sm text-muted-foreground">Add the following code to your root file:</p>
          <CodeBlock code={remixRootTsx} language="tsx" fileName="app/root.tsx" />
          <p className="text-sm font-medium">JavaScript version:</p>
          <CodeBlock code={remixRootJsx} language="jsx" fileName="app/root.jsx" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nuxt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">The <code className="rounded bg-muted px-1.5 py-0.5 text-xs">Analytics</code> component is a wrapper around the tracking script, offering more seamless integration with Nuxt, including route support.</p>
          <p className="text-sm text-muted-foreground">Add the following code to your main component:</p>
          <CodeBlock code={nuxtAppVueTsx} language="tsx" fileName="app.vue" />
          <p className="text-sm font-medium">JavaScript version:</p>
          <CodeBlock code={nuxtAppVueJsx} language="jsx" fileName="app.vue" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SvelteKit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">The <code className="rounded bg-muted px-1.5 py-0.5 text-xs">injectAnalytics</code> function is a wrapper around the tracking script, offering more seamless integration with SvelteKit, including route support.</p>
          <p className="text-sm text-muted-foreground">Add the following code to the main layout:</p>
          <CodeBlock code={sveltekitLayoutTs} language="ts" fileName="src/routes/+layout.ts" />
          <p className="text-sm font-medium">JavaScript version:</p>
          <CodeBlock code={sveltekitLayoutJs} language="js" fileName="src/routes/+layout.js" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Astro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">The <code className="rounded bg-muted px-1.5 py-0.5 text-xs">Analytics</code> component is a wrapper around the tracking script, offering more seamless integration with Astro, including route support.</p>
          <p className="text-sm text-muted-foreground">Add the following code to your base layout:</p>
          <CodeBlock code={astroBaseLayoutTsx} language="tsx" fileName="src/layouts/Base.astro" />
          <p className="text-sm font-medium">JavaScript version:</p>
          <CodeBlock code={astroBaseLayoutJsx} language="jsx" fileName="src/layouts/Base.astro" />
          <Separator className="my-4" />
          <div className="rounded-lg border border-blue-200/20 bg-blue-50/10 p-4 space-y-2">
            <p className="text-sm text-blue-200">💡 <span className="font-semibold">Note:</span> The <code className="rounded bg-blue-900/30 px-1.5 py-0.5 text-xs">Analytics</code> component is available in version <code className="rounded bg-blue-900/30 px-1.5 py-0.5 text-xs">@vercel/analytics@1.4.0</code> and later.</p>
            <p className="text-sm text-blue-200">If you are using an earlier version, you must configure the <code className="rounded bg-blue-900/30 px-1.5 py-0.5 text-xs">webAnalytics</code> property of the Vercel adapter in your <code className="rounded bg-blue-900/30 px-1.5 py-0.5 text-xs">astro.config.mjs</code> file as shown below.</p>
          </div>
          <p className="text-sm text-muted-foreground">Legacy configuration (for versions prior to 1.4.0):</p>
          <CodeBlock code={astroConfigMjsTs} language="ts" fileName="astro.config.mjs" />
          <p className="text-sm font-medium">JavaScript version:</p>
          <CodeBlock code={astroConfigMjsJs} language="js" fileName="astro.config.mjs" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create React App</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">The <code className="rounded bg-muted px-1.5 py-0.5 text-xs">Analytics</code> component is a wrapper around the tracking script, offering more seamless integration with React.</p>
          <div className="rounded-lg border border-blue-200/20 bg-blue-50/10 p-4">
            <p className="text-sm text-blue-200">💡 <span className="font-semibold">Note:</span> When using the plain React implementation, there is no route support.</p>
          </div>
          <p className="text-sm text-muted-foreground">Add the following code to the main app file:</p>
          <CodeBlock code={reactAppTsx} language="tsx" fileName="App.tsx" />
          <p className="text-sm font-medium">JavaScript version:</p>
          <CodeBlock code={reactAppJsx} language="jsx" fileName="App.jsx" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">The <code className="rounded bg-muted px-1.5 py-0.5 text-xs">Analytics</code> component is a wrapper around the tracking script, offering more seamless integration with Vue.</p>
          <div className="rounded-lg border border-blue-200/20 bg-blue-50/10 p-4">
            <p className="text-sm text-blue-200">💡 <span className="font-semibold">Note:</span> Route support is automatically enabled if you're using <code className="rounded bg-blue-900/30 px-1.5 py-0.5 text-xs">vue-router</code>.</p>
          </div>
          <p className="text-sm text-muted-foreground">Add the following code to your main component:</p>
          <CodeBlock code={vueAppVueTsx} language="tsx" fileName="src/App.vue" />
          <p className="text-sm font-medium">JavaScript version:</p>
          <CodeBlock code={vueAppVueJsx} language="jsx" fileName="src/App.vue" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plain HTML Sites</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">For plain HTML sites, you can add the following script to your <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.html</code> files:</p>
          <CodeBlock code={htmlScriptTs} language="ts" fileName="index.html" />
          <p className="text-sm font-medium">JavaScript version:</p>
          <CodeBlock code={htmlScriptJs} language="js" fileName="index.html" />
          <div className="rounded-lg border border-blue-200/20 bg-blue-50/10 p-4">
            <p className="text-sm text-blue-200">💡 <span className="font-semibold">Note:</span> When using the HTML implementation, there is no need to install the <code className="rounded bg-blue-900/30 px-1.5 py-0.5 text-xs">@vercel/analytics</code> package. However, there is no route support.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Other Frameworks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Import the <code className="rounded bg-muted px-1.5 py-0.5 text-xs">inject</code> function from the package, which will add the tracking script to your app. <span className="font-semibold">This should only be called once in your app, and must run in the client.</span></p>
          <div className="rounded-lg border border-blue-200/20 bg-blue-50/10 p-4">
            <p className="text-sm text-blue-200">💡 <span className="font-semibold">Note:</span> There is no route support with the <code className="rounded bg-blue-900/30 px-1.5 py-0.5 text-xs">inject</code> function.</p>
          </div>
          <p className="text-sm text-muted-foreground">Add the following code to your main app file:</p>
          <CodeBlock code={otherInjectTs} language="ts" fileName="main.ts" />
          <p className="text-sm font-medium">JavaScript version:</p>
          <CodeBlock code={otherInjectJs} language="js" fileName="main.js" />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Deploy your app to Vercel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Deploy your app using the following command:</p>
          <CodeBlock code={deployBlock} language="bash" fileName="terminal" />
          <p className="text-sm text-muted-foreground">If you haven't already, we also recommend connecting your project's Git repository, which will enable Vercel to deploy your latest commits to main without terminal commands.</p>
          <p className="text-sm text-muted-foreground">Once your app is deployed, it will start tracking visitors and page views.</p>
          <div className="rounded-lg border border-blue-200/20 bg-blue-50/10 p-4">
            <p className="text-sm text-blue-200">💡 <span className="font-semibold">Note:</span> If everything is set up properly, you should be able to see a Fetch/XHR request in your browser's Network tab from <code className="rounded bg-blue-900/30 px-1.5 py-0.5 text-xs">/_vercel/insights/view</code> when you visit any page.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>View your data in the dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
          <p>Once your app is deployed, and users have visited your site, you can view your data in the dashboard.</p>
          <p>To do so, go to your dashboard, select your project, and click the <span className="font-semibold text-foreground">Analytics</span> tab.</p>
          <p>After a few days of visitors, you'll be able to start exploring your data by viewing and filtering the panels.</p>
          <p>Users on Pro and Enterprise plans can also add custom events to their data to track user interactions such as button clicks, form submissions, or purchases.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy and Data Compliance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
          <p>Learn more about how Vercel supports privacy and data compliance standards with Vercel Web Analytics.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="docs-prose">
          <p>Now that you have Vercel Web Analytics set up, you can explore the following topics to learn more:</p>
          <ul>
            <li>Learn how to use the <code>@vercel/analytics</code> package</li>
            <li>Learn how to set up custom events</li>
            <li>Learn about filtering data</li>
            <li>Read about privacy and compliance</li>
            <li>Explore pricing</li>
            <li>Troubleshooting</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
