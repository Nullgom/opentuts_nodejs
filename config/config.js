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
		clientID: '1352044121559690',
		clientSecret: 'ce1b62c30898587a11c31c055bf2dad3',
		callbackURL: '/auth/facebook/callback',
		profileFields:['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
	},
	google : {
		clientID: '354176592509-fi6ava9ptiin0pbpttt7kem9ckdl6drb.apps.googleusercontent.com',
		clientSecret: 's59LiCVNb82JNlFlxmR4aXCe',
		callbackURL: '/auth/google/callback'
	}
};