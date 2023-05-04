import { PropController } from '../../prop-controllers/instances'
import { Descendant, Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import { BoxModel } from '../../box-model'

export type RichTextV2ControlData = Descendant[]

export const RichTextV2ControlType = 'makeswift::controls::rich-text-v2'

export type RichTextV2ControlDefinition = {
  type: typeof RichTextV2ControlType
}

export function unstable_RichTextV2(): RichTextV2ControlDefinition {
  return { type: RichTextV2ControlType }
}

export const RichTextV2ControlMessageType = {
  // COSMOS -> HOST
  RESET_VALUE: 'RESET_VALUE',
  FOCUS: 'FOCUS',

  // HOST -> COSMOS
  SET_DEFAULT_VALUE: 'SET_DEFAULT_VALUE',
  ON_CHANGE: 'ON_CHANGE',
  SELECT: 'SELECT',
  SWITCH_TO_BUILD_MODE: 'SWITCH_TO_BUILD_MODE',
  CHANGE_BOX_MODEL: 'CHANGE_BOX_MODEL',
} as const

type OnChangeRichTextControlMessage = {
  type: typeof RichTextV2ControlMessageType.ON_CHANGE
  value: RichTextV2ControlData
}

type SetDefaultValueRichTextControlMessage = {
  type: typeof RichTextV2ControlMessageType.SET_DEFAULT_VALUE
  value: RichTextV2ControlData
}

type ResetValueRichTextControlMessage = { type: typeof RichTextV2ControlMessageType.RESET_VALUE }

type SelectRichTextControlMessage = { type: typeof RichTextV2ControlMessageType.SELECT }

type FocusRichTextControlMessage = { type: typeof RichTextV2ControlMessageType.FOCUS }

type SwitchToBuildModeRichTextControlMessage = {
  type: typeof RichTextV2ControlMessageType.SWITCH_TO_BUILD_MODE
}

type BoxModelChangeRichControlMessage = {
  type: typeof RichTextV2ControlMessageType.CHANGE_BOX_MODEL
  payload: { boxModel: BoxModel | null }
}

export type RichTextV2ControlMessage =
  | OnChangeRichTextControlMessage
  | SetDefaultValueRichTextControlMessage
  | ResetValueRichTextControlMessage
  | FocusRichTextControlMessage
  | SelectRichTextControlMessage
  | SwitchToBuildModeRichTextControlMessage
  | BoxModelChangeRichControlMessage

export class RichTextV2Control extends PropController<RichTextV2ControlMessage> {
  private editor: Editor | null = null
  private defaultValue: RichTextV2ControlData | null = null

  recv = (message: RichTextV2ControlMessage): void => {
    if (!this.editor) return
    switch (message.type) {
      case RichTextV2ControlMessageType.FOCUS: {
        ReactEditor.focus(this.editor)
        Transforms.select(this.editor, {
          anchor: Editor.start(this.editor, []),
          focus: Editor.end(this.editor, []),
        })
        break
      }
      case RichTextV2ControlMessageType.RESET_VALUE: {
        if (this.defaultValue) {
          this.editor.selection = null
          this.editor.children = this.defaultValue
          this.editor.onChange()
        }
      }
    }
  }

  setEditor(editor: Editor) {
    this.editor = editor
  }

  setDefaultValue(defaultValue: RichTextV2ControlData) {
    this.defaultValue = defaultValue
    this.send({ type: RichTextV2ControlMessageType.SET_DEFAULT_VALUE, value: defaultValue })
  }

  select() {
    this.send({ type: RichTextV2ControlMessageType.SELECT })
  }

  switchToBuildMode() {
    this.send({ type: RichTextV2ControlMessageType.SWITCH_TO_BUILD_MODE })
  }

  onChange(value: Descendant[]) {
    this.send({
      type: RichTextV2ControlMessageType.ON_CHANGE,
      value,
    })
  }

  changeBoxModel(boxModel: BoxModel | null): void {
    this.send({ type: RichTextV2ControlMessageType.CHANGE_BOX_MODEL, payload: { boxModel } })
  }
}
