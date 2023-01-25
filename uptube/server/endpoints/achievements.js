const express = require("express");
const router = express.Router();
const {queryDB} = require("./../connection");

/*  ACHIEVEMENTS

get achievements from user      .   achievements/ user/:id_user                      .  line 22 . DONE
add achivement to user          .   achievements/ :id_achieve/add-to/:id_user        .  line 48   DONE x
delete achievement from user    .   achievements/ :id_achieve/delete-from/:id_user   .  line    DONE
hide achivement from user       .   achievements/ :id_achieve/hide                   .  line    DONE
disclose achivement from user   .    achievements/ :id_achieve/disclose               .  line    DONE


[admin] get all achievements    .   achievements/                                    .  line   DONE
[admin] add achievement         .   achievements/ add/:id_achieve                    .  line    DONE
[admin] delete achievement      .   achievements/ delete/:id_achieve                 .  line    DONE

*/

// get /achievements/user/:id_user    #    get achievements from user [id_achieve, title, description, level, url]

router.get('/user/:id_user', async function (req, res) {

    let user = await queryDB(`SELECT *
                              FROM user
                              WHERE id_user = ?`, [req.params.id_user]);

    if (user.length === 0) return res.status(400).send("there's no such user.");

    let award = await queryDB(`SELECT a.id_achieve,
                                      a.title,
                                      a.description,
                                      (SELECT count(*)
                                       FROM user_has_achievement
                                       where user_has_achievement.achievement_id_achieve = a.id_achieve) AS "level",
                                      a.url
                               FROM achievement a
                                        JOIN user_has_achievement ua ON a.id_achieve = ua.achievement_id_achieve
                                        JOIN user u ON u.id_user = ua.user_id_user
                               WHERE id_user = ?`, [req.params.id_user]);

    if (award.length === 0) return res.status(400).send("no achievements found.");
    res.json(award);
});

// post /user/:id_user/achievement/add       #       add achievement to user [id_achieve, id_user]

router.post('/:id_achieve/add-to/:id_user/', async function (req, res) {

    // check if user exists
    let userExists = await queryDB(`SELECT *
                                    FROM user
                                    WHERE id_user = ?`, [req.params.id_user]);

    if (userExists.length === 0) return res.status(400).send("there's no such user.");

    // check if user already has achievement
    let achievExists = await queryDB(`SELECT *
                                      FROM user_has_achievement
                                      WHERE user_id_user = ?
                                        AND achievement_id_achieve = ?`,
        [req.params.id_user, req.params.id_achieve])

    if (achievExists.length > 0) return res.status(404).send("user already has it.");

    await queryDB(`INSERT INTO user_has_achievement
                   SET user_id_user           = ?,
                       achievement_id_achieve = ?,
                       achieve_level          = ?,
                       date                   = ?`,
        [req.params.id_user, req.params.id_achieve, req.body.achieve_level, new Date()]);

    res.json({success: true, achievement: "added to user."});

});

// delete achievement from user [id_achieve, id_user]

router.post('/:id_achieve/delete-from/:id_user/', async function (req, res) {
    let userAchieve = await queryDB(`SELECT *
                                     FROM user_has_achievement
                                     WHERE user_id_user = ?
                                       AND achievement_id_achieve = ?`, [req.params.id_user, req.params.id_achieve]);

    if (userAchieve.length === 0) return res.status(400).send("there's no user with this achievement.");

    await queryDB(`DELETE
                   FROM user_has_achievement
                   WHERE user_id_user = ?
                     AND achievement_id_achieve = ?`, [req.params.id_user, req.params.id_achieve]);

    let userAchievements = await queryDB(`SELECT a.id_achieve,
                                                 (SELECT count(*)
                                                  FROM user_has_achievement
                                                  where user_has_achievement.achievement_id_achieve = a.id_achieve) AS "achievement level",
                                                 a.title,
                                                 a.description,
                                                 a.url
                                          FROM achievement a
                                                   JOIN user_has_achievement ua ON a.id_achieve = ua.achievement_id_achieve
                                                   JOIN user u ON u.id_user = ua.user_id_user
                                          WHERE id_user = ?`, [req.params.id_user]);

    res.json({success: true, userAchievements});

})

// hide achievement from user [id_achieve, id_user]

router.post('/hide/:id_achievement', async function (req, res) {
    await queryDB(`UPDATE user_has_achievement
                   SET visible = false
                   WHERE id_achievement = ?
                     AND id_user = ?`, [req.params.id_achievement, req.session.id_user]);

    res.json(await queryDB(`SELECT *
                            from user_has_achievement
                            where id_achievement = ?`, [req.params.id_achievement]))
});

// disclose achievement from user [id_achieve, id_user]

router.post('/disclose/:id_achievement', async function (req, res) {
    await queryDB(`UPDATE user_has_achievement 
                   SET visible = true
                   WHERE id_achievement = ?
                     AND id_user = ?`, [req.params.id_achievement, req.session.id_user]);

    res.json(await queryDB(`SELECT *
                            from user_has_achievement
                            where id_achievement = ?`, [req.params.id_achievement]))
});

// get achievement visibility [id_achievement]
// TODO: adicionar na coleção do postman
router.get('/:id_achievement/visibility', async function (req, res) {
    res.json(await queryDB(`SELECT visible
                            FROM user_has_achievement
                            WHERE id_achievement = ?`, [req.params.id_achievement]))
});

// [ADMIN] get /achievements   #    get all achievements [id_achieve]

router.get('/', async function (req, res) {

    let all = await queryDB(`SELECT *
                             FROM achievement`);
    res.json(all);

});

// [ADMIN] post /achievement/add/:id_achieve       #       add new achievement to DB [ADMIN]

router.post('/add/:id_achieve', async function (req, res) {

    let achieveExists = await queryDB(`SELECT *
                                       FROM achievement
                                       WHERE id_achieve = ?`, [req.params.id_achieve]);

    if (achieveExists.length > 0) return res.status(400).send("achievement already exists.");

    await queryDB(`INSERT INTO achievement
                   SET ?`, {
        id_achieve: req.params.id_achieve,
        achieve_max_level: req.body.achieve_max_level, //TODO: como aplicar achieve_max_level 3?
        title: req.body.title,
        description: req.body.description,
        url: req.body.url
    });

    let newAchieve = await queryDB(`SELECT *
                                    FROM achievement
                                    WHERE id_achieve = ?`, [req.params.id_achieve]);

    res.json(newAchieve);
})

// [ADMIN] /achievement/del/:id_achieve       #       delete achievement from DB [ADMIN]

router.post('/del/:id_achieve', async function (req, res) {

    let achieveExists = await queryDB(`SELECT *
                                       FROM achievement
                                       WHERE id_achieve = ?`, [req.params.id_achieve]);

    if (achieveExists.length === 0) return res.status(400).send("achievement doesn't exist.");

    await queryDB(`DELETE
                   FROM achievement
                   WHERE id_achieve = ?`, [req.params.id_achieve]);

    res.json({success: true, achievement: "deleted"});
})

module.exports = router;