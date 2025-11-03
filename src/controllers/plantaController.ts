import { serviceListagemPlantas, servicerObterPlantaPorID } from "@/services/plantaService";

export async function controllerListagemPlantas(filtroRename?: string, filtroReniSUS?: string, idIndicacaoUso?: Number, idMetodoPreparo?: Number) {
    return await serviceListagemPlantas(filtroRename, filtroReniSUS, idIndicacaoUso, idMetodoPreparo);
}

export async function controllerObterPlantaPorID(idPlanta: number) {
    return await servicerObterPlantaPorID(idPlanta);
}


