import { writable } from 'svelte/store'
import { UsuarioModel } from '@/models/UsuarioModel'

export const usuarioStore = writable<UsuarioModel>(new UsuarioModel())
