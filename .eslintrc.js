module.exports = {
	'env': {
		'node': true,
		'es2021': true,
	},
	'extends': [
		'eslint:recommended',
	],
	'rules': {
		'indent': [
			'warn',
			'tab',
			{
				'SwitchCase': 1,
			},
		],
		'quotes': [
			'warn',
			'single',
		],
		'semi': [
			'warn',
			'never',
		],
		'no-unused-vars': [
			'warn',
			{
				'args': 'none',
			},
		],
		'brace-style': [
			'warn',
			'1tbs',
		],
		'keyword-spacing': [
			'warn',
			{
				'before': true,
				'after': true,
			},
		],
		'object-curly-spacing': [
			'warn',
			'always',
		],
		'camelcase': [
			'warn',
			{
				'properties': 'always',
			},
		],
		'new-cap': [
			'warn',
		],
		'comma-dangle': [
			'warn',
			'always-multiline',
		],
		'no-multiple-empty-lines': [
			'warn',
			{
				'max': 1,
				'maxEOF': 0,
				'maxBOF': 0,
			},
		],
		'no-trailing-spaces': [
			'warn',
			{
				'skipBlankLines': false,
				'ignoreComments': false,
			},
		],
	},
	'ignorePatterns': ['dist/'],
}