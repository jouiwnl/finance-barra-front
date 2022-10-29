import { api } from "../config/axiosConfig";

export class AnaliticosService {
	
	static save(analitico) {
		if (analitico.id) {
			return this.put(analitico);
		} 

		return this.post(analitico);
	}

	static post(analitico) {
		return api.post('/analiticos', analitico);
	}
	
	static put(analitico) {
		return api.put(`/analiticos/${analitico.id}`, analitico);
	}
	
	static delete(idAnalitico) {
		return api.delete(`/analiticos/${idAnalitico}`);
	}
	
	static findAll() {
		return api.get('/analiticos');
	}
	
	static findOne(idAnalitico) {
		return api.get(`/analiticos/${idAnalitico}`);
	}

  static findBySintetico(idSintetico) {
		return api.get(`/analiticos/getBySintetico/${idSintetico}`);
	}
}