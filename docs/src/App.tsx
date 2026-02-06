import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Overview from "./pages/Overview";
import Quickstart from "./pages/Quickstart";
import Config from "./pages/Config";
import Credentials from "./pages/Credentials";
import Services from "./pages/Services";
import Cli from "./pages/Cli";
import Overrides from "./pages/Overrides";
import Examples from "./pages/Examples";

const App = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<Overview />} />
      <Route path="/quickstart" element={<Quickstart />} />
      <Route path="/config" element={<Config />} />
      <Route path="/credentials" element={<Credentials />} />
      <Route path="/services" element={<Services />} />
      <Route path="/examples" element={<Examples />} />
      <Route path="/cli" element={<Cli />} />
      <Route path="/overrides" element={<Overrides />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);

export default App;
