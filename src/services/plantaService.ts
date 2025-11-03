import { Planta } from '@/models/Planta';
import { Response } from '@/models/Response';
import { api } from '@/util/api';

export async function serviceListagemPlantas(filtroRename?: string, filtroReniSUS?: string, idIndicacaoUso?: Number, idMetodoPreparo?: Number) {
    try {
        const json = await api.get('/planta/listagem', {
            params: { filtroRename, filtroReniSUS, idIndicacaoUso, idMetodoPreparo },
        });

        const requisicao = new Response(json.data);

        return requisicao.response as Planta[];
    } catch (err: any) {
        throw new Error(err.message);
    }
}

export async function servicerObterPlantaPorID(idPlanta: number) {
    try {
        const json = await api.get('/planta/obterPorId', {
            params: { id: idPlanta },
        });

        const requisicao = new Response(json.data);

        return requisicao.response as Planta;
    } catch (err: any) {
        throw new Error(err.message);
    }
}
