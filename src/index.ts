import express from "express";
import path from "path";
import morgan from "morgan";
import bodyParser from "body-parser";
import helmet from "helmet";
import Server from "./server/server";
import usuariosRoutes from "./routes/usuarios.routes";
import authRoutes from "./routes/auth.routes";
import categoriasRoutes from "./routes/categorias.routes";
import productosRoutes from "./routes/productos.routes";
import rolesRoutes from "./routes/roles.routes";

const server = new Server();

server.app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, auth-token"
  );
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  //res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

//Settings
server.app.use(bodyParser.json());
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(helmet());
server.app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
//Midellweres
server.app.use(morgan("dev"));
server.app.use(express.json());
//Multer
server.app.use("/uploads", express.static(path.resolve("uploads")));
//Server initialization
server.Start(() => {
  console.log(`Servidor corriendo en el puerto: ${server.port}`);
});
//Routes
server.app.use("/", usuariosRoutes);
server.app.use("/", authRoutes);
server.app.use("/", categoriasRoutes);
server.app.use("/", productosRoutes);
server.app.use("/", rolesRoutes);
