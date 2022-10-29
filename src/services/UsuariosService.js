import { api } from "../config/axiosConfig";

export class UsuariosService {
	
	static save(usuario) {
		if (usuario.id) {
			return this.put(usuario);
		} 

		return this.post(usuario);
	}

	static post(usuario) {
		return api.post('/usuarios', usuario);
	}
	
	static put(usuario) {
		return api.put(`/usuarios/${usuario.id}`, usuario);
	}
	
	static delete(idUsuario) {
		return api.delete(`/usuarios/${idUsuario}`);
	}
	
	static findAll() {
		return api.get('/usuarios');
	}
	
	static findOne(idUsuario) {
		return api.get(`/usuarios/${idUsuario}`);
	}
}