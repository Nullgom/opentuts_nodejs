module.exports = {
	ENV: 'development', //'development',
	PORT: 3000,
	dbOption : {
		host: 'localhost',
		port: 3306,
		user: 'nodeuser',
		password: 'node@pass',
		database: 'otut2'
	},
	facebook : {
		clientID: '1111111111',
		clientSecret: 'assdsasadasffdsf',
		callbackURL: '/auth/facebook/callback',
		profileFields:['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
	},
	google : {
		clientID: 'sdfsdfdsfsdfwerw352345235235.apps.googleusercontent.com',
		clientSecret: '78saf687s6dfyasdfgyas89f7sd879',
		callbackURL: '/auth/google/callback'
	}
};