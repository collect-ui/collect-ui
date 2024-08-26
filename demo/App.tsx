import React from 'react';
import { Render,setRegister  } from "../src/index"
import CoderPreview from "./components/coder-preview"
setRegister('coder-preview',CoderPreview)
import config from "./data/app.json"
const App = () => {
    return <Render {...config}/>
};

export default App;