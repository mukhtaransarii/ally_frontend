import { createContext, useContext, useState } from 'react';

const PartnerContext = createContext()

export const PartnerProvider = ({children}) => {
  const [companion, setCompanion] = useState(null)
  const [parCurLoc, setParCurLoc] = useState(null)
  const [step, setStep] = useState(1)
  
  console.log("id:", "PartnerContext")
  console.log("parCurLoc:", parCurLoc)
  return (
    <PartnerContext.Provider
      value={{
       companion, setCompanion,
       parCurLoc, setParCurLoc,
       step, setStep,
      }}
    >
     {children}   
    </PartnerContext.Provider>
  );
}

export const usePartner = () => useContext(PartnerContext)