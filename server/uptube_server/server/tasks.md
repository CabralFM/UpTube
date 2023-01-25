### TODO:

# resolver problema em data.thumbnail: edit.js, upload.js

# é possível o front de edit.js saber que vem de history/redirect no seguimento de upload
## VS
# de um link por email ou edição de video através do menu?
## para conseguir fazer distinção no front entre: Upload Concluído e Edição de Vídeo

# create security (search npm) to cover "#)(/#$(&)#$" in inputs, assistir ao vídeo da última aula de segurança

# rever os endpoints em:
notification.js
reactions.js

# no momento do registo do user: run endpoint default notifications

thumbnails em publish page

implementar useSession em todos os endpoints (?) || rever onde faz falta USER CHECK nos vários endpoints

admin.session?

nota: middleware, corrido em cada request que intercepta cada throw

uniformizar todos os endpoints

console.log(req.headers.origin) undefined ?


visibilidade da playlist? frontend ou backend?
count playlist(s) total_time

SUB-TASKS em videoCard.js?

session user check em upload/publish/add/edit/delete video? implementado?

checkar video/modified CURRENT_TIMESTAMP ON UPDATE

criar servidor


QUESTÕES:

faz sentido mostrar a password (mesmo que encriptada) no response das queries? exemplo: user/login


#

17 Dec updated all endpoints, except user.js, after DB major update
19 Dec created verifications in reactions.js
created checkParams.js and implemented in reactions.js
changed some endpoints path
fixed: add reaction, verifications were wrong and missing
fixed: del reaction, verifications were wrong (even var names were like "comment" instead of "reaction")
comments.js:
fixed: get comments in video x
fixed: get all comments by user x
created: get all comments by user x in video x
fixed: del comment in video, queries and permissions
fixed: add comment in video, permissions
fixed: permissions in tag.js
25 Dec
created: playlistService.js
fixed: playlist.js
27 Dec
updated: notification.js

SECURITY:

ao enviar vários pedidos diferentes ao mesmo tempo, que acontece? criar limite de requests por segundo?



https://stackoverflow.com/questions/36559192/type-error-done-is-not-a-function-nodemailer
