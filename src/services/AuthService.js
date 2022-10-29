import { api } from "../config/axiosConfig";

export class AuthService {
	static signIn(user) {
		return api.post('/login', user);		
	}

  static getCurrent() {
    return api.get('/usuarios/current');
  }
}