// import dotenv from "dotenv";
// dotenv.config();

// import { Sequelize } from "sequelize";
// import { UserFactory } from "./user.js";
// import { ReportFactory } from "./report.js";
// import { MachineFactory } from "./machine.js";

// const sequelize = process.env.DB_URL
//   ? new Sequelize(process.env.DB_URL)
//   : new Sequelize(
//       process.env.DB_NAME || "",
//       process.env.DB_USER || "",
//       process.env.DB_PASSWORD,
//       {
//         host: "localhost",
//         dialect: "postgres",
//         dialectOptions: {
//           decimalNumbers: true,
//         },
//       }
//     );

// const User = UserFactory(sequelize);
// const Report = ReportFactory(sequelize);
// const Machine = MachineFactory(sequelize);

// User.hasMany(Report, { foreignKey: "assignedUserId" });
// Report.belongsTo(User, { foreignKey: "assignedUserId", as: "assignedUser" });

// Report.hasMany(Machine, { foreignKey: "assignedReportId" });
// Machine.belongsTo(Report, {
//   foreignKey: "assignedReportId",
//   as: "assignedReport",
// });

// export { sequelize, User, Report };

import User from './user';

export default { User };