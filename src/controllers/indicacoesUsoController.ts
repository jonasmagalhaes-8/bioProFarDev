import { serviceListagemIndicacoesUso } from "@/services/indicacoesUsoService";

export async function controllerListagemIndicacoesUso() {
    return await serviceListagemIndicacoesUso();
}
