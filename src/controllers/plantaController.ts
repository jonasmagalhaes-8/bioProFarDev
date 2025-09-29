import { serviceListagemPlantas, servicerObterPlantaPorID } from "@/services/plantaService";

export async function controllerListagemPlantas(filtroRename?: string, filtroReniSUS?: string) {
    return await serviceListagemPlantas(filtroRename, filtroReniSUS);
}

export async function controllerObterPlantaPorID(idPlanta: number) {
    return await servicerObterPlantaPorID(idPlanta);
}


