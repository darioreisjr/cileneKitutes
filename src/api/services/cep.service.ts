import { env } from '@/config/env';

export interface CepData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

/**
 * Serviço para consulta de CEP via ViaCEP
 */
export class CepService {
  private static readonly BASE_URL = env.VIACEP_URL;

  /**
   * Remove caracteres não numéricos do CEP
   */
  private static cleanCep(cep: string): string {
    return cep.replace(/\D/g, '');
  }

  /**
   * Valida formato do CEP
   */
  private static isValidCep(cep: string): boolean {
    const cleanedCep = this.cleanCep(cep);
    return /^\d{8}$/.test(cleanedCep);
  }

  /**
   * Busca endereço pelo CEP
   */
  static async fetchAddress(cep: string): Promise<CepData> {
    if (!this.isValidCep(cep)) {
      throw new Error('CEP inválido. Use o formato: 00000-000');
    }

    const cleanedCep = this.cleanCep(cep);

    try {
      const response = await fetch(`${this.BASE_URL}/${cleanedCep}/json/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao consultar CEP');
      }

      const data: CepData = await response.json();

      if (data.erro) {
        throw new Error('CEP não encontrado');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao consultar CEP');
    }
  }

  /**
   * Formata CEP para exibição (00000-000)
   */
  static formatCep(cep: string): string {
    const cleaned = this.cleanCep(cep);
    if (cleaned.length !== 8) return cep;
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  }
}
