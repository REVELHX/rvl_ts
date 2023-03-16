fx_version 'cerulean'
lua54 'yes'
game 'gta5'

description "Tunning System by RevelScripts Team"

version '1.0'

client_scripts { 
	'client.lua',
}

server_scripts { 
	'server.lua',
}

shared_script 'config.lua'




ui_page 'ui/index.html'

files {
    'ui/*.js',
	'ui/*.html',
	'ui/*.css'
}