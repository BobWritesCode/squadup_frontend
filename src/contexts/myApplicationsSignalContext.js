import { createContext } from 'react';

const myApplicationsSignalContext = createContext({
  myApplicationsSignal: false,
  setMyApplicationsSignal: () => {},
});

export default myApplicationsSignalContext;
