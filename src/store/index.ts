import { UsuarioModel } from '@/models/UsuarioModel'
import { writable } from 'svelte/store'

export const usuarioStore = writable<UsuarioModel | null>(null)
