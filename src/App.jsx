import { ConsolePage } from "./pages/Consolepage";
import ResponsiveLayout from "./components/ResponsiveLayout/ResponsiveLayout";

function App() {
  return (
    <div data-component="App">
      <ResponsiveLayout>
        <ConsolePage />
      </ResponsiveLayout>
    </div>
  );
}

export default App;
