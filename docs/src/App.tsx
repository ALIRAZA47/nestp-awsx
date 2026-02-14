import { Navigate, Route, Routes } from "react-router-dom";
import { DocsLayout } from "@/components/docs-layout";
import { ApiReferencePage } from "@/pages/api-reference";
import { CliPage } from "@/pages/cli";
import { ConfigurationPage } from "@/pages/configuration";
import { CredentialsPage } from "@/pages/credentials";
import { DependencyInjectionPage } from "@/pages/dependency-injection";
import { ExamplesPage } from "@/pages/examples";
import { InstallationPage } from "@/pages/installation";
import { IntroductionPage } from "@/pages/introduction";
import { Route53Page } from "@/pages/service-route53";
import { S3Page } from "@/pages/service-s3";
import { SesPage } from "@/pages/service-ses";
import { SqsPage } from "@/pages/service-sqs";
import { ServicesOverviewPage } from "@/pages/services-overview";
import { WebAnalyticsPage } from "@/pages/web-analytics";

export default function App() {
  return (
    <Routes>
      <Route element={<DocsLayout />}>
        <Route path="/" element={<IntroductionPage />} />
        <Route path="/installation" element={<InstallationPage />} />
        <Route path="/web-analytics" element={<WebAnalyticsPage />} />
        <Route path="/configuration" element={<ConfigurationPage />} />
        <Route path="/credentials" element={<CredentialsPage />} />
        <Route path="/dependency-injection" element={<DependencyInjectionPage />} />
        <Route path="/services" element={<ServicesOverviewPage />} />
        <Route path="/services/s3" element={<S3Page />} />
        <Route path="/services/sqs" element={<SqsPage />} />
        <Route path="/services/ses" element={<SesPage />} />
        <Route path="/services/route53" element={<Route53Page />} />
        <Route path="/cli" element={<CliPage />} />
        <Route path="/examples" element={<ExamplesPage />} />
        <Route path="/api-reference" element={<ApiReferencePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
