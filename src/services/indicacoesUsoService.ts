import { IndicacaoUso } from "@/models/IndicacaoUso";
import { Response } from "@/models/Response";
import { api } from "@/util/api";

export async function serviceListagemIndicacoesUso() {
    try {
        const json = await api.get('/indicacoesuso/listagem');

        const requisicao = new Response(json.data);

        return requisicao.response as IndicacaoUso[];
    } catch (err: any) {
        throw new Error(err.message);
    }
}