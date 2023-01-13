import { ReactNode, useEffect, useMemo } from 'react'

import { StoreContext, storeContextDefaultValue } from '..'
import * as ReactPage from '../../../state/react-page'
import { MakeswiftProvider, MakeswiftClient } from '../../../api/react'
import { registerDocumentEffect } from '../../../state/actions'

type Props = {
  client: MakeswiftClient
  rootElements?: Map<string, ReactPage.Element>
  children?: ReactNode
}

export default function LiveProvider({ client, children, rootElements }: Props): JSX.Element {
  const store = useMemo(
    () =>
      ReactPage.configureStore({
        preloadedState: storeContextDefaultValue.getState(),
        rootElements,
      }),
    [rootElements],
  )

  useEffect(() => {
    const unregisterDocuments = Array.from(rootElements?.entries() ?? []).map(
      ([documentKey, rootElement]) =>
        store.dispatch(registerDocumentEffect(ReactPage.createDocument(documentKey, rootElement))),
    )

    return () => {
      unregisterDocuments.forEach(unregisterDocument => {
        unregisterDocument()
      })
    }
  }, [store, rootElements])

  return (
    <StoreContext.Provider value={store}>
      <MakeswiftProvider client={client}>{children}</MakeswiftProvider>
    </StoreContext.Provider>
  )
}