const express = require("express");
const router = express.Router();
const {queryDB} = require("./../connection");
const {emailService} = require("../services/emailService");
const {stringify} = require("nodemon/lib/utils");
const userService = require("../services/userService");

// DEFAULT NOTIFICATIONS:

// INSERT ALL DEFAULT NOTIFICATIONS on register :
// register, like, dislike, comment, subscribed, v.upload, v.publish, recover password, user added to playlist
//router.post('/register-default/:id_user', async function (req, res) {

router.get('/get-all-from-user', async function (req, res) {
    try {
        const getNotifications = await queryDB(`SELECT *
                                                FROM user_has_notification uhn
                                                WHERE uhn.id_user = ?`, [req.session.id_user]);
        console.log("LKSLAKD", getNotifications[0].id_user);

        res.json({success: true, notifications: getNotifications});
    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }
});

router.get('/get-notifications-bell', async function (req, res) {
    try {
        const getNotifications = await queryDB(`SELECT nt.description
                                                FROM notification_type nt
                                                         JOIN notification n ON n.type = nt.id
                                                WHERE n.id_recipient = ?`, [req.session.id_user]);
        res.json({success: true, notifications: getNotifications});
    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }
})

router.post('/add-default-notifications/:email', async function (req, res) {
    try {
        let getUserID = await queryDB(`SELECT u.id
                                       FROM user u
                                       WHERE u.email = ?`, [req.params.email]);
        console.log("LKSLAKD", getUserID[0].id);
        let newUser = getUserID[0].id;
        await queryDB(`INSERT INTO user_has_notification(id_user, id_notification_type)
                       VALUES (?, 3),
                              (?, 4),
                              (?, 5),
                              (?, 6),
                              (?, 7),
                              (?, 8),
                              (?, 10);`, [newUser, newUser, newUser, newUser, newUser, newUser, newUser]);
        return res.status(201).send(`default notifications added to registered user ${newUser}`);
    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }
});

// TODO informar user, no registo, das notificações padrão e que pode alterar as mesmas nas definições de user

// ADD notification to DEFAULT NOTIFICATIONS :
router.post('/add/:id_notification', async function (req, res) {
    try {
        //TODO: notification como param ou body?
        const id_user = req.session.id_user
        await userService.checkIfUserExists(id_user);
        await userService.userSession(id_user);
        let notification = req.params.notification;
        let notificationExists = await queryDB(`SELECT *
                                                FROM user_has_notification
                                                WHERE id_user = ?
                                                  AND id_notification_type = ?`, [id_user, notification])
        if (notificationExists > 0) throw 'notification already added to default';
        await queryDB(`INSERT INTO user_has_notification(id_user, id_notification_type)
                       VALUES (?, ?);`, [id_user, notification]);
        return res.status(201).send(`user ${id_user} added notification ${notification} to default notifications`);
    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }
});

// DELETE notification from DEFAULT NOTIFICATIONS :
router.post('/delete/:id_notification', async function (req, res) {
    try {
        const id_user = req.session.id_user
        await userService.checkIfUserExists(id_user); // redundant? TODO: review id_user as session
        await userService.userSession(id_user);
        let notification = req.params.notification;
        let notificationExists = await queryDB(`SELECT *
                                                FROM user_has_notification
                                                WHERE id_user = ?
                                                  AND id_notification_type = ?`, [id_user, notification])
        if (notificationExists === 0) throw 'user does not have default notification';
        await queryDB(`DELETE
                       FROM user_has_notification
                       WHERE id_user = ?
                         AND id_notification_type = ?`, [id_user, notification]);
        return res.status(201).send(`user ${id_user} added notification ${notification} to default notifications`);
    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }
});

// make notification :
router.post('/:id_receiver(\\d+)', async function (req, res) {
    try {
        let id_receiver = req.params.id_receiver;
        const id_user = req.session.id_user;
        await userService.userSession(id_user);
        await userService.checkIfUserExists(id_receiver);
        let notificationType = req.body.type;
        //let notificationType = req.params.type;
        let notification_type_len = await queryDB(`SELECT *
                                                   FROM notification_type`);
        if (notificationType === null || notificationType === 0 || notificationType === ':notification_type' ||
            notificationType === 'notification_type' || notificationType > notification_type_len) throw 'invalid value'
        /*      to delete later:
        let notificationExists = await queryDB(`SELECT *
                                                FROM notification
                                                WHERE id_recipient = ?
                                                  AND type = ?
                                                  AND id_sender = 0`, [receiverID, notificationType]);
        if (notificationExists > 0) throw 'notification already exists'
        */
        let notification = await queryDB(`INSERT INTO notification
                                          SET id_recipient   = ?,
                                              type           = ?,
                                              id_sender      = ?,
                                              id_comment     = ?,
                                              id_video       = ?,
                                              id_playlist    = ?,
                                              id_achievement = ?,
                                              mail           = ?`,
            [id_receiver, notificationType, req.body.id_user, req.body.id_comment, req.body.id_video, req.body.id_playlist, req.body.id_achievement, req.body.mail]);
        //res.send("notification inserted");

        console.log("ID_COMMENT", req.body.id_comment);


        // check if user wants to receive email:
        let id_notification = notification.insertId; // < getting notification id
        let receiveMail = await queryDB(`SELECT id_user, n.mail
                                         FROM user_has_notification uhn
                                                  JOIN notification n ON uhn.id_user = n.id_recipient
                                         WHERE uhn.id_user = ?
                                           AND uhn.id_notification_type = ?
                                           AND n.id = ?
                                         GROUP BY id_user`, [id_receiver, notificationType, id_notification]);

        //console.log("receiveMail", receiveMail);
        //console.log("receiveMail[0]", receiveMail[0]);
        //console.log("receiveMail[0]", receiveMail[0]);
        //console.log("receiveMail[0].id_user", receiveMail[0].id_user);
        console.log("receiveMail[0].mail === 1", receiveMail[0].mail);
        console.log("PASSOU NA QUERY DE LER MAIL")

        // SENDING EMAIL:

        // to mail or not to mail:
        if (receiveMail[0].id_user > 0 && receiveMail[0].mail === 1) {
            console.log("ENTROU NO IF de mail === 1")
            let recipientEmail = await queryDB(`SELECT email
                                                FROM user u
                                                         INNER JOIN notification n ON u.id = n.id_recipient
                                                WHERE id_recipient = ?
                                                GROUP BY email`, [id_receiver]);

            const mail = recipientEmail[0].email; // email
            const email = JSON.stringify(mail);  // "email"

            // get video data
            let video = await queryDB(`SELECT *
                                       FROM video v
                                       WHERE v.id = ?`, [req.body.id_video]);
            // get user data
            let user = await queryDB(`SELECT *
                                      FROM user u
                                      WHERE u.id = ?`, [req.session.id_user]);
            // get comment data
            let comment = await queryDB(`SELECT *
                                         FROM comment c
                                         WHERE c.id = ?`, [req.body.id_comment]);
            // get achievement data
            let achievement = await queryDB(`SELECT *
                                             FROM achievement a
                                             WHERE a.id = ?`, [req.body.id_achievement]);

            // comment notification
            if (notificationType === 1) {
                let subject = `Novo 'like' no seu vídeo ${video[0].title}`;
                let body = `${user[0].username.toUpperCase()} gostou do seu vídeo:\n \n\n
                    Se não pretender receber emails sobre likes, poderá seleccionar quais as notificações 
                    que deseja e não receber, acedendo às definições da sua conta UPtube.\n\n\n© 2022 UPtube, Lisboa`;
                await emailService(email, subject, body);
            }
            if (notificationType === 2) {
                let subject = `Novo 'dislike' no seu vídeo ${video[0].title}`;
                let body = `${user[0].username.toUpperCase()} não gostou do seu vídeo:\n \n\n
                Se não pretender receber emails sobre dislikes, poderá seleccionar quais as notificações 
                que deseja e não receber, acedendo às definições da sua conta UPtube.\n\n\n© 2022 UPtube, Lisboa`;
                await emailService(email, subject, body);
            }
            if (notificationType === 3) {
                let subject = `Nova comentário ao seu vídeo ${video[0].title}`;
                let body = `${user[0].username.toUpperCase()} comentou o seu vídeo:\n \n'${comment[0].comment}'\n\n\n
                    Se não pretender receber emails sobre comentários e respostas, poderá anular a subscrição ou seleccionar 
                    quais as notificações que deseja e não receber nas definições da sua conta UPtube.\n\n\n© 2022 UPtube, Lisboa`;
                await emailService(email, subject, body);
            }
            if (notificationType === 4) {
                let subject = `${user[0].username.toUpperCase()} subscreveu o seu canal no UPtube!`;
                let body = `${user[0].avatar} ${user[0].username} subscreveu o seu canal no UPtube:\n \n\n\n
                Se não pretender receber emails sobre subscrições, poderá anular a subscrição ou seleccionar 
                quais as notificações que deseja e não receber nas definições da sua conta UPtube.\n\n\n© 2022 UPtube, Lisboa`;
                await emailService(email, subject, body);
            }
            if (notificationType === 5) {
                let notification_edit = 'http://localhost:3000/video/edit/';
                let subject = `O seu vídeo ${video[0].title} está agora pronto a ser editado!`
                let body = `O seu vídeo ${video[0].title} está agora pronto a ser editado e publicado no seu canal!\n\n
                Poderá fazê-lo através do seguinte link: ${notification_edit + video[0].id}.\n\n\n© 2022 UPtube, Lisboa`;
                await emailService(email, subject, body);
            }
            if (notificationType === 6) {
                let notification_watch = 'http://localhost:3000/video/';
                let subject = `Parabéns, o seu vídeo ${video[0].title} foi publicado!`
                let body = `O seu vídeo ${video[0].title} foi publicado e está agora visível para todo o mundo!\n\n
                Poderá vê-lo e partilha-lo através do seguinte link: ${notification_watch + video[0].id}.\n\n\n© 2022 UPtube, Lisboa`;
                await emailService(email, subject, body);
            }
            if (notificationType === 8) {
                let subject = `O utilizador ${user[0].username.toUpperCase()} foi adicionado à tua Playlist!`
                let body = `O utilizador ${user[0].username.toUpperCase()} foi adicionado à tua Playlist e poderá agora 
                adicionar vídeos à mesma.\n\n\n© 2022 UPtube, Lisboa`;
                await emailService(email, subject, body);
            }
            if (notificationType === 9) {
                let subject = `O utilizador ${user[0].username.toUpperCase()} adicionou um vídeo à vossa Playlist!`
                let body = `O utilizador ${user[0].username.toUpperCase()} adicionou o vídeo ${video[0].title} à vossa 
                Playlist.\n\n\n© 2022 UPtube, Lisboa`;
                await emailService(email, subject, body);
            }
            if (notificationType === 10) {
                let notification_channel = 'http://localhost:3000/user/';
                let subject = `Bem-vindo ao UPtube!`
                let body = `Olá ${user[0].username.toUpperCase()}, bem-vindo ao UPtube! A maior comunidade de vídeos online!\n\n
                Acede já ao teu canal e publica o teu primeiro vídeo no seguinte link ${notification_channel + user[0].id}\n\n\n© 2022 UPtube, Lisboa`;
                await emailService(email, subject, body);
            }
            if (notificationType === 11) {
                let notification_channel = 'http://localhost:3000/user/';
                let subject = `Parabéns, desbloqueaste um novo achievement!`
                let body = `Parabéns ${user[0].username.toUpperCase()}, desbloqueaste o achievement '${achievement[0].title}'.\n\n
                Acede ao teu canal e vê que mais achievements poderás desbloquear no link ${notification_channel + user[0].id}\n\n\n© 2022 UPtube, Lisboa`;
                await emailService(email, subject, body);
            }

            //let subject = `Novo comentário ao seu vídeo '${video[0].title}'`;
            /*let body = `${user[0].avatar} comentou o seu vídeo:\n \n'${comment[0].comment}'\n\n\n
                Se não pretender receber emails sobre comentários e respostas, poderá anular a subscrição ou seleccionar 
                quais as notificações que deseja e não receber nas definições da sua conta UPtube.`;
            //let subject = 'Tem uma nova notificação!';
            //let body = 'sdsdsd';
            //removemos o title e description com a alteração da base de dados;
            //await emailService(email, req.body.title, req.body.description);
            //email, subject, text
            res.send('notification inserted and email sent');*/
        } else res.send('notification inserted');
    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }
});

// inserting single notification to receive by mail
router.post('/add-notification', async function (req, res) {
    try {
        await queryDB(`SELECT id_notification_type
                       FROM user_has_notification
                       WHERE id_user = ?`, [req.session.id_user]);

        console.log("req.body.id_notification_type", req.body.id_notification_type)
        await queryDB(`INSERT INTO user_has_notification
                       SET id_user              = ?,
                           id_notification_type = ?`, [req.session.id_user, req.body.id_notification_type]);


        let notification = await queryDB(`SELECT *
                                          FROM user_has_notification
                                          WHERE id_user = ?
                                            AND id_notification_type = ?`, [req.session.id_user, req.body.id_notification_type])

        //console.log("noti", notification)
        res.json({success: true, notification});
    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }
});

// removing single notification to receive by mail
router.post('/del-notification', async function (req, res) {
    try {
        await queryDB(`
        SELECT
        id_notification_type
        FROM
        user_has_notification
        WHERE
        id_user = ? `, [req.session.id_user]);

        await queryDB(`DELETE
        FROM
        user_has_notification
        WHERE
        id_user = ?
            AND id_notification_type = ? `, [req.session.id_user, req.body.id_notification_type]);

        res.json({success: true});
    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }
});


module.exports = router;