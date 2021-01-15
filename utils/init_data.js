const { chunk } = require("lodash");
const { User, Department, Team } = require("../src/User/model");
const { getHashedPassword } = require("./helper");

const LIMIT_DEPARMENT = 10;
const LIMIT_PROJECT = 20;
const LIMIT_MEMBER = 1500;

exports.initData = async () => {
    console.time();
    // await User.deleteMany();
    // await Department.deleteMany();
    // await Team.deleteMany();
    await initDataTeam();
    await initDataDepartment();
    await initDateRootUser();
    await updateTeamMember();
    console.timeEnd();
    console.log("FINISHED")
}

async function initDateRootUser() {
    try {
        const DIRECTION = await User.findOne({ user_role: "DIRECTION" });
        if (!DIRECTION) {
            let user_DIRECTION = new User({ user_name: "direction", user_fullname: "Giám đốc", user_role: "DIRECTION", user_pass: getHashedPassword("123456") });
            await user_DIRECTION.save();
            console.log("Successed initDateRootUser DIRECTION");
        }

        const ADMINs = await User.find({ user_role: "ADMIN" });
        if (!ADMINs.length) {
            let user_ADMINs = await generateDataUsers("ADMIN");
            await User.insertMany(user_ADMINs);
            console.log("Successed initDateRootUser ADMIN");
        }

        const MEMBERs = await User.find({ user_role: "MEMBER" });
        if (!MEMBERs.length) {
            const user_MEMBERs = await generateDataUsers("MEMBER");
            await User.insertMany(user_MEMBERs);
            console.log("Successed initDateRootUser MEMBER");
        }
    } catch (error) {
        console.log(error);
        console.log("Fail initDateRootUser");
    }

}

async function initDataTeam() {
    try {
        const team = await Team.findOne();
        if (!team) {
            const listData = [];
            for (let index = 0; index < LIMIT_PROJECT; index++) {
                const data = { team_name: `Dự án số ${index + 1}` };
                listData.push(data);
            }
            await Team.insertMany(listData);
            console.log("Successed initDataTeam");
        }
    } catch (error) {
        console.log("Fail initDataTeam");
    }

}

async function initDataDepartment() {
    try {
        const department = await Department.findOne();
        if (!department) {
            const teams = await Team.find();
            const listData = [];
            for (let index = 0; index < LIMIT_DEPARMENT; index++) {
                const data = { department_name: `Phòng Ban ${index + 1}`, team_ids: [teams[index], teams[index + LIMIT_DEPARMENT]] };
                listData.push(data);
            }
            await Department.insertMany(listData);
            console.log("Successed initDataDepartment");
        }
    } catch (error) {
        console.log("Fail initDataDepartment");
    }

}

async function updateTeamMember() {
    try {
        const departments = await Department.find();
        departments.forEach(async department => {
            if (department.team_ids.length) {
                const users = await User.find({ department_id: department });
                const size = Math.ceil(users.length / department.team_ids.length);
                const chunk_data = chunk(users, size);
                department.team_ids.forEach(async (id, index) => {
                    await Team.findOneAndUpdate({ _id: id }, { user_ids: chunk_data[index] })
                });
            }

        });
        console.log("Successed updateTeamMember");
    } catch (error) {
        console.log("Fail updateTeamMember");

    }
}


async function generateDataUsers(type) {
    let result = []
    const departments = await Department.find();
    if (type === "ADMIN") {
        for (let index = 0; index < LIMIT_DEPARMENT; index++) {
            const data = { user_name: `admin${index}`, user_fullname: `Trưởng phòng ${index}`, user_role: `ADMIN`, user_pass: getHashedPassword("123456"), department_id: departments[index] };
            result.push(data);
        }
    }
    if (type === "MEMBER") {
        for (let index = 0; index < LIMIT_MEMBER; index++) {
            const offset_dep = Math.floor(Math.random() * departments.length);
            const data = { user_name: `member${index}`, user_fullname: `Thành viên ${index}`, user_role: `MEMBER`, user_pass: getHashedPassword("123456"), department_id: departments[offset_dep] };
            result.push(data);
        }
    }
    return result;
}