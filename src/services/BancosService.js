import { api } from "../config/axiosConfig";

export class BancosService {
	
	static save(banco) {
		if (banco.id) {
			return this.put(banco);
		} 

		return this.post(banco);
	}

	static post(banco) {
		return api.post('/bancos', banco);
	}
	
	static put(banco) {
		return api.put(`/bancos/${banco.id}`, banco);
	}
	
	static delete(idBanco) {
		return api.delete(`/bancos/${idBanco}`);
	}
	
	static findAll() {
		return api.get('/bancos');
	}
	
	static findOne(idBanco) {
		return api.get(`/bancos/${idBanco}`);
	}

  static findForSelect() {
		return api.get(`/bancos/find-select`);
	}
}