import { serviceListagemModosPreparo, servicerObterModoPreparoPorID } from "@/services/modoPreparoService";

export async function controllerListagemModosPreparo() {
    return await serviceListagemModosPreparo();
}

export async function controllerObterModoPreparoPorID(idModoPreparo: number) {
    return await servicerObterModoPreparoPorID(idModoPreparo);
}