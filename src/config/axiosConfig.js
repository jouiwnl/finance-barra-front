import axios from 'axios'

const api = axios.create({
	baseURL: "https://finance-barra-production.up.railway.app/"
  //https://finance-app-barra.herokuapp.com/
});

api.interceptors.request.use(
	config => {
		const token = localStorage.getItem('session_token');

		if (token) {
			config.headers['Authorization'] = token
		}
		return config
	},

	error => {
    Promise.reject(error)
  }
)

export { api }