import { createContext, useState } from 'react';

const ExampleContext = createContext();

export const  = ({ children }) => {
  const [state, setState] = useState(null);

  return (
    <ExampleContext.Provider value={{ state, setState }}>
      {children}
    </ExampleContext.Provider>
  );
};

export default ExampleContext;
