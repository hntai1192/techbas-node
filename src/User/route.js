const user = require('./controller');
const { authenticateJWT } = require("../Middleware/auth");

module.exports = (app) => {
    app.post('/login', user.login);

    app.get('/user/get-list', authenticateJWT, user.getListUser);
    app.get('/user/department/get-list-user', authenticateJWT, user.getListUserAllDepartment);
    app.get('/user/department/:id/get-list-user', authenticateJWT, user.getListUserByDepartmentId);
    app.get('/user/team/get-list-user', authenticateJWT, user.getListUserAllTeam);
    app.get('/user/team/:id/get-list-user', authenticateJWT, user.getListUserByTeamId);
}