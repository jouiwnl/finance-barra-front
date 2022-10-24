import { api } from "../config/axiosConfig";

export class FuncionarioService {
	
	static save(funcionario) {
		if (funcionario.id) {
			return this.put(funcionario);
		} 

		return this.post(funcionario);
	}

	static post(funcionario) {
		return api.post('/funcionarios', funcionario);
	}
	
	static put(funcionario) {
		return api.put(`/funcionarios/${funcionario.id}`, funcionario);
	}
	
	static deleteFuncionario(idFuncionario) {
		return api.delete(`/funcionarios/${idFuncionario}`);
	}
	
	static findAll() {
		return api.get('/funcionarios');
	}
	
	static findOne(idFuncionario) {
		return api.get(`/funcionarios/${idFuncionario}`);
	}
}