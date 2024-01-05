import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import helmet from "helmet";
import Server from "./server/server";
import usuariosRoutes from "./routes/usuarios.routes";
import authRoutes from "./routes/auth.routes";
import categoriasRoutes from "./routes/categorias.routes";
import productosRoutes from "./routes/productos.routes";
import rolesRoutes from "./routes/roles.routes";
import proveedoresRoutes from './routes/proveedores.routes';
import clientesRoutes from './routes/clientes.routes';
import {
  crearCategoriaInicial,
  crearMetodosDePago,
  crearProveedorInicial,
  crearRoles,
} from "./libs/setUpInicial";

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
//setUp Inicial
crearRoles();
crearCategoriaInicial();
crearProveedorInicial();
crearMetodosDePago();

//Settings
server.app.use(bodyParser.json());
server.app.use(
  express.urlencoded({ extended: true, limit: 10000, parameterLimit: 100 })
);
server.app.use(helmet());
server.app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
//Midellweres
server.app.use(morgan("dev"));
server.app.use(express.json());

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
server.app.use("/", proveedoresRoutes);
server.app.use("/", clientesRoutes);

