import { RenderLeafProps } from 'slate-react'
import { RichTextV2ControlDefinition } from '../../../../../controls'
import { ControlValue } from '../../control'
import { RichTextV2Plugin } from '../../../../../controls/rich-text-v2/plugin'

type RichTextV2LeafProps = RenderLeafProps & {
  definition: RichTextV2ControlDefinition
  plugins: RichTextV2Plugin[]
}

export function RichTextV2Leaf({ definition, plugins, ...props }: RichTextV2LeafProps) {
  function initialRenderLeaf({ attributes, children, leaf }: RenderLeafProps) {
    return (
      <span className={leaf.className} {...attributes}>
        {children}
      </span>
    )
  }

  const renderLeaf = plugins.reduce(
    (renderFn, plugin) => (props: RenderLeafProps) => {
      const { control, renderLeaf } = plugin

      if (control?.definition == null || renderLeaf == null) return renderFn(props)

      if (control.getLeafValue == null) return renderLeaf(renderFn, undefined)(props)

      return (
        <ControlValue definition={control.definition} data={control.getLeafValue(props.leaf)}>
          {value => renderLeaf(renderFn, value)(props)}
        </ControlValue>
      )
    },
    initialRenderLeaf,
  )

  return renderLeaf(props)
}
