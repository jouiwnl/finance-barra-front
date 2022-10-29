import { api } from "../config/axiosConfig";

export class PessoasService {
	
	static save(pessoa) {
		if (pessoa.id) {
			return this.put(pessoa);
		} 

		return this.post(pessoa);
	}

	static post(pessoa) {
		return api.post('/pessoas', pessoa);
	}
	
	static put(pessoa) {
		return api.put(`/pessoas/${pessoa.id}`, pessoa);
	}
	
	static delete(idPessoas) {
		return api.delete(`/pessoas/${idPessoas}`);
	}
	
	static findAll() {
		return api.get('/pessoas');
	}
	
	static findOne(idPessoas) {
		return api.get(`/pessoas/${idPessoas}`);
	}

  static findByTipo(tipo) {
		return api.get(`/pessoas/findByTipo/${tipo}`);
	}
}