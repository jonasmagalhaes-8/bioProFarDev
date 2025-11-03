import { MetodoPreparo } from "@/models/MetodoPreparo";
import { Response } from "@/models/Response";
import { api } from "@/util/api";

export async function serviceListagemModosPreparo() {
    try {
        const json = await api.get('/metodopreparo/listagem');

        const requisicao = new Response(json.data);

        return requisicao.response as MetodoPreparo[];
    } catch (err: any) {
        throw new Error(err.message);
    }
}

export async function servicerObterModoPreparoPorID(idModoPreparo: number) {
    try {
        const json = await api.get('/metodopreparo/obterPorId', {
            params: { id: idModoPreparo },
        });

        const requisicao = new Response(json.data);

        return requisicao.response as MetodoPreparo;
    } catch (err: any) {
        throw new Error(err.message);
    }
}