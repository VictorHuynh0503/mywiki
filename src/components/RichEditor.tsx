import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import {
  Bold, Italic, UnderlineIcon, Strikethrough, Code, List,
  ListOrdered, Quote, Heading1, Heading2, Heading3,
  Image as ImageIcon, Link as LinkIcon, CheckSquare, Minus
} from 'lucide-react'
import { uploadImage } from '../hooks/useArticles'

interface Props {
  content: string
  onChange: (html: string) => void
}

export default function RichEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Start writing your article…' }),
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  // Update editor content when the content prop changes (e.g., when loading an article for editing)
  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) return null

  const btn = (active: boolean, onClick: () => void, icon: React.ReactNode, title?: string) => (
    <button
      type="button"
      className={`toolbar-btn ${active ? 'active' : ''}`}
      onClick={onClick}
      title={title}
    >
      {icon}
    </button>
  )

  const handleImageUpload = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      const url = await uploadImage(file)
      if (url) {
        editor.chain().focus().setImage({ src: url }).run()
      } else {
        alert('Failed to upload image. Make sure the "article-images" bucket exists in Supabase and is set to public.')
      }
    }
    input.click()
  }

  const handlePaste = async (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.type.indexOf('image') === 0) {
        event.preventDefault()
        const file = item.getAsFile()
        if (!file) return

        const url = await uploadImage(file)
        if (url) {
          editor.chain().focus().setImage({ src: url }).run()
        } else {
          // Fallback: use base64 for clipboard images
          const reader = new FileReader()
          reader.onload = (e) => {
            const base64 = e.target?.result as string
            editor.chain().focus().setImage({ src: base64 }).run()
          }
          reader.readAsDataURL(file)
        }
        break
      }
    }
  }

  const setLink = () => {
    const url = window.prompt('Enter URL')
    if (url) editor.chain().focus().setLink({ href: url }).run()
    else editor.chain().focus().unsetLink().run()
  }

  return (
    <div className="editor-wrapper">
      <div className="toolbar">
        {btn(editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), <Bold size={15} />, 'Bold')}
        {btn(editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), <Italic size={15} />, 'Italic')}
        {btn(editor.isActive('underline'), () => editor.chain().focus().toggleUnderline().run(), <UnderlineIcon size={15} />, 'Underline')}
        {btn(editor.isActive('strike'), () => editor.chain().focus().toggleStrike().run(), <Strikethrough size={15} />, 'Strike')}
        {btn(editor.isActive('code'), () => editor.chain().focus().toggleCode().run(), <Code size={15} />, 'Inline code')}

        <div className="toolbar-sep" />

        {btn(editor.isActive('heading', { level: 1 }), () => editor.chain().focus().toggleHeading({ level: 1 }).run(), <Heading1 size={15} />, 'H1')}
        {btn(editor.isActive('heading', { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2 size={15} />, 'H2')}
        {btn(editor.isActive('heading', { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), <Heading3 size={15} />, 'H3')}

        <div className="toolbar-sep" />

        {btn(editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), <List size={15} />, 'Bullet list')}
        {btn(editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered size={15} />, 'Numbered list')}
        {btn(editor.isActive('taskList'), () => editor.chain().focus().toggleTaskList().run(), <CheckSquare size={15} />, 'Task list')}
        {btn(editor.isActive('blockquote'), () => editor.chain().focus().toggleBlockquote().run(), <Quote size={15} />, 'Quote')}
        {btn(editor.isActive('codeBlock'), () => editor.chain().focus().toggleCodeBlock().run(), <Code size={15} />, 'Code block')}

        <div className="toolbar-sep" />

        {btn(false, () => editor.chain().focus().setHorizontalRule().run(), <Minus size={15} />, 'Divider')}
        {btn(editor.isActive('link'), setLink, <LinkIcon size={15} />, 'Insert link')}
        {btn(false, handleImageUpload, <ImageIcon size={15} />, 'Upload image')}
      </div>

      <EditorContent 
        editor={editor} 
        className="editor-content"
        onPaste={handlePaste}
      />
    </div>
  )
}
