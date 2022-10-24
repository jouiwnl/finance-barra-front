import { api } from "../config/axiosConfig";

export class CentroCustosService {
	
	static save(centro) {
		if (centro.id) {
			return this.put(centro);
		} 

		return this.post(centro);
	}

	static post(centro) {
		return api.post('/centros-custos', centro);
	}
	
	static put(centro) {
		return api.put(`/centros-custos/${centro.id}`, centro);
	}
	
	static delete(idCentro) {
		return api.delete(`/centros-custos/${idCentro}`);
	}
	
	static findAll() {
		return api.get('/centros-custos');
	}
	
	static findOne(idCentro) {
		return api.get(`/centros-custos/${idCentro}`);
	}
}