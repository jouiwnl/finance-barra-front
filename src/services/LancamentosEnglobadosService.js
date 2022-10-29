import { api } from "../config/axiosConfig";

export class LancamentosEnglobadosService {
	
	static save(lancamentoEnglobado) {
		if (lancamentoEnglobado.id) {
			return this.put(lancamentoEnglobado);
		} 

		return this.post(lancamentoEnglobado);
	}

	static post(lancamentoEnglobado) {
		return api.post('/lancamentos-englobados', lancamentoEnglobado);
	}

  static homologar(idLancamentoEnglobados) {
		return api.post(`/lancamentos-englobados/${idLancamentoEnglobados}/homologar`);
	}

  static desfazerHomologacao(idLancamentoEnglobados) {
		return api.post(`/lancamentos-englobados/${idLancamentoEnglobados}/desfazer-homologacao`);
	}
	
	static put(lancamentoEnglobado) {
		return api.put(`/lancamentos-englobados/${lancamentoEnglobado.id}`, lancamentoEnglobado);
	}
	
	static delete(idLancamentoEnglobados) {
		return api.delete(`/lancamentos-englobados/${idLancamentoEnglobados}`);
	}
	
	static findAll() {
		return api.get('/lancamentos-englobados');
	}
	
	static findOne(idLancamentoEnglobados) {
		return api.get(`/lancamentos-englobados/${idLancamentoEnglobados}`);
	}
}