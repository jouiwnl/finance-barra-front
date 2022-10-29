import { api } from "../config/axiosConfig";

export class ImpostosService {
	
	static save(imposto) {
		if (imposto.id) {
			return this.put(imposto);
		} 

		return this.post(imposto);
	}

	static post(imposto) {
		return api.post('/impostos', imposto);
	}
	
	static put(imposto) {
		return api.put(`/impostos/${imposto.id}`, imposto);
	}
	
	static delete(idImposto) {
		return api.delete(`/impostos/${idImposto}`);
	}
	
	static findAll() {
		return api.get('/impostos');
	}
	
	static findOne(idImposto) {
		return api.get(`/impostos/${idImposto}`);
	}
}