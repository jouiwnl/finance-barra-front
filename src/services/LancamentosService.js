import { api } from "../config/axiosConfig";

export class LancamentosService {
	
	static save(lancamento) {
		if (lancamento.id) {
			return this.put(lancamento);
		} 

		return this.post(lancamento);
	}

	static post(lancamento) {
		return api.post('/lancamentos', lancamento);
	}
	
	static put(lancamento) {
		return api.put(`/lancamentos/${lancamento.id}`, lancamento);
	}
	
	static delete(idLancamento) {
		return api.delete(`/lancamentos/${idLancamento}`);
	}
	
	static findAll() {
		return api.get('/lancamentos');
	}
	
	static findOne(idLancamento) {
		return api.get(`/lancamentos/${idLancamento}`);
	}
}