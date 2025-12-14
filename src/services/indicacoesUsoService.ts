import { IndicacaoUso } from "@/models/IndicacaoUso";
import { Response } from "@/models/Response";
import { api } from "@/util/api";

export async function serviceSalvarIndicacaoUso(nomeIndicacao: string, imagem?: File, idIndicacao?: Number) {
    try {
        const formData = new FormData();
        formData.append("nomeIndicacao", nomeIndicacao);
        formData.append("idIndicacao", idIndicacao.toString());

        if (imagem) formData.append("imagemIndicacao", imagem);

        const json = await api.post('/indicacoesuso', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        const requisicao = new Response(json.data);

        return requisicao.response as IndicacaoUso;
    } catch (err: any) {
        throw new Error(err.message);
    }
}

export async function servicerObterDeletarPorId(idIndicacao: number) {

    try {
        const json = await api.delete('/indicacoesuso/deletarPorId', {
            params: { id: idIndicacao },
        });

        const requisicao = new Response(json.data);

        return requisicao.mensagem;
    } catch (err: any) {
        throw new Error(err.message);
    }

}
export async function serviceListagemIndicacoesUso() {
    try {
        const json = await api.get('/indicacoesuso/listagem');

        const requisicao = new Response(json.data);

        return requisicao.response as IndicacaoUso[];
    } catch (err: any) {
        throw new Error(err.message);
    }
}