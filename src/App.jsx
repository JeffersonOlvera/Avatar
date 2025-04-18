import { ConsolePage } from "./pages/Consolepage";
import ResponsiveLayout from "./components/ResponsiveLayout/ResponsiveLayout";
import TagPowerBy from "./components/TagPoweBy/PoweredByFooter";
function App() {
  return (
    <div data-component="App">
      <ResponsiveLayout>
        <ConsolePage />
        <TagPowerBy />
      </ResponsiveLayout>
    </div>
  );
}

export default App;
