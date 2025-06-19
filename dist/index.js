"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwt_1 = __importDefault(require("./middleware/jwt"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const path_1 = __importDefault(require("path"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const transaction_routes_1 = __importDefault(require("./routes/transaction.routes"));
const financialProfile_routes_1 = __importDefault(require("./routes/financialProfile.routes"));
// intialize express
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use("/auth", auth_routes_1.default);
app.use("/user", user_routes_1.default);
app.use("/transaction", transaction_routes_1.default);
app.use("/financial-profile", financialProfile_routes_1.default);
app.get("/", (req, res) => {
    res.render("index", {
        title: "seimbang.in",
    });
});
app.get("/protected", jwt_1.default, (req, res) => {
    res.send({
        message: "This is a protected route",
        data: {
            user: req.user,
        },
    });
});
app.listen(3000, () => {
    console.log("🎉 Server Expressnya dah jalan ya beb! 🚀 disini yhh http://localhost:3000");
});
