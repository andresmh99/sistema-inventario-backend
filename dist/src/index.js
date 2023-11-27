"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const server_1 = __importDefault(require("./server/server"));
const usuarios_routes_1 = __importDefault(require("./routes/usuarios.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const categorias_routes_1 = __importDefault(require("./routes/categorias.routes"));
const productos_routes_1 = __importDefault(require("./routes/productos.routes"));
const server = new server_1.default();
server.app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");
    // Request methods you wish to allow
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    // Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, auth-token");
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    //res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});
//Settings
server.app.use(body_parser_1.default.json());
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use((0, helmet_1.default)());
server.app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
//Midellweres
server.app.use((0, morgan_1.default)("dev"));
server.app.use(express_1.default.json());
//Multer
server.app.use("/uploads", express_1.default.static(path_1.default.resolve("uploads")));
//Server initialization
server.Start(() => {
    console.log(`Servidor corriendo en el puerto: ${server.port}`);
});
//Routes
server.app.use("/", usuarios_routes_1.default);
server.app.use("/", auth_routes_1.default);
server.app.use("/", categorias_routes_1.default);
server.app.use("/", productos_routes_1.default);
