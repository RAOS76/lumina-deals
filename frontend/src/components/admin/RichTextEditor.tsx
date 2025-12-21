'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { FontFamily } from '@tiptap/extension-font-family';
import { TextStyle } from '@tiptap/extension-text-style';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Heading3,
    Undo,
    Redo,
    Link as LinkIcon,
    Image as ImageIcon,
    Type,
    ChevronDown,
    Indent,
    Outdent
} from 'lucide-react';

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

const fonts = [
    { label: '-- Predeterminado --', value: '', category: 'default' },

    // Títulos (Display Fonts)
    { label: 'Montserrat', value: 'Montserrat, sans-serif', category: 'titles' },
    { label: 'Poppins', value: 'Poppins, sans-serif', category: 'titles' },
    { label: 'Raleway', value: 'Raleway, sans-serif', category: 'titles' },
    { label: 'Bebas Neue', value: 'Bebas Neue, sans-serif', category: 'titles' },
    { label: 'Oswald', value: 'Oswald, sans-serif', category: 'titles' },

    // Cuerpo (Body Fonts)
    { label: 'Inter', value: 'Inter, sans-serif', category: 'body' },
    { label: 'Lora', value: 'Lora, serif', category: 'body' },
    { label: 'Merriweather', value: 'Merriweather, serif', category: 'body' },
    { label: 'Source Sans Pro', value: 'Source Sans Pro, sans-serif', category: 'body' },
    { label: 'Roboto', value: 'Roboto, sans-serif', category: 'body' },
    { label: 'Open Sans', value: 'Open Sans, sans-serif', category: 'body' },

    // Acentos (Accent Fonts)
    { label: 'Playfair Display', value: 'Playfair Display, serif', category: 'accents' },
    { label: 'Crimson Text', value: 'Crimson Text, serif', category: 'accents' },
    { label: 'Libre Baskerville', value: 'Libre Baskerville, serif', category: 'accents' },
    { label: 'Cormorant Garamond', value: 'Cormorant Garamond, serif', category: 'accents' },
];

const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    children,
    title
}: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`p-2 rounded-lg transition-all active:scale-90 ${isActive
            ? 'bg-indigo-100 text-indigo-600 shadow-sm'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            } disabled:opacity-30`}
    >
        {children}
    </button>
);

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            FontFamily,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Link.configure({
                openOnClick: false,
            }),
            Image,
            Placeholder.configure({
                placeholder: placeholder || 'Empieza a escribir tu historia...',
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg prose-slate max-w-none focus:outline-none min-h-[500px] p-8 font-serif leading-relaxed',
                style: 'white-space: pre-wrap;'
            },
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm">
            {/* Word-Style Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50/50 border-b border-slate-100 backdrop-blur-sm sticky top-0 z-10">
                {/* Font Selector */}
                <div className="flex items-center gap-1 pr-2 border-r border-slate-200">
                    <div className="relative group">
                        <select
                            onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
                            className="appearance-none bg-white border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-xs font-medium text-slate-700 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
                            value={editor.getAttributes('textStyle').fontFamily || ''}
                        >
                            <option value="">Tipografía</option>
                            <optgroup label="📝 Títulos">
                                {fonts.filter(f => f.category === 'titles').map((font) => (
                                    <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                                        {font.label}
                                    </option>
                                ))}
                            </optgroup>
                            <optgroup label="📖 Cuerpo">
                                {fonts.filter(f => f.category === 'body').map((font) => (
                                    <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                                        {font.label}
                                    </option>
                                ))}
                            </optgroup>
                            <optgroup label="✨ Acentos">
                                {fonts.filter(f => f.category === 'accents').map((font) => (
                                    <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                                        {font.label}
                                    </option>
                                ))}
                            </optgroup>
                        </select>
                        <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>

                <div className="flex items-center gap-1 px-2 border-r border-slate-200">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        isActive={editor.isActive('heading', { level: 1 })}
                        title="Título 1"
                    >
                        <Heading1 className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                        title="Título 2"
                    >
                        <Heading2 className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        isActive={editor.isActive('heading', { level: 3 })}
                        title="Título 3"
                    >
                        <Heading3 className="w-4 h-4" />
                    </ToolbarButton>
                </div>

                <div className="flex items-center gap-1 px-2 border-r border-slate-200">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        title="Negrita"
                    >
                        <Bold className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        title="Itálica"
                    >
                        <Italic className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        isActive={editor.isActive('underline')}
                        title="Subrayado"
                    >
                        <UnderlineIcon className="w-4 h-4" />
                    </ToolbarButton>
                </div>

                <div className="flex items-center gap-1 px-2 border-r border-slate-200">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        isActive={editor.isActive({ textAlign: 'left' })}
                        title="Alinear a la izquierda"
                    >
                        <AlignLeft className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        isActive={editor.isActive({ textAlign: 'center' })}
                        title="Centrar"
                    >
                        <AlignCenter className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        isActive={editor.isActive({ textAlign: 'right' })}
                        title="Alinear a la derecha"
                    >
                        <AlignRight className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                        isActive={editor.isActive({ textAlign: 'justify' })}
                        title="Justificar"
                    >
                        <AlignJustify className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => {
                            // Insert actual non-breaking space characters (U+00A0)
                            editor.commands.insertContent('\u00A0\u00A0\u00A0\u00A0');
                        }}
                        title="Agregar sangría (4 espacios)"
                    >
                        <Indent className="w-4 h-4" />
                    </ToolbarButton>
                </div>

                <div className="flex items-center gap-1 px-2 border-r border-slate-200">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        title="Lista de viñetas"
                    >
                        <List className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        title="Lista numerada"
                    >
                        <ListOrdered className="w-4 h-4" />
                    </ToolbarButton>
                </div>

                <div className="flex items-center gap-1 px-2 border-r border-slate-200">
                    <ToolbarButton
                        onClick={() => {
                            const url = window.prompt('URL del enlace:');
                            if (url) {
                                editor.chain().focus().setLink({ href: url }).run();
                            }
                        }}
                        isActive={editor.isActive('link')}
                        title="Insertar enlace"
                    >
                        <LinkIcon className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => {
                            const url = window.prompt('URL de la imagen:');
                            if (url) {
                                editor.chain().focus().setImage({ src: url }).run();
                            }
                        }}
                        title="Insertar imagen"
                    >
                        <ImageIcon className="w-4 h-4" />
                    </ToolbarButton>
                </div>

                <div className="flex items-center gap-1 pl-2 ml-auto">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        title="Deshacer"
                    >
                        <Undo className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        title="Rehacer"
                    >
                        <Redo className="w-4 h-4" />
                    </ToolbarButton>
                </div>
            </div>

            {/* Editor Content Area */}
            <div className="flex-1 overflow-y-auto bg-slate-50/30 custom-scrollbar">
                <div className="max-w-4xl mx-auto my-8 bg-white shadow-sm border border-slate-100 min-h-[800px] rounded-sm ring-1 ring-slate-200/50">
                    <EditorContent editor={editor} />
                </div>
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&family=Raleway:wght@300;400;500;600;700;800;900&family=Bebas+Neue&family=Oswald:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&family=Source+Sans+Pro:ital,wght@0,300;0,400;0,600;0,700;0,900;1,300;1,400;1,600;1,700;1,900&family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,300;1,400;1,500;1,700;1,900&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap');

                .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #cbd5e1;
                    pointer-events: none;
                    height: 0;
                }
                .ProseMirror {
                    outline: none !important;
                }
                .ProseMirror p {
                    margin-bottom: 1.5em;
                }
                /* Support for indented paragraphs */
                .ProseMirror p[style*="margin-left"],
                .ProseMirror p[style*="padding-left"] {
                    text-indent: 0;
                }
                .ProseMirror h1 { font-size: 2.5rem; font-weight: 900; margin-bottom: 1.5rem; line-height: 1.1; }
                .ProseMirror h2 { font-size: 2rem; font-weight: 800; margin-top: 2rem; margin-bottom: 1rem; }
                .ProseMirror h3 { font-size: 1.5rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem; }
                
                /* Font Family Support */
                .ProseMirror [style*="font-family"] {
                    font-family: inherit; /* Fallback */
                }
            `}</style>
        </div>
    );
}
