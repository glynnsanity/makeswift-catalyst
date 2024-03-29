import { Editor, NodeEntry, Text } from 'slate'
import { ElementUtils } from '../utils/element'
import { LinkElement } from '../types'
import { getSelection } from '../selectors'
import { filterForSubtreeRoots } from '../BlockPlugin/utils/filterForSubtreeRoots'
import { isLinkElement } from './types'
import deepEqual from '../../utils/deepEqual'

export function getLinksAndTextInSelection(editor: Editor): NodeEntry<LinkElement | Text>[] {
  return Array.from(
    Editor.nodes(editor, {
      at: getSelection(editor),
      match: node => (ElementUtils.isInline(node) && isLinkElement(node)) || Text.isText(node),
    }),
  ) as NodeEntry<Text | LinkElement>[]
}

export const getValue = (editor: Editor) => {
  const roots = filterForSubtreeRoots(getLinksAndTextInSelection(editor))

  const areAllRootsLinks = roots.every(([root]) => isLinkElement(root) || Text.isText(root))

  if (!areAllRootsLinks) return undefined

  const matchingValues = roots.map(([node]) => node).filter(isLinkElement) as (
    | LinkElement
    | null
    | undefined
  )[]

  const match = matchingValues.reduce(
    (a, b) => (deepEqual(a?.link, b?.link) ? b : null),
    matchingValues.at(0) ?? undefined,
  )

  return match == null ? match : match.link
}
