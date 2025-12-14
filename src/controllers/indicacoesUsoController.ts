import { serviceListagemIndicacoesUso, servicerObterDeletarPorId, serviceSalvarIndicacaoUso } from "@/services/indicacoesUsoService";

export async function controllerListagemIndicacoesUso() {
    return await serviceListagemIndicacoesUso();
}

export async function controllerSalvarIndicacoesUso(nomeIndicacao: string, imagem?: File, idIndicacao?: Number) {
    return await serviceSalvarIndicacaoUso(nomeIndicacao, imagem, idIndicacao);
}

export async function controllerDeletarPorId(idIndicacao: number) {
    return await servicerObterDeletarPorId(idIndicacao);
}
