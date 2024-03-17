import React, { createContext, useContext, useState } from "react";

const RefreshContext = createContext();

export const useRefresh = () => useContext(RefreshContext);

export const RefreshProvider = ({ children }) => {
  const [needsRefresh1, setNeedsRefresh1] = useState(false);
  const [needsRefresh2, setNeedsRefresh2] = useState(false);
  const [needsRefresh3, setNeedsRefresh3] = useState(false);
  const [needsRefresh4, setNeedsRefresh4] = useState(false);

  return (
    <RefreshContext.Provider
      value={{
        needsRefresh1,
        setNeedsRefresh1,
        needsRefresh2,
        setNeedsRefresh2,
        needsRefresh3,
        setNeedsRefresh3,
        needsRefresh4,
        setNeedsRefresh4
      }}
    >
      {children}
    </RefreshContext.Provider>
  );
};
