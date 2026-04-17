/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_SUPABASE_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.png?url' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.jpg?url' {
  const content: string
  export default content
}

declare module '*.jpeg' {
  const content: string
  export default content
}

declare module '*.jpeg?url' {
  const content: string
  export default content
}

declare module '*.gif' {
  const content: string
  export default content
}

declare module '*.gif?url' {
  const content: string
  export default content
}

declare module '*.webp' {
  const content: string
  export default content
}

declare module '*.webp?url' {
  const content: string
  export default content
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_KEY: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

