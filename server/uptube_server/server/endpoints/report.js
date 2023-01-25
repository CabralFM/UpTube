const express = require("express");
const router = express.Router();
const {queryDB} = require("./../connection.js");
const userService = require("../services/userService");
const videoService = require("../services/videoService");

// get report categories
router.get('/categories', async function (req, res) {
    const id_user = req.session.id_user;
    await userService.userSession(id_user);
    const categories = await queryDB('SELECT * FROM report_category');
    res.json({success: true, categories});
})

// get all reports
router.get('/get/all', async function (req, res) {
    // check if admin?
    const reports = await queryDB('SELECT * FROM report');
    res.json({success: true, reports});
})

// solve report
router.post('/:id_report/solve', async function (req, res) {
    try {
        // check if admin?
        const solve = await queryDB(`INSERT INTO report
                                     SET ?`, {
            solved: 1,
            id_admin: req.session.id_user,
            observation: req.body.observation
        });
        res.json({success: true, solve});
    } catch (err) {
        return res.status(err.code || 500).json({success: false, error: err.message || err});
    }
})

// unsolve report
router.post('/:id_report/unsolve', async function (req, res) {
    try {
        // check if admin?
        const unsolve = await queryDB(`UPDATE report
                                       SET ?
                                       WHERE id = ?`, {
            solved: 1,
            id_admin: req.session.id_user,
            observation: req.body.observation
        });
        res.json({success: true, unsolve});
    } catch (err) {
        return res.status(err.code || 500).json({success: false, error: err.message || err});
    }
})


// get video reports
router.get('/get/video/:id_video', async function (req, res) {
    try {
        const id_video = req.params.id_video;
        const id_user = req.session.id_user;
        await userService.checkIfUserExists(id_user);
        await userService.userSession(id_user);
        await videoService.checkIfVideoExists(id_video);

        let reports = await queryDB(`SELECT *
                                     FROM report
                                     WHERE id_video = ?`, [id_video]);
        if (reports.length === 0) {
            res.json({success: false, message: 'video not reported'});
            return;
        }
        res.json({success: true, reports: reports});
    } catch (err) {
        return res.status(err.code || 500).json({success: false, error: err.message || err});
    }
})

// get user reports
router.get('/get/user/:id_user(\\d+)', async function (req, res) {
    try {
        const id_video = req.params.id_video;
        const id_user = req.session.id_user;
        await userService.checkIfUserExists(id_user);
        await userService.userSession(id_user);
        await videoService.checkIfVideoExists(id_video);

        let reports = await queryDB(`SELECT *
                                     FROM report
                                     WHERE id_reporter = ?`, [id_user]);
        if (reports.length === 0) {
            res.json({success: false, message: `no reports from user ${id_user}`});
            return;
        }
        res.json({success: true, reports: reports});
    } catch (err) {
        return res.status(err.code || 500).json({success: false, error: err.message || err});
    }
})

// report video
router.post('/video/:id_video', async function (req, res) {
    try {
        const id_reporter = req.session.id_user;
        const id_video = req.params.id_video;
        await userService.checkIfUserExists(id_reporter);
        await userService.userSession(id_reporter);
        await videoService.checkIfVideoExists(id_video);

        // check if user owns video
        const videoOwner = await queryDB(`SELECT v.id_user
                                          FROM video v
                                          WHERE v.id = ?`, [id_video]);
        if (id_reporter === videoOwner[0].id_user) {
            res.json({success: false, message: `user can't report is own video`});
            return;
        }

        // check if user already reported video
        const reports = await queryDB(`SELECT *
                                       FROM report
                                       WHERE id_reporter = ?
                                         AND id_video = ?
                                       LIMIT 1`, [id_reporter, id_video]);

        if (reports[0]) {
            res.json({
                success: false,
                message: `video already reported by user ${id_reporter}`,
                report: reports[0]
            });
            return;
        }

        // if not, then report
        const report = await queryDB(`INSERT INTO report
                                      SET ?`, {
            id_reporter: id_reporter,
            id_video: id_video,
            category: req.body.category

        });
        const newReport = await queryDB('SELECT * FROM report r WHERE r.id = ?', [report.insertId]);
        res.json({success: true, new_report: newReport[0]});
    } catch (err) {
        return res.status(err.code || 500).json({success: false, error: err.message || err});
    }
});

// report user
router.post('/user/:id_user', async function (req, res) {
    try {
        const id_reporter = req.session.id_user;
        const id_user = req.params.id_user;
        await userService.checkIfUserExists(id_reporter);
        await userService.userSession(id_reporter);

        // check if user owns video
        const himself = await queryDB(`SELECT u.id
                                       FROM user u
                                       WHERE u.id = ?`, [id_user]);
        if (id_reporter === himself[0].id_user) {
            res.json({success: false, message: `user can't report himself`});
            return;
        }

        // check if user already reported user
        const reports = await queryDB(`SELECT *
                                       FROM report
                                       WHERE id_reporter = ?
                                         AND id_user = ?
                                       LIMIT 1`, [id_reporter, id_user]);
        if (reports[0]) {
            res.json({
                success: false,
                message: `user ${id_user} already reported by user ${id_reporter}`,
                report: reports[0]
            });
            return;
        }


        // if not, then report
        const report = await queryDB(`INSERT INTO report
                                      SET ?`, {
            id_reporter: id_reporter,
            id_user: id_user,
            category: req.body.category
        });
        const newReport = await queryDB('SELECT * FROM report r WHERE r.id = ?', [report.insertId]);
        res.json({success: true, new_report: newReport[0]});
    } catch (err) {
        return res.status(err.code || 500).json({success: false, error: err.message || err});
    }
});

// report comment
router.post('/comment/:id_comment', async function (req, res) {
    try {
        const id_reporter = req.session.id_user;
        const id_comment = req.params.id_comment;
        await userService.userSession(id_reporter);

        // check if comment belongs to user in session
        const himself = await queryDB(`SELECT c.id_user
                                       FROM comment c
                                       WHERE c.id = ?`, [id_comment]);
        if (id_reporter === himself[0].id_user) {
            res.json({success: false, message: `user can't report his own comment`});
            return;
        }

        // check if user already reported comment
        const reports = await queryDB(`SELECT *
                                       FROM report
                                       WHERE id_reporter = ?
                                         AND id_comment = ?
                                       LIMIT 1`, [id_reporter, id_comment]);
        if (reports[0]) {
            res.json({
                success: false,
                message: `comment already reported by user ${id_reporter}`,
                report: reports[0]
            });
            return;
        }


        // if not, then report
        const report = await queryDB(`INSERT INTO report
                                      SET ?`, {
            id_reporter: id_reporter,
            id_comment: id_comment,
            category: req.body.category
        });
        const newReport = await queryDB('SELECT * FROM report r WHERE r.id = ?', [report.insertId]);
        res.json({success: true, new_report: newReport[0]});
    } catch (err) {
        return res.status(err.code || 500).json({success: false, error: err.message || err});
    }
});


module.exports = router;