import { api } from "../config/axiosConfig";

export class PlanosContasService {
	
	static save(planosContas) {
		if (planosContas.id) {
			return this.put(planosContas);
		} 

		return this.post(planosContas);
	}

	static post(planosContas) {
		return api.post('/planos-contas', planosContas);
	}
	
	static put(planosContas) {
		return api.put(`/planos-contas/${planosContas.id}`, planosContas);
	}
	
	static delete(idPlanosContas) {
		return api.delete(`/planos-contas/${idPlanosContas}`);
	}
	
	static findAll() {
		return api.get('/planos-contas');
	}
	
	static findOne(idPlanosContas) {
		return api.get(`/planos-contas/${idPlanosContas}`);
	}

  static findByCode(code) {
		return api.get(`/planos-contas/findByCode/${code}`);
	}
}