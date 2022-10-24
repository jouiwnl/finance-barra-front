import { api } from "../config/axiosConfig";

export class SinteticosService {
	
	static save(sintetico) {
		if (sintetico.id) {
			return this.put(sintetico);
		} 

		return this.post(sintetico);
	}

	static post(sintetico) {
		return api.post('/sinteticos', sintetico);
	}
	
	static put(sintetico) {
		return api.put(`/sinteticos/${sintetico.id}`, sintetico);
	}
	
	static delete(idSintetico) {
		return api.delete(`/sinteticos/${idSintetico}`);
	}
	
	static findAll() {
		return api.get('/sinteticos');
	}
	
	static findOne(idSintetico) {
		return api.get(`/sinteticos/${idSintetico}`);
	}
}