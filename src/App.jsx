// App.jsx — Root component. All other components render inside this.

import Pricing from './pages/Pricing';
import DebugProbe from './debug/DebugProbe';

function App() {
    return (
        <>
            <Pricing />
            <DebugProbe />
        </>
    );
}

export default App;
