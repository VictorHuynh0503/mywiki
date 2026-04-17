import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { SheetImport } from '../types'

export function useSheetImports() {
  const [imports, setImports] = useState<SheetImport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tableMissing, setTableMissing] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    setTableMissing(false)

    const { data, error } = await supabase
      .from('sheet_imports')
      .select('*')
      .order('imported_at', { ascending: false })

    if (error) {
      if (
        error.message?.includes('schema cache') ||
        error.message?.includes('does not exist') ||
        error.code === '42P01' ||
        error.message?.includes('PGRST200')
      ) {
        setTableMissing(true)
        setError('Database tables not set up yet.')
      } else {
        setError(error.message)
      }
      setImports([])
    } else {
      setImports((data as SheetImport[]) ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { imports, loading, error, tableMissing, refresh: fetch }
}

export async function saveSheetImport(payload: Omit<SheetImport, 'id' | 'imported_at'>) {
  const { data: { user } } = await supabase.auth.getUser()
  return supabase
    .from('sheet_imports')
    .insert([{ ...payload, user_id: user?.id }])
    .select()
    .single()
}

export async function deleteSheetImport(id: number) {
  return supabase.from('sheet_imports').delete().eq('id', id)
}
